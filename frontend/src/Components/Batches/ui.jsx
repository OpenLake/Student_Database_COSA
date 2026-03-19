const BATCH_COLORS = [
  { bg: "#f0fdf4", border: "#bbf7d0", pill: "#166534", pillBg: "#dcfce7" },
  { bg: "#fefce8", border: "#fde68a", pill: "#92400e", pillBg: "#fef3c7" },
  { bg: "#f0f9ff", border: "#bae6fd", pill: "#0c4a6e", pillBg: "#e0f2fe" },
  { bg: "#fdf4ff", border: "#e9d5ff", pill: "#581c87", pillBg: "#f3e8ff" },
  { bg: "#fff1f2", border: "#fecdd3", pill: "#881337", pillBg: "#ffe4e6" },
  { bg: "#f0fdfa", border: "#99f6e4", pill: "#134e4a", pillBg: "#ccfbf1" },
];

const STATUS_MAP = {
  Draft: {
    label: "Draft",
    dot: "#a8a29e",
    bg: "#f5f5f4",
    color: "#78716c",
    border: "#e7e5e0",
  },
  Active: {
    label: "Active",
    dot: "#f59e0b",
    bg: "#fffbeb",
    color: "#92400e",
    border: "#fde68a",
  },
  Submitted: {
    label: "Submitted",
    dot: "#22c55e",
    bg: "#f0fdf4",
    color: "#166534",
    border: "#bbf7d0",
  },
  Archived: {
    label: "Archived",
    dot: "#274582",
    bg: "#86aaceac",
    color: "#374151",
    border: "#6f8ebe",
  },
};

function Brackets({ color }) {
  const s = { position: "absolute", width: 12, height: 12 };
  return (
    <>
      <span
        style={{
          ...s,
          top: 8,
          left: 8,
          borderTop: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
          borderRadius: "3px 0 0 0",
        }}
      />
      <span
        style={{
          ...s,
          top: 8,
          right: 8,
          borderTop: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
          borderRadius: "0 3px 0 0",
        }}
      />
    </>
  );
}

export function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.Draft;
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 9px",
        borderRadius: 999,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
        }}
      />
      {s.label}
    </span>
  );
}

export function CertThumb({ batch }) {
  const colorIndex = Math.floor(Math.random() * BATCH_COLORS.length);
  const c = BATCH_COLORS[colorIndex % BATCH_COLORS.length];
  return (
    <div
      style={{
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: 14,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 14,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Brackets color={c.border} />
      <span
        className="text-[9px] font-extrabold
        tracking-[0.12em] uppercase
        px-[10px] py-[3px]
        rounded-full text-center
        whitespace-pre-line border"
        style={{
          background: c.pillBg,
          color: c.pill,
          borderColor: c.border,
        }}
      >
        {batch.title?.split("-").join("\n")}
      </span>
      <div
        style={{
          width: "58%",
          height: 2,
          borderRadius: 2,
          background: c.border,
        }}
      />
      <div
        style={{
          width: "38%",
          height: 2,
          borderRadius: 2,
          background: c.border,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: `2px solid ${c.border}`,
          marginTop: 2,
        }}
      />
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(28,25,23,0.22)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 24,
          width: "100%",
          maxWidth: 500,
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1.5px solid #e7e5e0",
          boxShadow: "0 24px 80px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            borderBottom: "1px solid #f0ede8",
            padding: "16px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "24px 24px 0 0",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 900,
              color: "#1c1917",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1.5px solid #e7e5e0",
              background: "#fafaf5",
              cursor: "pointer",
              fontSize: 16,
              color: "#78716c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "18px 22px" }}>{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#1a3d15",
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1.5px solid #e7e5e0",
            borderRadius: 12,
            padding: "9px 12px",
            fontSize: 13,
            color: "#1c1917",
            background: "#fafaf5",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1.5px solid #e7e5e0",
            borderRadius: 12,
            padding: "9px 12px",
            fontSize: 13,
            color: "#1c1917",
            background: disabled ? "#f5f5f4" : "#fafaf5",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      )}
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "8px 0 10px",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#a8a29e",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#f0ede8" }} />
    </div>
  );
}
