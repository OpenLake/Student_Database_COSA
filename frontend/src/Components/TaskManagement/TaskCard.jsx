import React from "react";
import { Calendar, User, Users } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-800 border-gray-300",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  "under-review": "bg-yellow-100 text-yellow-800 border-yellow-300",
  completed: "bg-green-100 text-green-800 border-green-300",
};

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In Progress",
  "under-review": "Under Review",
  completed: "Completed",
};

function formatDeadline(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const TaskCard = ({ task, mode, onView }) => {
  const isOverdue = task.status !== "completed" && new Date(task.deadline) < new Date();

  return (
    <button
      type="button"
      onClick={() => onView(task)}
      className="text-left bg-white rounded-2xl shadow-sm border-2 border-black p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
        <span className={`shrink-0 px-2 py-1 rounded-lg text-xs font-semibold border ${STATUS_STYLES[task.status] || STATUS_STYLES.pending}`}>
          {STATUS_LABELS[task.status] || task.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-black transition-all duration-500" style={{ width: `${task.progress || 0}%` }} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className={`px-2 py-0.5 rounded-md font-medium ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
          {task.priority}
        </span>
        <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-semibold" : ""}`}>
          <Calendar size={12} />
          {formatDeadline(task.deadline)}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500">
        {mode === "delegated" ? (
          <>
            <Users size={12} />
            <span className="truncate">
              {task.assignees?.map((a) => a.personal_info?.name).filter(Boolean).join(", ") || "Unassigned"}
            </span>
          </>
        ) : (
          <>
            <User size={12} />
            <span className="truncate">Assigned by {task.assigned_by?.personal_info?.name || "N/A"}</span>
          </>
        )}
      </div>
    </button>
  );
};

export default TaskCard;