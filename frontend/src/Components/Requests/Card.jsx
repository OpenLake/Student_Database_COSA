import { useState } from "react";
import { useAdminContext } from "../../context/AdminContext";

const PRIORITY = {
  High:   "bg-red-50 text-red-600 border border-red-100",
  Medium: "bg-amber-50 text-amber-600 border border-amber-100",
  Low:    "bg-sky-50 text-sky-600 border border-sky-100",
};

const STATUS = {
  Pending:  { cls: "bg-yellow-50 text-yellow-700 border border-yellow-200",   dot: "bg-yellow-400"  },
  Approved: { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100", dot: "bg-emerald-500" },
  Rejected: { cls: "bg-red-50 text-red-600 border border-red-100",            dot: "bg-red-400"     },
};

const COL_BORDER = { borderRight: "1px solid #fef3c7" };

export default function RequestsTable({ requests, onApprove, onReject, onView, onEdit }) {

  const {userRole} = useAdminContext();
  return (
    <div className="flex justify-center mt-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }`}</style>

      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg shadow-yellow-200/60 border border-yellow-100 bg-white">

        {/* ── thead ─────────────────────────────────────────── */}
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #2A6040 0%, #1E4A30 100%)" }}>
              {["Priority", "Event & Org", "Date", "Students", "Status", "Actions"].map((h, i, arr) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-white/60 whitespace-nowrap"
                  style={i < arr.length - 1 ? { borderRight: "1px solid rgba(255,255,255,0.07)" } : {}}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── tbody ─────────────────────────────────────────── */}
          <tbody className="bg-white align-middle">
            {requests.map((req, i) => {
              const locked = req.status !== "Pending";
              const last = i === requests.length - 1;
              return (
                <tr
                  key={req.id}
                  className="group hover:bg-amber-100/60 transition-colors duration-150"
                  style={{ borderBottom: last ? "none" : "2px solidrgb(198, 194, 150)" }}
                >
                  {/* priority */}
                  <td className="pl-6" style={COL_BORDER}>
                    <span className={`inline-block text-[12px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${PRIORITY[req.priority]}`}>
                      {req.priority}
                    </span>
                  </td>

                  {/* event + org stacked */}
                  <td className="px-3 !pt-2 max-w-[260px] align-middle" style={COL_BORDER}>
                    <p className="text-[14px] font-bold text-gray-900 leading-snug break-words">
                      {req.event}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {req.organization}
                    </p>
                  </td>

                  {/* date */}
                  <td className="px-3 py-1.5 whitespace-nowrap align-middle" style={COL_BORDER}>
                    <p className="text-[14px] font-semibold text-gray-500">{req.date}</p>
                  </td>

                  {/* students */}
                  <td className="px-4 py-1.5 align-middle" style={COL_BORDER}>
                    <p className="text-[14px] font-bold text-gray-700">{req.students}</p>
                  </td>

                  {/* status */}
                  <td className="px-4 py-1.5 align-middle" style={COL_BORDER}>
                    {(() => {
                      const conf = STATUS[req.status] || STATUS.Pending;
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${conf.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                          {req.status || "Pending"}
                        </span>
                      );
                    })()}
                  
                  </td>

                  {/* actions */}
                  <td className="px-2 py-1.5 align-middle">
                    <div className="flex items-center gap-1.5">
                      <button
                        className="px-2.5 py-1 !rounded-lg text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors whitespace-nowrap"
                        onClick={() => onView(req)}
                      >
                        View
                      </button>
                      {userRole === "PRESIDENT" || userRole?.startsWith("GENSEC") 
                      ? (
                      <>
                        <button
                          onClick={() => onEdit(req)}
                          disabled={locked}
                          className={`px-2.5 py-1 !rounded-lg text-[11px] font-semibold border transition-colors
                            ${locked ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
                                    : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => !locked && onApprove(req.id)}
                          disabled={locked}
                          className={`px-2.5 py-1 !rounded-lg text-[11px] font-semibold border transition-colors
                            ${locked ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
                                    : "text-emerald-700 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"}`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => !locked && onReject(req.id)}
                          disabled={locked}
                          className={`px-2.5 py-1 !rounded-lg text-[11px] font-semibold border transition-colors
                            ${locked ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
                                    : "text-red-600 bg-red-50 border-red-100 hover:bg-red-100"}`}
                        >
                          Reject
                        </button>
                      </>
                      )
                      : <></>
                    }
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