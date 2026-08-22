import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const CreateTaskModal = ({ assignableUsers, onCreate, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleAssignee = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !deadline) {
      toast.error("Title, description and deadline are required");
      return;
    }
    if (selectedIds.length === 0) {
      toast.error("Select at least one assignee");
      return;
    }

    try {
      setSubmitting(true);
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        deadline,
        priority,
        assignees: selectedIds,
      });
      toast.success("Task created successfully");
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error(err?.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl border-2 border-black w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-black">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="task-title">Title</label>
            <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-black" required />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="task-description">Description</label>
            <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-black" required />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="task-deadline">Deadline</label>
              <input id="task-deadline" type="date" value={deadline} min={(() => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
})()} onChange={(e) => setDeadline(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-black" required />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-black bg-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-700">Assign To ({selectedIds.length} selected)</span>
            <div className="mt-1 max-h-48 overflow-y-auto border-2 border-black rounded-xl divide-y">
              {assignableUsers.length === 0 ? (
                <p className="text-sm text-gray-500 p-3">No eligible assignees found for your role.</p>
              ) : (
                assignableUsers.map((u) => (
                  <label key={u._id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={selectedIds.includes(u._id)} onChange={() => toggleAssignee(u._id)} />
                    <span className="text-sm text-gray-900">{u.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{u.position || u.role}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-2 rounded-xl bg-black text-white font-semibold disabled:opacity-50">
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;