/* ─── palette tokens (warm yellow theme) ─────────────────── */
export const C = {
    cream: "#FEFBE8",
    creamDark: "#F5F0C8",
    amber: "#D4A017",
    amberLight: "#F0C040",
    amberSoft: "#FBF0C0",
    warmGray: "#6B6340",
    text: "#2E2A1A",
    textMuted: "#8A8060",
    border: "#E8DFA0",
    borderStrong: "#C9BB70",
    green: "#3D7A4F",
    greenBg: "#EAF5EE",
    red: "#B94040",
    redBg: "#FDEAEA",
    white: "#FFFEF5",
};


/* ─── Modal Popup (click on it and it will come infront of screen) ─────────────────────────────────────── */
export const Overlay = ({ children, onClose }) => (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[rgba(30,26,10,0.45)] backdrop-blur-sm flex items-center justify-center p-3.5"
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
);
  
  /* ─── pill badge (for showing status or priority)─────────────────────────────────────────── */
export const Pill = ({ label, color = "amber" }) => {
    const styles = {
        amber: "bg-yellow-100 text-yellow-800",
        red: "bg-red-100 text-red-700",
        green: "bg-green-100 text-green-700 ",
    };

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs tracking-wide font-semibold ${styles[color]}`}
        >
            {label}
        </span>
    );
};
  
