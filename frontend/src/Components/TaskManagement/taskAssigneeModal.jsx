import { Check, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { fetchTaskUsers } from "../../services/tasks";
import { useEffect } from "react";

const COLORS = [
  { bg: "#ede7fd", text: "#5e35b1" },
  { bg: "#e0f2fe", text: "#0369a1" },
  { bg: "#fce7f3", text: "#be185d" },
  { bg: "#d1fae5", text: "#065f46" },
  { bg: "#fef3c7", text: "#92400e" },
  { bg: "#fee2e2", text: "#991b1b" },
  { bg: "#e0e7ff", text: "#3730a3" },
  { bg: "#f0fdf4", text: "#166534" },
];

const BADGE_STYLES = {
  GENSEC_CULTURAL: { bg: "#fce7f3", text: "#be185d", label: "Gensec Cultural" },
  GENSEC_SCITECH: { bg: "#e0e7ff", text: "#3730a3", label: "Gensec SciTech" },
  GENSEC_SPORTS: { bg: "#d1fae5", text: "#065f46", label: "Gensec Sports" },
  GENSEC_ACADEMIC: { bg: "#e0f2fe", text: "#0369a1", label: "Gensec Academic" },
  CLUB_COORDINATOR: { bg: "#fef3c7", text: "#92400e", label: "Coordinator" },
  STUDENT: { bg: "#f1f5f9", text: "#475569", label: "Member" },
};

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AssigneePickerModal({
  selected = [],
  onConfirm,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(new Set(selected));
  const [taskUsers, setTaskUsers] = useState([]);

  useEffect(() => {
    async function getTaskUsers() {
      const response = await fetchTaskUsers();
      if (Array.isArray(response.data)) {
        setTaskUsers(response.data);
        return;
      }
    }

    getTaskUsers();
  }, []);

  const filtered = taskUsers.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.personal_info.name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allFiltered =
    filtered.length > 0 && filtered.every((u) => checked.has(u._id));

  const toggleAll = () => {
    setChecked((prev) => {
      const next = new Set(prev);
      filtered.forEach((u) =>
        allFiltered ? next.delete(u._id) : next.add(u._id),
      );
      return next;
    });
  };

  const clearAll = () => setChecked(new Set());

  const stackUsers = taskUsers.filter((u) => checked.has(u._id)).slice(0, 4);
  const overflow = checked.size - 4;

  const handleConfirm = () => {
    onConfirm([...checked]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[800px] h-[600px] mx-4 border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-[18px] border-b border-stone-100 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-stone-800">
              Add assignees
            </h3>
            <p className="text-sm text-stone-400 font-semibold mt-0.5">
              {checked.size} member{checked.size !== 1 ? "s" : ""} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg  text-stone-400 hover:bg-stone-50 text-base leading-none transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-[14px] pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
            <input
              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-2 text-sm
              text-stone-700 placeholder:text-stone-500 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-violet-100"
              placeholder="Search by name, role or unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-1.5 px-5 py-2">
          <button
            onClick={toggleAll}
            className="text-sm font-medium px-2.5 py-1 !rounded-xl border transition-colors"
            style={{
              background: "#f4f0fe",
              color: "#6d4bcc",
              borderColor: "#d4c6f7",
            }}
          >
            {allFiltered ? "Deselect all" : "Select all"}
          </button>
          {checked.size > 0 && (
            <button
              onClick={clearAll}
              className="text-sm font-medium px-2.5 py-1 !rounded-xl border border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 transition-colors"
            >
              Clear all
            </button>
          )}
          <span className="ml-auto text-sm text-stone-400">
            {filtered.length} member{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="h-[3px] bg-stone-200" />

        {/* User list */}
        <div className="px-3 py-2 min-h-[300px] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-stone-400 py-7">
              No members found
            </p>
          ) : (
            filtered.map((user) => {
              const isChecked = checked.has(user._id);
              const color =
                COLORS[parseInt(user._id.slice(-2), 16) % COLORS.length] ||
                COLORS[0];
              const badge = BADGE_STYLES[user.role] || BADGE_STYLES.STUDENT;
              const initials = getInitials(user.personal_info.name);

              return (
                <div
                  key={user._id}
                  onClick={() => toggle(user._id)}
                  className="flex items-center gap-2.5 px-2.5 py-2 mb-3 rounded-xl cursor-pointer border transition-all select-none"
                  style={
                    isChecked
                      ? { background: "#f4f0fe", borderColor: "#d4c6f7" }
                      : {
                          background: "transparent",
                          borderColor: "transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isChecked)
                      e.currentTarget.style.background = "#fafafa";
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={
                      isChecked
                        ? {
                            background: "#7c55e8",
                            border: "1.5px solid #7c55e8",
                          }
                        : {
                            background: "transparent",
                            border: "1.5px solid #d1d5db",
                          }
                    }
                  >
                    {isChecked && <Check size={12} color="white" />}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-800 truncate">
                      {user.personal_info.name}
                    </span>
                  </div>
                  <div>
                    <span className="mr-3 text-sm text-stone-400 truncate">
                      {user.personal_info.email}
                    </span>
                  </div>

                  {/* Role badge */}
                  <span
                    className="text-sm font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-stone-100 flex items-center gap-2">
          {/* Avatar stack preview */}
          <div className="flex items-center flex-1">
            {stackUsers.map((u, i) => {
              const color =
                COLORS[parseInt(u._id.slice(-2), 16) % COLORS.length] ||
                COLORS[0];
              return (
                <div
                  key={u._id}
                  className="w-6 h-6 rounded-full border-[1.5px] border-white flex items-center justify-center text-[9px] font-medium"
                  style={{
                    background: color.bg,
                    color: color.text,
                    marginLeft: i === 0 ? 0 : -7,
                    zIndex: 10 - i,
                  }}
                >
                  {getInitials(u.personal_info.name)}
                </div>
              );
            })}
            {overflow > 0 && (
              <div
                className="w-6 h-6 rounded-full border-[1.5px] border-white flex items-center justify-center text-[9px] font-medium bg-stone-100 text-stone-500"
                style={{ marginLeft: -7 }}
              >
                +{overflow}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-sm font-medium px-3.5 py-1.5 !rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={checked.size === 0}
            className="text-sm font-medium px-4 py-1.5 !rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: checked.size > 0 ? "#7c55e8" : "#c4b3f5" }}
          >
            {checked.size > 0 ? `Confirm (${checked.size})` : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
