import { useState } from "react";
import { PRIORITY_CARD_STYLE, STATUS_CONFIG, AVATAR_COLORS } from "./ui";
import { CircleX, Users, XCircle } from "lucide-react";
import AssigneePickerModal from "./taskAssigneeModal";

// --- View Task Details Modal ---
export function TaskDetailModal({
  task,
  onClose,
  onStatusUpdate,
  userId = "",
}) {
  const [submissionNote, setSubmissionNote] = useState(
    task.submission_note || "",
  );
  const [adminNote, setAdminNote] = useState("");

  const style = PRIORITY_CARD_STYLE[task.priority];
  const statusFlow = ["pending", "in-progress", "under-review", "completed"];
  const canAdvance =
    task.status !== "completed" && task.status !== "under-review";
  const nextStatus =
    task.status !== "completed"
      ? statusFlow[statusFlow.indexOf(task.status) + 1]
      : null;

  const isAssigner = task.assigned_by?._id.toString() === userId.toString();
  const isAssignee = task.assignees.some(
    (assignee) => assignee._id.toString() === userId,
  );

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

          {/*Submission Link / Note */}
          {task.status === "in-progress" && isAssignee ? (
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                {" "}
                Submission Link / Note
              </label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-stone-400
                  disabled: cursor-not-allowed disabled: bg-gray-100 disabled:opacity-60"
                placeholder="Google Drive / Doc link / Description of your work"
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
              />
            </div>
          ) : null}

          {/*Reviewer Notes */}
          {task.status === "under-review" && isAssigner ? (
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                Reviewer Notes
              </label>
              <textarea
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
                rows={2}
                placeholder="Feedback for the assignee..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
          ) : null}

          <div className="flex gap-3 pt-1">
            {canAdvance && nextStatus && isAssignee && (
              <button
                onClick={() => {
                  onStatusUpdate(task._id, nextStatus, submissionNote);
                  onClose();
                }}
                className="flex-1 py-2 !rounded-2xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
              >
                {nextStatus === "under-review"
                  ? "Submit for Review"
                  : "Mark as " + STATUS_CONFIG[nextStatus].label}
              </button>
            )}
            {task.status === "under-review" && isAssigner && (
              <>
                <button
                  onClick={() => {
                    onStatusUpdate(
                      task._id,
                      "completed",
                      submissionNote,
                      adminNote,
                    );
                    onClose();
                  }}
                  className="flex-1 py-2 !rounded-2xl text-sm font-semibold text-white bg-green-600 hover:bg-green-800 transition-colors"
                >
                  Mark as Complete
                </button>
                <button
                  onClick={() => {
                    onStatusUpdate(task._id, "pending", "", adminNote);
                    onClose();
                  }}
                  className="flex-1 py-2 !rounded-2xl text-sm font-semibold text-white bg-red-600 hover:bg-red-800 transition-colors"
                >
                  Request Revision
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 !rounded-2xl text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Create Task Modal ---
export function CreateTaskModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    assignees: [],
  });
  const [assigneeIds, setAssigneeIds] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline) return;
    onCreate({
      ...form,
      status: "pending",
      progress: 0,
      assignees: assigneeIds,
    });
    onClose();
  };

  return (
    <>
      {showPicker && (
        <AssigneePickerModal
          selected={assigneeIds}
          onConfirm={(ids) => {
            setAssigneeIds(ids);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden border border-stone-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 flex items-center justify-between">
            <h2 className="text-white font-bold text-md tracking-tight">
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              <XCircle size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Task Title *
              </label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Design Event Poster"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                rows={3}
                placeholder="Describe the task..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Assignees — opens picker modal */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Assignees
              </label>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="w-[20vw] border border-stone-200 !rounded-lg px-3 py-2 text-sm text-left
                flex items-center justify-between min-h-[38px]"
              >
                {assigneeIds.length === 0 ? (
                  <span className="text-stone-300">
                    Click to select assignees...
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {assigneeIds.map((id, i) => (
                      <span
                        key={i}
                        className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium"
                      >
                        {id.personal_info.name}
                      </span>
                    ))}
                  </div>
                )}
                <Users size={16} className="text-stone-400 shrink-0 ml-2" />
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 !rounded-xl text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 !rounded-xl text-sm font-semibold text-white bg-green-700 hover:bg-green-800 transition-colors shadow-sm"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
