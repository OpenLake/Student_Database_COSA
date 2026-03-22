import { useState } from "react";
import { PRIORITY_CARD_STYLE, STATUS_CONFIG } from "./ui";
import { CircleX } from "lucide-react";

// --- Task Detail Modal ---
export default function TaskDetailModal({ task, onClose, onStatusUpdate }) {
  const [submissionNote, setSubmissionNote] = useState(
    task.submission_note || "",
  );
  const [adminNote, setAdminNote] = useState("");
  const style = PRIORITY_CARD_STYLE[task.priority];
  const statusFlow = ["pending", "in-progress", "under-review", "completed"];
  const canAdvance =
    task.status !== "completed" && task.status !== "under-review";
  const nextStatus = statusFlow[statusFlow.indexOf(task.status) + 1];

  const headerGradient =
    task.priority === "high"
      ? "from-rose-400 to-rose-500"
      : task.priority === "medium"
        ? "from-amber-300 to-amber-400"
        : "from-emerald-500 to-emerald-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-stone-200">
        {/*Header */}
        <div
          className={`bg-gradient-to-r ${headerGradient} px-6 py-4 flex items-start justify-between`}
        >
          <div>
            <p className="text-white text-xs font-semibold uppercase mb-0.5">
              Task Details
            </p>
            <h2 className="text-white font-bold text-lg leading-tight">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none mt-0.5"
          >
            <CircleX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}
            >
              Priority :{" "}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-stone-100 ${STATUS_CONFIG[task.status].text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[task.status].dot}`}
              ></span>
              {STATUS_CONFIG[task.status].label}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              Due:{" "}
              {new Date(task.deadline)
                .toLocaleDateString("en-GB")
                .replaceAll("/", "-")}
            </span>
          </div>

          <p className="text-sm font-medium px-2.5 py-2 rounded-md bg-stone-100 text-stone-600 shadow-md">
            Description: {task.description}
          </p>

          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">
              Assignees
            </p>
            <div className="flex flex-wrap gap-1.5">
              {task.assignees.map((a, i) => (
                <span
                  key={i}
                  className="text-xs gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium"
                >
                  {a.personal_info.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Progress
              </p>
              <span className="text-sm font-semibold text-stone-600">
                {task.progress > 0 ? task.progress : 0}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${style.progress || 0}`}
                style={{ width: `${task.progress || 0}%` }}
              />
            </div>
          </div>

          {task.status === "in-progress" && (
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                Submission Link / Note
              </label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Google Drive / Doc link"
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
              />
            </div>
          )}
          {task.status === "under-review" && (
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                Admin / Reviewer Notes
              </label>
              <textarea
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                rows={2}
                placeholder="Feedback for the assignee..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            {canAdvance && nextStatus && (
              <button
                onClick={() => {
                  onStatusUpdate(task.id, nextStatus, submissionNote);
                  onClose();
                }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
              >
                Mark as {STATUS_CONFIG[nextStatus].label}
              </button>
            )}
            {task.status === "under-review" && (
              <>
                <button
                  onClick={() => {
                    onStatusUpdate(
                      task.id,
                      "completed",
                      submissionNote,
                      adminNote,
                    );
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => {
                    onStatusUpdate(task.id, "in-progress", "", adminNote);
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
                >
                  Request Revision
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
