import { useState, useEffect } from "react";
import { Modal, Field, Divider } from "./ui";
import { fetchBatchUsers } from "../../services/batch";
import { Users, ChevronDown, ChevronUp, Search, X } from "lucide-react";

/* ─── tiny helpers ─────────────────────────────────────────── */
const toId = (s) =>
  s && typeof s === "object" ? (s._id || s).toString() : String(s);

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

const DEFAULT_PIC = "https://www.gravatar.com/avatar/?d=mp";

/* ─── Avatar ────────────────────────────────────────────────── */
function Avatar({ student, size = 34 }) {
  const name = student.personal_info?.name || "";
  const pic = student.personal_info?.profilePic;
  const hasRealPic = pic && pic !== DEFAULT_PIC;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#dcfce7",
        border: "1.5px solid #bbf7d0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 800,
        color: "#166534",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {hasRealPic ? (
        <img
          src={pic}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}

/* ─── Checkbox ──────────────────────────────────────────────── */
function Checkbox({ checked, disabled }) {
  return (
    <div
      style={{
        width: 17,
        height: 17,
        borderRadius: 5,
        border: `1.5px solid ${checked ? "#16a34a" : "#d4d0cb"}`,
        background: checked ? "#16a34a" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {checked && (
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
          <path
            d="M1 3.5L3.5 6L9 1"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/* ─── StudentCard ───────────────────────────────────────────── */
function StudentCard({ student, selected, onToggle, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : () => onToggle(toId(student._id))}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 12,
        border: `1.5px solid ${selected ? "#bbf7d0" : "#e7e5e0"}`,
        background: selected ? "#f0fdf4" : "#fafaf5",
        cursor: disabled ? "default" : "pointer",
        transition: "border-color 0.15s, background 0.15s",
        userSelect: "none",
      }}
    >
      <Avatar student={student} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#1c1917",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {student.personal_info?.name || "Unknown Student"}
        </div>

        <div style={{ fontSize: 10, color: "#78716c", marginTop: 1 }}>
          {student.user_id || toId(student._id)}
        </div>

        {(student.academic_info?.program || student.academic_info?.branch) && (
          <div
            style={{
              fontSize: 10,
              color: "#a8a29e",
              marginTop: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {[student.academic_info.program, student.academic_info.branch]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
      </div>

      <Checkbox checked={selected} disabled={disabled} />
    </div>
  );
}

/* ─── StudentsPanel ─────────────────────────────────────────── */
function StudentsPanel({ form, setForm, isViewOnly }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelected, setLocalSelected] = useState(new Set());
  const [search, setSearch] = useState("");

  const studentIds = (form.students || []).map(toId);
  const count = studentIds.length;

  /* reset when panel closes */
  const closePanel = () => {
    setOpen(false);
    setSearch("");
  };

  /* fetch when opening */
  useEffect(() => {
    if (!open) return;
    if (count === 0) {
      setDetails([]);
      setLocalSelected(new Set());
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchBatchUsers(studentIds).then((data) => {
      if (cancelled) return;
      setDetails(Array.isArray(data) ? data : []);
      setLocalSelected(new Set(studentIds));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (id) =>
    setLocalSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () =>
    setLocalSelected(new Set(details.map((s) => toId(s._id))));

  const deselectAll = () => setLocalSelected(new Set());

  const saveSelection = () => {
    setForm((f) => ({ ...f, students: Array.from(localSelected) }));
    closePanel();
  };

  const cancelSelection = () => {
    setLocalSelected(new Set(studentIds));
    closePanel();
  };

  const filtered = details.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.personal_info?.name?.toLowerCase().includes(q) ||
      s.user_id?.toLowerCase().includes(q) ||
      s.academic_info?.branch?.toLowerCase().includes(q) ||
      s.academic_info?.program?.toLowerCase().includes(q)
    );
  });

  const allSelected =
    details.length > 0 && details.every((s) => localSelected.has(toId(s._id)));

  const pendingChanges = open && !isViewOnly &&
    (localSelected.size !== count ||
      !studentIds.every((id) => localSelected.has(id)));

  return (
    <div style={{ marginBottom: 12 }}>
      {/* ── header row ── */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 12px",
          border: "1.5px solid #e7e5e0",
          borderRadius: open ? "12px 12px 0 0" : 12,
          background: "#fafaf5",
          cursor: "pointer",
          transition: "border-radius 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={13} color="#78716c" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>
            {count} {count === 1 ? "Participant" : "Participants"}
          </span>
          {pendingChanges && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: "#92400e",
                background: "#fef3c7",
                border: "1px solid #fde68a",
                padding: "1px 7px",
                borderRadius: 999,
              }}
            >
              {localSelected.size} selected
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={14} color="#78716c" />
        ) : (
          <ChevronDown size={14} color="#78716c" />
        )}
      </div>

      {/* ── expanded panel ── */}
      {open && (
        <div
          style={{
            border: "1.5px solid #e7e5e0",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            background: "#fff",
            overflow: "hidden",
          }}
        >
          {/* search + bulk controls */}
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid #f0ede8",
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            {/* search input */}
            <div style={{ flex: 1, position: "relative" }}>
              <Search
                size={11}
                color="#a8a29e"
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, ID, branch…"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1.5px solid #e7e5e0",
                  borderRadius: 8,
                  padding: "5px 28px 5px 24px",
                  fontSize: 11,
                  color: "#1c1917",
                  background: "#fafaf5",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    color: "#a8a29e",
                  }}
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Select All / Deselect All — only in edit/create */}
            {!isViewOnly && details.length > 0 && (
              <button
                onClick={allSelected ? deselectAll : selectAll}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: "1.5px solid #e7e5e0",
                  background: "#fafaf5",
                  color: "#1a3d15",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>

          {/* student list */}
          <div
            style={{
              maxHeight: 240,
              overflowY: "auto",
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 64,
                  color: "#a8a29e",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Loading participants…
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "#a8a29e",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {count === 0
                  ? "No participants added to this batch yet."
                  : "No results match your search."}
              </div>
            ) : (
              filtered.map((student) => (
                <StudentCard
                  key={toId(student._id)}
                  student={student}
                  selected={localSelected.has(toId(student._id))}
                  onToggle={toggle}
                  disabled={isViewOnly}
                />
              ))
            )}
          </div>

          {/* panel footer */}
          <div
            style={{
              borderTop: "1px solid #f0ede8",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* left: count summary */}
            <span
              style={{ fontSize: 10, color: "#a8a29e", fontWeight: 600, flex: 1 }}
            >
              {isViewOnly
                ? `${count} participant${count !== 1 ? "s" : ""} in batch`
                : `${localSelected.size} of ${details.length} selected`}
            </span>

            {isViewOnly ? (
              <button
                onClick={closePanel}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #e7e5e0",
                  background: "#fafaf5",
                  color: "#78716c",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={cancelSelection}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #e7e5e0",
                    background: "#fafaf5",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveSelection}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "6px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#1a3d15",
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Save Selection
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main ModalDialog ──────────────────────────────────────── */
export default function ModalDialog({
  modalOpen,
  closeModal,
  viewingBatch,
  editing,
  form,
  setForm,
  saveDraft,
  submitBatch,
  events = [],
  templates = [],
  handleEventChange,
  handleTemplateChange,
}) {
  const hc = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const isViewOnly =
    viewingBatch && Object.keys(viewingBatch).length > 0;

  const selectStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1.5px solid #e7e5e0",
    borderRadius: 12,
    padding: "9px 12px",
    fontSize: 13,
    color: "#1c1917",
    background: "#fafaf5",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#1a3d15",
    marginBottom: 5,
  };

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      title={
        viewingBatch
          ? `View — ${viewingBatch.title}`
          : editing
            ? `Edit — ${editing.title}`
            : "Create New Batch"
      }
    >
      <Field
        label="Batch Name"
        name="title"
        value={form.title}
        onChange={hc}
        placeholder="Hackathon 2026 Certificates"
      />

      <Divider label="Event Details" />

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Event</label>
        <select
          name="eventId"
          value={form.eventId || ""}
          disabled={isViewOnly}
          onChange={(e) => handleEventChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select an event</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="Event Name"
        name="eventName"
        value={form.eventName || ""}
        onChange={hc}
        placeholder="Event Name"
        disabled
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <Field
          label="Organization"
          name="org"
          value={form.org}
          onChange={hc}
          placeholder="Organization"
          disabled
        />
        <Field
          label="Start Date"
          name="startDate"
          type="text"
          value={form.startDate}
          onChange={hc}
          disabled
        />
        <Field
          label="End Date"
          name="endDate"
          type="text"
          value={form.endDate}
          onChange={hc}
          disabled
        />
      </div>

      <Field
        label="Description"
        name="description"
        type="textarea"
        value={form.description}
        onChange={hc}
        placeholder="Brief description…"
        disabled
      />

      <Divider label="Certificate Details" />

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Template</label>
        <select
          name="templateId"
          value={form.templateId || ""}
          onChange={(e) => handleTemplateChange(e.target.value)}
          disabled={isViewOnly}
          style={selectStyle}
        >
          <option value="">Select a template</option>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field
          label="Signatory Name"
          name="sigName"
          value={form.signatoryDetails?.sigName || ""}
          onChange={hc}
          placeholder="John Smith"
          disabled
        />
        <Field
          label="Role"
          name="sigRole"
          value={form.sigRole || ""}
          onChange={hc}
          placeholder="Dean"
          disabled
        />
      </div>

      <Divider label="Students" />

      <StudentsPanel
        form={form}
        setForm={setForm}
        isViewOnly={isViewOnly}
      />

      {/* ── modal footer buttons ── */}
      <div className="flex gap-[9px]">
        {!isViewOnly ? (
          <>
            <button
              onClick={closeModal}
              className="px-[15px] py-[9px] !rounded-2xl border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] text-red-600 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex-1" />

            <button
              onClick={saveDraft}
              className="px-[17px] py-[9px] !rounded-2xl border-[1.5px] border-amber-200 bg-amber-50 text-amber-800 text-xs font-extrabold cursor-pointer"
            >
              Save Draft
            </button>

            <button
              onClick={submitBatch}
              className="px-5 py-[9px] !rounded-2xl bg-[#1a3d15] text-white text-xs font-extrabold cursor-pointer"
            >
              Submit Batch
            </button>
          </>
        ) : (
          <button
            onClick={closeModal}
            className="px-[15px] py-[9px] !rounded-2xl border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] text-gray-600 text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </Modal>
  );
}
