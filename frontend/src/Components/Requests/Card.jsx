import { useState } from "react";
import { useAdminContext } from "../../context/AdminContext";

const STATUS = {
  Pending: {
    cls: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-400",
  },
  Approved: {
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    dot: "bg-emerald-500",
  },
  Rejected: {
    cls: "bg-red-50 text-red-600 border border-red-100",
    dot: "bg-red-400",
  },
  Draft: {
    cls: "bg-gray-50 text-gray-600 border border-gray-100",
    dot: "bg-gray-400",
  },
};

const COL_BORDER = { borderRight: "1px solid #fef3c7" };

export default function RequestsTable({
  requests,
  onApprove,
  onReject,
  onView,
  onEdit,
}) {
  const { userRole } = useAdminContext();
  return (
    <div className="flex justify-center mt-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }`}</style>

      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg shadow-yellow-200/60 border border-yellow-100 bg-white">
        {/* ── thead ─────────────────────────────────────────── */}
        <table className="w-full border-collapse">
          <thead>
            <tr
              style={{
                background: "linear-gradient(135deg, #2A6040 0%, #1E4A30 100%)",
              }}
            >
              {[
                "Event",
                "Organization",
                "Event Schedule",
                "Venue",
                "Status",
                "Actions",
              ].map((h, i, arr) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-white/60 whitespace-nowrap"
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

          {/* ── tbody ─────────────────────────────────────────── */}
          <tbody className="bg-white align-middle">
            {requests.map((req, i) => {
              const locked = req.approvalStatus !== "Pending";
              const last = i === requests.length - 1;
              return (
                <tr
                  key={req._id}
                  className="group hover:bg-amber-100/60 transition-colors duration-150"
                  style={{
                    borderBottom: last ? "none" : "2px solidrgb(198, 194, 150)",
                  }}
                >
                  {/* Event Name */}
                  <td className="px-3 py-2 align-middle" style={COL_BORDER}>
                    <span
                      className={`inline-flex items-center text-[12px] font-bold uppercase `}
                    >
                      {req.eventId.title}
                    </span>
                  </td>

                  {/* organization Name */}
                  <td
                    className="px-3 py-2 align-middle max-w-[200px]"
                    style={COL_BORDER}
                  >
                    <span className="inline-flex items-center text-sm text-gray-500 font-semibold">
                      {req.eventId.organizing_unit_id.name}
                    </span>
                  </td>

                  {/* Event Schedule */}
                  <td
                    className="px-3 py-2 whitespace-nowrap align-middle"
                    style={COL_BORDER}
                  >
                    <span className="inline-flex items-center text-sm font-semibold  text-gray-500">
                      {new Date(req.eventId.schedule.start).toLocaleDateString(
                        "en-GB",
                      )}{" "}
                      -{" "}
                      {new Date(req.eventId.schedule.end).toLocaleDateString(
                        "en-GB",
                      )}
                    </span>
                  </td>

                  {/* Venue */}
                  <td className="px-3 py-2 align-middle" style={COL_BORDER}>
                    <span className="inline-flex items-center text-sm font-semibold text-gray-600">
                      {req.eventId.schedule.venue}
                    </span>
                  </td>

                  {/* status */}
                  <td className="px-3 py-2 align-middle" style={COL_BORDER}>
                    {(() => {
                      const conf = STATUS[req.approvalStatus] || STATUS.Draft;
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${conf.cls}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${conf.dot}`}
                          />
                          {req.approvalStatus || "Draft"}
                        </span>
                      );
                    })()}
                  </td>

                  {/* actions */}
                  <td className="px-2 py-1.5 align-middle">
                    <div className="flex items-center gap-1.5">
                      <button
                        className="px-2 !rounded-lg text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors whitespace-nowrap"
                        onClick={() => onView(req)}
                      >
                        View
                      </button>
                      {userRole === "PRESIDENT" ||
                      userRole?.startsWith("GENSEC") ? (
                        <>
                          <button
                            onClick={() => onEdit(req)}
                            disabled={locked}
                            className={`px-2 !rounded-lg text-sm font-semibold border transition-colors
                            ${
                              locked
                                ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
                                : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onApprove(true);
                              onView(req);
                            }}
                            disabled={locked}
                            className={`px-2 !rounded-lg text-sm font-semibold border transition-colors
                            ${
                              locked
                                ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
                                : "text-emerald-700 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              onReject(true);
                              onView(req);
                            }}
                            disabled={locked}
                            className={`px-2 !rounded-lg text-sm font-semibold border transition-colors
                            ${
                              locked
                                ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
                                : "text-red-600 bg-red-50 border-red-100 hover:bg-red-100"
                            }`}
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
