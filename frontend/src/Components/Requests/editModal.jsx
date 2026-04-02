import { useState } from "react";
import {
  X,
  CalendarDays,
  Users,
  UserCircle2,
  Award,
  Pencil,
  FlameKindling,
  Save,
  Building2,
  ChevronDown,
} from "lucide-react";

import { Overlay, C } from "./ui";
import { approverEditBatch, fetchBatches } from "../../services/batch";
import { toast } from "react-toastify";
import { useAdminContext } from "../../context/AdminContext";

/* EDIT MODAL */
const Field = ({ label, icon: Icon, children, half }) => (
  <div
    style={{
      gridColumn: half ? undefined : "1 / -1",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 700,
        color: C.warmGray,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {Icon && <Icon size={13} strokeWidth={2} />}
      {label} <span style={{ color: C.red }}>*</span>
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 14,
  color: C.text,
  background: C.white,
  border: `1.5px solid ${C.border}`,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

export const EditModal = ({ request, onClose, setRequests }) => {
  const { isUserLoggedIn } = useAdminContext();
  const [form, setForm] = useState({ ...request });
  const [selected, setSelected] = useState(new Set());

  const allIds = (request.users || []).map((u) => u._id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = allIds.some((id) => selected.has(id));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onSave = async () => {
    if (selected.size === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const response = await approverEditBatch({
      ...form,
      users: Array.from(selected),
    });
    response && toast.success(response);
    const updated = await fetchBatches(isUserLoggedIn?._id);
    updated && setRequests(updated);
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div
        style={{
          width: "60vw",
          height: "80vh",
          maxHeight: "90vh",
          background: C.cream,
          borderRadius: 20,
          overflow: "hidden",
          border: `1.5px solid ${C.borderStrong}`,
          boxShadow: "0 24px 60px rgba(30,26,10,0.3)",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* header */}
        <div
          style={{
            background: `linear-gradient(135deg, #F7F0A8 0%, #EDE090 100%)`,
            padding: "22px 28px 18px",
            borderBottom: `1px solid ${C.borderStrong}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Pencil size={16} color={C.amber} strokeWidth={2.2} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.warmGray,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Edit Request
                </span>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                Edit participant Details
              </h2>
              <p
                style={{ margin: "4px 0 0", fontSize: 13, color: C.textMuted }}
              >
                Changes will update the certificate request record
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(0,0,0,0.08)",
                border: "none",
                borderRadius: 8,
                padding: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: C.warmGray,
                flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* scrollable body */}
        <div className="p-6 flex flex-col gap-4 w-full">
          {/* Selection summary */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between bg-amber-100 border border-amber-200 rounded-lg px-3 py-2">
              <span className="text-sm font-semibold text-amber-800">
                {selected.size} participant{selected.size > 1 ? "s" : ""}{" "}
                selected
              </span>
              <button
                onClick={() => setSelected(new Set())}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Scrollable Table */}
          <div className="max-h-52 overflow-y-auto">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="sticky top-0 z-10 bg-amber-50">
                <tr>
                  {["SL.No", "Name", "Email", "Department", "Batch Year"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-3 py-2 font-bold text-xs tracking-wider uppercase text-amber-800 border-b border-amber-200 whitespace-nowrap ${
                          i === 0 ? "text-center w-10" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ),
                  )}

                  {/* Select all th */}
                  <th className="px-3 py-2 text-center font-bold text-xs tracking-wider uppercase text-amber-800 border-b border-amber-200 whitespace-nowrap">
                    <div className="flex flex-col items-center gap-0.5">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el)
                            el.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 accent-green-300 cursor-pointer"
                      />
                      <span className="text-xs font-bold tracking-wider text-amber-800 ">
                        {allSelected ? "Deselect All" : "All"}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(request.users || []).map((user, idx) => {
                  const isSelected = selected.has(user._id);
                  return (
                    <tr
                      key={user._id || idx}
                      className={`border-b border-amber-100 last:border-none hover:bg-amber-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-amber-50/40"
                      }`}
                    >
                      <td className="px-3 py-1 text-center text-[12px] font-bold text-amber-600">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-1 font-semibold text-stone-900">
                        {user.personal_info?.name || ""}
                      </td>
                      <td className="px-3 py-1 text-stone-500">
                        {user.personal_info?.email || ""}
                      </td>
                      <td className="px-3 py-1">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-md px-2 py-0.5 text-[11px] font-semibold">
                          {user.academic_info?.branch || ""}
                        </span>
                      </td>
                      <td className="px-3 py-1">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-md px-2 py-0.5 text-[11px] font-semibold">
                          {user.academic_info?.batch_year || ""}
                        </span>
                      </td>
                      {/* Row checkbox */}
                      <td className="px-3 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(user._id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-3.5 h-3.5 accent-green-300 cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            padding: "16px 28px 24px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 22px",
              borderRadius: 11,
              background: "transparent",
              color: C.warmGray,
              border: `1.5px solid ${C.border}`,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = C.creamDark;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              padding: "10px 24px",
              borderRadius: 11,
              background: `linear-gradient(135deg, #2A6040, #1E4A30)`,
              color: "#E8F5EE",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 14px rgba(30,74,48,0.3)",
            }}
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>
    </Overlay>
  );
};
