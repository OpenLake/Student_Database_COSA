import { StatusBadge, CertThumb } from "./ui";
import {
  SquarePen,
  ScanEye,
  Trash2,
  Copy,
  Archive,
  CalendarRange,
  MapPin,
  Users,
} from "lucide-react";

const BATCH_COLORS = [
  { bg: "#f0fdf4", border: "#bbf7d0", pill: "#166534", pillBg: "#dcfce7" },
  { bg: "#fefce8", border: "#fde68a", pill: "#92400e", pillBg: "#fef3c7" },
  { bg: "#f0f9ff", border: "#bae6fd", pill: "#0c4a6e", pillBg: "#e0f2fe" },
  { bg: "#fdf4ff", border: "#e9d5ff", pill: "#581c87", pillBg: "#f3e8ff" },
  { bg: "#fff1f2", border: "#fecdd3", pill: "#881337", pillBg: "#ffe4e6" },
  { bg: "#f0fdfa", border: "#99f6e4", pill: "#134e4a", pillBg: "#ccfbf1" },
];

function ActionBtn({ label, primary, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        !text-xs px-2.5 py-1 mt-1
        font-bold !rounded-xl
        transition-opacity duration-150 cursor-pointer
        ${
          primary
            ? "bg-green-100 text-green-600 hover:bg-green-50"
            : danger
              ? "bg-stone-50 text-red-600 hover:bg-red-50"
              : "bg-stone-50 text-stone-600 hover:bg-stone-100"
        }
    `}
    >
      {label}
    </button>
  );
}

function ActionBtnList({ icon: Icon, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        !text-xs px-2 py-1.5 mt-1
        font-bold !rounded-md
        transition-opacity duration-150 cursor-pointer
        ${
          danger
            ? "bg-stone-50 text-red-600 hover:bg-red-200"
            : "bg-stone-50 text-green-800 hover:bg-green-200"
        }
    `}
    >
      <Icon size={18} />
    </button>
  );
}

