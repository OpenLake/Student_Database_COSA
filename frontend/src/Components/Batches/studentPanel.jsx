import { useState, useEffect } from "react";
import { fetchBatchUsers } from "../../services/batch";
import { Users, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { Avatar, Checkbox } from "../Batches/modalDialog";
import { Modal } from "./ui";
/* ─── tiny helpers ─────────────────────────────────────────── */
const toId = (s) => s?._id;

/* ─── StudentsPanel ─────────────────────────────────────────── */
export default function StudentsPanel({
  form,
  setForm,
  isViewOnly,
  selectedEvent,
}) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelected, setLocalSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  let studentIds = form.students || [];
  let count = studentIds?.length || 0;
  /* reset when panel closes */
  const closePanel = () => {
    setOpen(false);
    setSearch("");
  };

  /* fetch when opening */
  useEffect(() => {
    if (!open) return;
    if (count === 0) {
      count = selectedEvent.participants?.length || 0;
      if (count === 0) {
        setDetails([]);
        setLocalSelected(new Set());
        return;
      } else studentIds = selectedEvent.participants || [];
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
  }, [open, selectedEvent]);

  const toggle = (id) =>
    setLocalSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () => setLocalSelected(new Set(details.map((s) => s?._id)));

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
      s._id?.toString().toLowerCase().includes(q) ||
      s.academic_info?.branch?.toLowerCase().includes(q) ||
      s.academic_info?.program?.toLowerCase().includes(q)
    );
  });

  const allSelected =
    details.length > 0 && details.every((s) => localSelected.has(s?._id));

  const pendingChanges =
    open &&
    !isViewOnly &&
    (localSelected.size !== count ||
      !studentIds.every((id) => localSelected.has(id)));
  return (
    <>
      {/* ── trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          width: "100%",
          padding: "9px 12px",
          borderRadius: 12,
          border: "1.5px solid #e7e5e0",
          background: "#fafaf5",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
          color: "#1c1917",
          fontFamily: "inherit",
        }}
      >
        <Users size={13} color="#78716c" />
        <span style={{ flex: 1, textAlign: "left" }}>View Participants</span>
      </button>

      <Modal open={open} onClose={closePanel} title="View Participants">
        <div className="mt-3">
          <div className="border-[1.5px] border-gray-400 rounded-xl bg-white overflow-hidden">
            {/* search + bulk controls */}
            <div className="px-2.5 py-2 border-b border-[#f0ede8] flex gap-1.5 items-center">
              {/* search input */}
              <div className="flex-1 relative">
                <Search
                  size={11}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#a8a29e] pointer-events-none"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, ID, branch, program"
                  className="w-full box-border border-[1.5px] border-[#e7e5e0] rounded-lg pl-6 pr-7 py-[5px] text-[11px] text-[#1c1917] bg-[#fafaf5] outline-none font-inherit"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 flex items-center text-[#a8a29e]"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* Select All / Deselect All */}
              {!isViewOnly && details.length > 0 && (
                <button
                  onClick={allSelected ? deselectAll : selectAll}
                  className="text-[10px] font-bold px-2.5 py-[5px] !rounded-lg border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] text-[#1a3d15] cursor-pointer whitespace-nowrap font-inherit"
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            {/* student list */}
            <div className="max-h-[240px] overflow-y-auto px-2.5 py-2 flex flex-col gap-1.5">
              {loading ? (
                <div className="flex justify-center items-center h-16 text-[#a8a29e] text-xs font-semibold">
                  Loading participants…
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-6 text-[#a8a29e] text-xs font-semibold">
                  {count === 0
                    ? "No participants added to this batch yet."
                    : "No results match your search."}
                </div>
              ) : (
                filtered.map((student) => (
                  <StudentCard
                    key={student?._id}
                    student={student}
                    selected={localSelected.has(student?._id)}
                    onToggle={toggle}
                    disabled={isViewOnly}
                  />
                ))
              )}
            </div>

            {/* panel footer */}
            <div className="border-t border-[#f0ede8] px-2.5 py-2 flex items-center gap-2">
              {/* left: count summary */}
              <span className="text-[10px] text-[#a8a29e] font-semibold flex-1">
                {isViewOnly
                  ? `${count} participant${count !== 1 ? "s" : ""} in batch`
                  : `${localSelected.size} of ${details.length} selected`}
              </span>

              {isViewOnly ? (
                <button
                  onClick={closePanel}
                  className="text-[11px] font-bold px-3.5 py-1.5 rounded-[10px] border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] text-[#78716c] cursor-pointer font-inherit"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    onClick={cancelSelection}
                    className="text-md font-bold px-3.5 py-1.5 !rounded-xl border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] text-red-600 cursor-pointer font-inherit"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveSelection}
                    className="text-md font-bold px-4 py-1.5 !rounded-xl border-none bg-green-600 text-white cursor-pointer font-inherit"
                  >
                    Save Selection
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── StudentCard ───────────────────────────────────────────── */
function StudentCard({ student, selected, onToggle, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : () => onToggle(student?._id)}
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
          {student.personal_info?.name || "Unknown Student"} -{" "}
          {student.username}
        </div>

        {(student.academic_info?.program ||
          student.academic_info?.branch ||
          student.academic_info.batch_year) && (
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
            {[
              student.academic_info.program,
              student.academic_info.branch,
              student.academic_info.batch_year,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
      </div>

      <Checkbox checked={selected} disabled={disabled} />
    </div>
  );
}
