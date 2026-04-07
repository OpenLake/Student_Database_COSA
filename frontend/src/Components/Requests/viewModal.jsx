import { Overlay, Pill, C } from "./ui";
import { X, CalendarDays, Users, UserCircle2, Award } from "lucide-react";

const labelColor = {
  Approved: "green",
  Rejected: "red",
  Pending: "amber",
};

/* ─── info tile (used in View modal) ────────────────────── */
const InfoTile = ({ icon: Icon, label, value, wide }) => (
  <div
    className={`
      ${wide ? "col-span-full" : ""}
      rounded-[14px]
      flex flex-col gap-[6px]
      border
    `}
    style={{
      padding: "16px 20px",
      background: C.white,
      borderColor: C.border
    }}
  >
    <div
      className="flex items-center gap-[7px]"
      style={{ color: C.warmGray}}
    >
      <Icon size={15} strokeWidth={2} />
      <span className="text-[11px] font-semibold tracking-[0.08em] uppercase">
        {label}
      </span>
    </div>

    <span
      className={`
        text-[20px] font-bold tracking-[-0.01em]
        text-[${C.text}]
      `}
    >
      {value}
    </span>
  </div>
);

/* VIEW MODAL */
export const ViewModal = ({
  request,
  onClose,
  approveStatus,
  approve,
  rejectStatus,
  reject,
}) => (
  <Overlay onClose={onClose}>
    <div
      className= "w-[50vw] rounded-[20px] overflow-hidden border-[1.5px] shadow-[0_24px_60px_rgba(30,26,10,0.28)]"

      style={{
        background: C.cream,
        borderColor: C.borderStrong,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* header strip */}
      <div
        className="
          bg-[linear-gradient(135deg,#F7F0A8_0%,#EDE090_100%)]
          w-full h-14
          border-b
          relative"

        style={{borderColor: C.borderStrong }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: title + org */}
          <div className="flex flex-col gap-1 my-2 mx-6">
            <span className="text-md font-bold text-stone-900 leading-tight">
              {request.eventId.title}
            </span>
            <span className="text-md font-bold text-zinc-500">
              {request.eventId.organizing_unit_id.name}
            </span>
          </div>

          {/* Right: close button */}
          <button
            onClick={onClose}
            className={`
              shrink-0
              mt-3 !mr-8
              bg-[rgba(0,0,0,0.08)]
              !rounded-md
              p-[5px]
              cursor-pointer
              text-[${C.warmGray}]
              hover:bg-[rgba(0,0,0,0.14)]
              transition-colors
            `}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* body */}
      <div className="p-6 flex flex-col gap-4 w-full">
        {/* Participants Table */}
        <div className="border border-amber-200 rounded-xl overflow-hidden">
          {/* Table Header Bar */}
          <div className="bg-amber-50 px-4 border-b border-amber-200 flex items-center justify-between">
            <span className="flex items-center py-2 text-sm font-semibold tracking-widest uppercase text-amber-800">
              Participants
            </span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-200 rounded-full px-3 py-0.5">
              {request.users?.length || 0} members
            </span>
          </div>

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
                </tr>
              </thead>
              <tbody>
                {(request.users || []).map((user, idx) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-bold tracking-widest uppercase text-amber-800 mb-3">
            Event Details
          </p>
          <div className="grid grid-cols-2">
            {[
              { label: "Event Title", value: request.eventId.title },
              { label: "Venue", value: request.eventId.schedule.venue },
              {
                label: "Start Date",
                value: new Date(
                  request.eventId.schedule.start,
                ).toLocaleDateString("en-GB"),
              },
              {
                label: "End Date",
                value: new Date(
                  request.eventId.schedule.end,
                ).toLocaleDateString("en-GB"),
              },
              { label: "Mode", value: request.eventId.schedule.mode || "—" },
              {
                label: "Batch Created",
                value: new Date(request.createdAt).toLocaleDateString("en-GB"),
              },
              {
                label: "Initiated By",
                value: request.initiatedBy.personal_info.name,
                wide: true,
              },
            ].map(({ label, value, wide }) => (
              <div key={label} className={wide ? "col-span-2" : ""}>
                <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
                  {label}
                </p>
                <p className="text-sm font-semibold text-stone-900 mt-0">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 !rounded-xl border-none cursor-pointer font-bold text-sm bg-stone-900 text-amber-50 !mr-4"
          >
            Close
          </button>
          {approveStatus && (
            <button
              onClick={() => approve(request)}
              className="px-3 py-1 !rounded-xl border-none cursor-pointer font-bold text-sm bg-green-600 text-amber-50"
            >
              Approve
            </button>
          )}
          {rejectStatus && (
            <button
              onClick={() => reject(request)}
              className="px-3 py-1 !rounded-xl border-none cursor-pointer font-bold text-sm bg-red-500 text-amber-50"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  </Overlay>
);