export function BatchCard({
  batch,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
}) {
  const colorIndex = Math.floor(Math.random() * BATCH_COLORS.length);
  const c = BATCH_COLORS[colorIndex % BATCH_COLORS.length];

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e7e5e0",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.18s, border-color 0.18s",
        cursor: "pointer",
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 156, padding: 10, background: "#f9f9ec" }}>
        <CertThumb batch={batch} />
      </div>

      {/* Body */}
      <div
        style={{
          padding: "14px 15px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Title + status */}
        <div className="flex items-start justify-between gap-8">
          <div style={{ minWidth: 0 }}>
            <p
              className="m-0 text-[13px]
              font-bold text-[#1c1917] tracking-[-0.01em]
              overflow-hidden text-ellipsis
              whitespace-nowrap"
            >
              {batch.eventId.title}
            </p>
            <p
              className="m-0 text-[13px]
              font-medium text-zinc-600
              tracking-[-0.01em] overflow-hidden
              text-ellipsis whitespace-nowrap"
            >
              {batch.eventId.organizing_unit_id.name || ""}
            </p>
          </div>
          <StatusBadge status={batch.lifecycleStatus} />
        </div>

        {/* Inner sub-panel */}
        <div
          className="rounded-xl px-[10px] py-[8px] flex flex-col gap-[6px]"
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
          }}
        >
          {/* Row 1 */}
          <div className="flex gap-[6px] justify-between">
            <span className="text-[11px] font-bold text-stone-700">
              {batch.eventId.title}
            </span>

            <span className="flex items-center gap-1 text-[10px] font-semibold">
              <CalendarRange size={12} />
              {new Date(batch.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Row 2 */}
          <div className="flex gap-[6px] items-center justify-between w-full">
            {/* Left side */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500">
              <Users size={12} />
              <span>Students: {batch.users.length}</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 overflow-hidden text-ellipsis whitespace-nowrap">
              <MapPin size={12} />
              <span>{batch.eventId.schedule?.venue}</span>
            </div>
          </div>

          {/*
            <div className="flex items-center justify-between w-full text-[11px] text-stone-500">
              <span className="font-semibold">Event Schedule:</span>
              <span>
                {new Date(batch.eventId.schedule.start).toLocaleDateString()} -{" "}
                {new Date(batch.eventId.schedule.end).toLocaleDateString()}
              </span>
            </div>


            <div className="flex items-center justify-start gap-[5px] text-stone-500 font-semibold text-[11px]">
              Approval: {batch.currentApprovalLevel} / 2
          </div>
          */}

          {/* Row 5 */}
          <div className="flex items-center gap-[5px] w-full">
            <div className="flex justify-between w-full">
              <span className="text-[10px] text-stone-600">
                Last Updated: {new Date(batch.updatedAt).toLocaleDateString()}
              </span>

              <span className="text-[11px] text-stone-600 font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                -{batch?.initiatedBy?.personal_info?.name || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            marginTop: "auto",
          }}
        >
          {batch.lifecycleStatus === "Draft" && (
            <>
              <ActionBtn label="View" primary onClick={() => onView(batch)} />
              <ActionBtn label="Edit" onClick={() => onEdit(batch)} />
              <ActionBtn label="Duplicate" onClick={() => onDuplicate(batch)} />
              <ActionBtn
                label="Delete"
                danger
                onClick={() => onDelete(batch)}
              />
            </>
          )}
          {batch.lifecycleStatus === "Submitted" && (
            <>
              <ActionBtn label="View" primary onClick={() => onView(batch)} />
              <ActionBtn label="Duplicate" onClick={() => onDuplicate(batch)} />
              <ActionBtn label="Archive" onClick={() => onArchive(batch._id)} />
            </>
          )}
          {batch.lifecycleStatus === "Archived" && (
            <>
              <ActionBtn label="View" primary onClick={() => onView(batch)} />
              <ActionBtn label="Duplicate" onClick={() => onDuplicate(batch)} />
              <ActionBtn
                label="Delete"
                danger
                onClick={() => onDelete(batch)}
              />
            </>
          )}
          {batch.lifecycleStatus === "Active" && (
            <>
              <ActionBtn label="View" primary onClick={() => onView(batch)} />
              <ActionBtn label="Duplicate" onClick={() => onDuplicate(batch)} />
              <ActionBtn label="Archive" onClick={() => onArchive(batch._id)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function BatchList({
  filtered,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
}) {
  //console.log('filtered prop', filtered);
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="bg-gradient-to-r from-[#2A6040] to-[#1E4A30]">
            {[
              "Batch",
              "Organization",
              "Template",
              "Students",
              "Status",
              "Created By",
              "Last Modified",
              "Actions",
            ].map((h, i, arr) => (
              <th
                key={h}
                className="py-3 flex-col justify-center items-center text-[10px]
                        font-bold uppercase tracking-widest text-white/70 whitespace-nowrap text-center"
                style={
                  i < arr.length - 1
                    ? { borderRight: "1px solid rgba(255,255,255,0.07)" }
                    : {}
                }
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {filtered?.map((b, i) => {
            const c = BATCH_COLORS[b.color % BATCH_COLORS.length];

            return (
              <tr
                key={b.id}
                className="hover:bg-stone-50 transition-colors"
                style={{
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #e7e5e0" : "none",
                }}
              >
                {/* Batch Name */}
                <td
                  className="py-2 text-center align-middle"
                  style={{ borderRight: "1px solid #f1f1f0" }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-stone-500 m-auto">
                      {b.name}
                    </p>
                  </div>
                </td>

                {/* Organization */}
                <td
                  className="py-2"
                  style={{ borderRight: "1px solid #f1f1f0" }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-stone-500 m-auto">
                      {b.org}
                    </p>
                  </div>
                </td>

                {/* Template */}
                <td
                  className="py-2"
                  style={{ borderRight: "1px solid #f1f1f0" }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-stone-500 m-auto">
                      {b.template}
                    </p>
                  </div>
                </td>

                {/* Students */}
                <td
                  className="py-2"
                  style={{ borderRight: "1px solid #f1f1f0" }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-stone-400 m-auto">
                      {b.students}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td
                  className="py-2"
                  style={{ borderRight: "1px solid #f1f1f0" }}
                >
                  <StatusBadge status={b.status} />
                </td>

                {/* Created By */}
                <td
                  className="py-2"
                  style={{ borderRight: "1px solid #f1f1f0" }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-stone-500 m-auto">
                      {b.createdBy}
                    </p>
                  </div>
                </td>

                {/* Modified */}
                <td
                  className="py-2"
                  style={{ borderRight: "1px solid #f1f1f0" }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-stone-500 m-auto">
                      {b.modified}
                    </p>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-2">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 5,
                      marginTop: "auto",
                    }}
                  >
                    {b.status === "Draft" && (
                      <>
                        <ActionBtnList
                          icon={SquarePen}
                          primary
                          onClick={() => onEdit(b)}
                        />
                        <ActionBtnList
                          icon={Trash2}
                          danger
                          onClick={() => onDelete(b.id)}
                        />
                      </>
                    )}

                    {b.status === "Active" && (
                      <>
                        <ActionBtnList
                          icon={ScanEye}
                          primary
                          onClick={() => onView(b)}
                        />
                        <ActionBtnList
                          icon={SquarePen}
                          onClick={() => onEdit(b)}
                        />
                        <ActionBtnList
                          icon={Copy}
                          onClick={() => onDuplicate(b)}
                        />
                        <ActionBtnList
                          icon={Trash2}
                          danger
                          onClick={() => onDelete(b.id)}
                        />
                      </>
                    )}
                    {b.status === "Submitted" && (
                      <>
                        <ActionBtnList
                          icon={ScanEye}
                          primary
                          onClick={() => onView(b)}
                        />
                        <ActionBtnList
                          icon={Archive}
                          onClick={() => onArchive(b.id)}
                        />
                      </>
                    )}
                    {b.status === "Archived" && (
                      <>
                        <ActionBtnList
                          icon={ScanEye}
                          primary
                          onClick={() => onView(b)}
                        />
                        <ActionBtnList
                          icon={Copy}
                          onClick={() => onDuplicate(b)}
                        />
                        <ActionBtnList
                          icon={Trash2}
                          danger
                          onClick={() => onDelete(b.id)}
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
