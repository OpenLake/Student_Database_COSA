import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useAdminContext } from "../../context/AdminContext";

const TaskDetailModal = ({ task, onUpdateStatus, onClose }) => {
  const { isUserLoggedIn } = useAdminContext();
  const [submissionNote, setSubmissionNote] = useState(task.submission_note || "");
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAssignee = task.assignees?.some((a) => a._id === isUserLoggedIn?._id);
  const isAssigner = task.assigned_by?._id === isUserLoggedIn?._id;

  const runTransition = async (status, extra = {}) => {
    try {
      setSubmitting(true);
      await onUpdateStatus(task._id, { status, ...extra });
      toast.success("Task updated");
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error(err?.response?.data?.message || "Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStart = () => runTransition("in-progress");

  const handleSubmitForReview = () => {
    if (!submissionNote.trim()) {
      toast.error("Add a submission link or note before submitting");
      return;
    }
    runTransition("under-review", { submission_note: submissionNote.trim() });
  };

  const handleApprove = () => runTransition("completed", { admin_notes: adminNotes.trim() });
  const handleSendBack = () => runTransition("in-progress", { admin_notes: adminNotes.trim() });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl border-2 border-black w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-black">
            <X size={22} />
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{task.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <div className="text-gray-500">Status</div>
            <div className="font-semibold capitalize">{task.status.replace("-", " ")}</div>
          </div>
          <div>
            <div className="text-gray-500">Priority</div>
            <div className="font-semibold capitalize">{task.priority}</div>
          </div>
          <div>
            <div className="text-gray-500">Deadline</div>
            <div className="font-semibold">{new Date(task.deadline).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-gray-500">Assigned By</div>
            <div className="font-semibold">{task.assigned_by?.personal_info?.name || "N/A"}</div>
          </div>
        </div>

        <div className="text-sm mb-4">
          <div className="text-gray-500 mb-1">Assignees</div>
          <div className="flex flex-wrap gap-2">
            {task.assignees?.map((a) => (
              <span key={a._id} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs">
                {a.personal_info?.name}
              </span>
            ))}
          </div>
        </div>

        {task.admin_notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="text-xs font-semibold text-yellow-800 mb-1">Feedback from assigner</div>
            <div className="text-sm text-yellow-900">{task.admin_notes}</div>
          </div>
        )}

        {task.status === "pending" && isAssignee && (
          <button type="button" disabled={submitting} onClick={handleStart} className="w-full py-2 rounded-xl bg-black text-white font-semibold disabled:opacity-50">
            Start Task
          </button>
        )}

        {task.status === "in-progress" && isAssignee && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="submission-note">Submission link / notes</label>
            <textarea id="submission-note" value={submissionNote} onChange={(e) => setSubmissionNote(e.target.value)} rows={3} maxLength={2000} className="w-full px-3 py-2 rounded-xl border-2 border-black" placeholder="Paste a Drive/Doc link or describe the completed work" />
            <button type="button" disabled={submitting} onClick={handleSubmitForReview} className="w-full py-2 rounded-xl bg-black text-white font-semibold disabled:opacity-50">
              Submit for Review
            </button>
          </div>
        )}

        {task.status === "under-review" && (
          <div className="flex flex-col gap-3">
            {task.submission_note && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-600 mb-1">Submission</div>
                <div className="text-sm text-gray-900 break-words">{task.submission_note}</div>
              </div>
            )}
            {isAssigner ? (
              <>
                <label className="text-sm font-semibold text-gray-700" htmlFor="admin-notes">Feedback (optional, required if sending back)</label>
                <textarea id="admin-notes" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2} maxLength={2000} className="w-full px-3 py-2 rounded-xl border-2 border-black" />
                <div className="flex gap-2">
                  <button type="button" disabled={submitting} onClick={handleApprove} className="flex-1 py-2 rounded-xl bg-green-600 text-white font-semibold disabled:opacity-50">
                    Approve & Complete
                  </button>
                  <button type="button" disabled={submitting || !adminNotes.trim()} onClick={handleSendBack} className="flex-1 py-2 rounded-xl bg-white border-2 border-black font-semibold disabled:opacity-50">
                    Send Back
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Waiting for the assigner to review this submission.</p>
            )}
          </div>
        )}

        {task.status === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 font-medium">
            This task has been completed.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;