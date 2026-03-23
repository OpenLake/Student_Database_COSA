import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { fetchTasks, createTask, updateTask } from "../../services/tasks";
import {
  CircleFadingPlus,
  Filter,
  Search,
  SquareArrowOutDownRight,
  SquareArrowOutUpRight,
  LayoutList,
} from "lucide-react";

import TaskCard from "./taskCard";
import { TaskDetailModal, CreateTaskModal } from "./taskModal";
import { useAdminContext } from "../../context/AdminContext";

const PROGRESS_MAP = {
  pending: 0,
  "in-progress": 40,
  "under-review": 80,
  completed: 100,
};

const VALIDATION_RULES = {
  "under-review": {
    field: "submissionNote",
    message: "Submission note is required before submitting for review",
  },
  completed: {
    field: "adminNote",
    message: "Admin note is required when marking as completed",
  },
  pending: {
    field: "adminNote",
    message: "Admin note is required when requesting a revision",
  },
};

// --- Main Page ---
export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("Sort");
  const [filterType, setFilterType] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  let filtered = tasks;

  const { isUserLoggedIn } = useAdminContext();
  useEffect(() => {
    async function getTasks() {
      const response = await fetchTasks();
      if (Array.isArray(response.data)) {
        //toast.success("Tasks fetched successfully");
        setTasks(response.data);
      }
    }
    getTasks();
  }, []);

  const handleCreate = async (newTask) => {
    const response = await createTask(newTask);
    if (!response.success) {
      return toast.error("Failed to create task");
    }
    toast.success("Task created successfully");
    setTasks((prev) => [...prev, newTask]);
  };

  const handleStatusUpdate = async (
    id,
    newStatus,
    submissionNote,
    adminNote,
  ) => {
    const rule = VALIDATION_RULES[newStatus];
    if (rule) {
      const value =
        rule.field === "submissionNote" ? submissionNote : adminNote;
      if (!value) return toast.error(rule.message);
    }

    const response = await updateTask(id, newStatus, submissionNote, adminNote);
    if (!response.success) {
      toast.error("Failed to update task");
      return;
    }

    toast.success("Task updated successfully");
    setTasks((prev) =>
      prev.map((t) =>
        t._id !== id
          ? t
          : {
              ...t,
              status: newStatus,
              progress: PROGRESS_MAP[newStatus] ?? t.progress,
              submission_note: submissionNote || t.submission_note,
              admin_notes: adminNote || t.admin_notes,
            },
      ),
    );
  };

  filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search?.toLowerCase());
    const matchPriority =
      filterPriority && filterPriority !== "Sort"
        ? t.priority === filterPriority
        : true;
    const matchType =
      filterType === "assignee"
        ? t.assignees.some((a) => a._id === isUserLoggedIn?._id)
        : filterType === "assigner"
          ? t.assigned_by._id.toString() === isUserLoggedIn?._id
          : true;
    return matchSearch && matchPriority && matchType;
  });

  //console.log("Filtered: ", filtered);

  const hasFilters = Boolean(
    search || filterType !== "" || filterPriority !== "Sort",
  );

  return (
    <div className="min-h-screen p-6 space-y-4">
      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusUpdate={handleStatusUpdate}
          userId={isUserLoggedIn?._id}
        />
      )}

      {/* ── Toolbar ── */}
      <div className="rounded-2xl border border-stone-200 shadow-sm px-4 py-1 flex flex-wrap items-center gap-3">
        {/* Sort by priority */}
        <div className="flex items-center gap-3 bg-zinc-200 text-stone-800 rounded-xl px-3 py-2 text-md font-semibold my-2 shadow-sm">
          <Filter size={20} />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="Sort">Sort</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[160px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
          <input
            className="w-full border border-stone-200
            rounded-xl pl-9 pr-4 py-1.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-500"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Assignee / Assigner toggles */}
        <button
          onClick={() => setFilterType("assignee")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 !rounded-xl border transition-all ${
            filterType === "assignee"
              ? "text-amber-600 bg-zinc-100 shadow-xl"
              : "bg-white text-stone-500 border-stone-200 hover:text-amber-600"
          }`}
        >
          <SquareArrowOutDownRight className="w-3.5 h-3.5" />
          Assignee
        </button>
        <button
          onClick={() => setFilterType("assigner")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 !rounded-xl border transition-all ${
            filterType === "assigner"
              ? "text-amber-600 bg-zinc-100 shadow-xl"
              : "bg-white text-stone-500 border-stone-200 hover:text-amber-600"
          }`}
        >
          <SquareArrowOutUpRight className="w-3.5 h-3.5" />
          Assigner
        </button>

        {/* Create Task */}
        <button
          onClick={() => setShowCreate(true)}
          className="ml-auto flex items-center gap-2
          bg-green-800 text-white text-sm font-bold px-4 py-1.5 !rounded-2xl
          shadow-sm"
        >
          <CircleFadingPlus className="w-4 h-4" />
          Create
        </button>

        {hasFilters ? (
          <button
            onClick={() => {
              setSearch("");
              setFilterPriority("Sort");
              setFilterType("");
            }}
            className="shadow-md text-black font-semibold bg-zinc-100 px-4 py-1.5 !rounded-2xl"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* ── Task Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <LayoutList className="w-8 h-8 mb-3" />
          <span className="font-semibold text-stone-500">No tasks found</span>
          <span className="font-semibold text-stone-400">
            Try adjusting your filters or create a new task.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} View={setSelectedTask} />
          ))}
        </div>
      )}
    </div>
  );
}
