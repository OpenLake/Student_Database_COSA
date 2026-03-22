import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { fetchTasks, createTask } from "../../services/tasks";
import {
  CircleFadingPlus,
  Filter,
  Search,
  SquareArrowOutDownRight,
  SquareArrowOutUpRight,
  LayoutList,
} from "lucide-react";

import TaskCard from "./taskCard";
import { PRIORITY_CARD_STYLE, STATUS_CONFIG, AVATAR_COLORS } from "./ui";
import TaskDetailModal from "./taskModal";
import { useAdminContext } from "../../context/AdminContext";

// --- Mock Users for Assignee Picker ---
const MOCK_USERS = [
  {
    id: "u1",
    name: "Riya Sharma",
    role: "Club Coordinator",
    unit: "Tech Club",
    avatar: "RS",
  },
  {
    id: "u2",
    name: "Arjun Nair",
    role: "Position Holder",
    unit: "Science Club",
    avatar: "AN",
  },
  {
    id: "u3",
    name: "Karan Mehta",
    role: "GenSec SciTech",
    unit: "SciTech",
    avatar: "KM",
  },
  {
    id: "u4",
    name: "Priya Kapoor",
    role: "Position Holder",
    unit: "Coding Club",
    avatar: "PK",
  },
  {
    id: "u5",
    name: "Dev Patel",
    role: "Club Coordinator",
    unit: "Robotics Club",
    avatar: "DP",
  },
  {
    id: "u6",
    name: "Sneha R.",
    role: "Position Holder",
    unit: "Tech Club",
    avatar: "SR",
  },
  {
    id: "u7",
    name: "Ankita Verma",
    role: "GenSec Cultural",
    unit: "Cultural",
    avatar: "AV",
  },
  {
    id: "u8",
    name: "Rohan Das",
    role: "Position Holder",
    unit: "Science Club",
    avatar: "RD",
  },
];

// --- Assignee Picker Modal ---
function AssigneePickerModal({ selected, onConfirm, onClose }) {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(new Set(selected));

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.unit.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allFiltered = filtered.every((u) => checked.has(u.id));
  const selectAll = () =>
    setChecked((prev) => {
      const next = new Set(prev);
      filtered.forEach((u) => next.add(u.id));
      return next;
    });
  const deselectAll = () =>
    setChecked((prev) => {
      const next = new Set(prev);
      filtered.forEach((u) => next.delete(u.id));
      return next;
    });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-800 text-base">
              Select Assignees
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {checked.size} member{checked.size !== 1 ? "s" : ""} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 text-xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Search + bulk actions */}
        <div className="px-5 pt-4 pb-3 space-y-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
              />
            </svg>
            <input
              className="w-full border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-300"
              placeholder="Search by name, role or unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={allFiltered ? deselectAll : selectAll}
              className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              {allFiltered ? "Deselect All" : "Select All"}
            </button>
            {checked.size > 0 && (
              <button
                onClick={() => setChecked(new Set())}
                className="text-xs font-semibold text-stone-500 bg-stone-50 border border-stone-200 hover:bg-stone-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
            <span className="ml-auto text-xs text-stone-400 font-medium">
              {filtered.length} users
            </span>
          </div>
        </div>

        {/* User list */}
        <div className="px-5 pb-2 max-h-64 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-stone-400 py-8">
              No users found
            </p>
          ) : (
            filtered.map((user, i) => {
              const isChecked = checked.has(user.id);
              return (
                <label
                  key={user.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border select-none ${
                    isChecked
                      ? "bg-amber-50 border-amber-200"
                      : "bg-white border-transparent hover:bg-stone-50 hover:border-stone-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggle(user.id)}
                  />
                  {/* Custom checkbox */}
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${isChecked ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}
                  >
                    {isChecked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 10 8"
                      >
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  >
                    {user.avatar}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-stone-400 truncate">
                      {user.role} · {user.unit}
                    </p>
                  </div>
                  {isChecked && (
                    <svg
                      className="w-4 h-4 text-amber-500 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stone-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const names = MOCK_USERS.filter((u) => checked.has(u.id)).map(
                (u) => u.name,
              );
              onConfirm(names, [...checked]);
            }}
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-sm"
          >
            Confirm ({checked.size})
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Create Task Modal ---
function CreateTaskModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
  });
  const [assigneeNames, setAssigneeNames] = useState([]);
  const [assigneeIds, setAssigneeIds] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline) return;
    onCreate({
      ...form,
      id: Date.now(),
      status: "pending",
      progress: 0,
      assigner: "Profile Name",
      assignees: assigneeNames,
      submission_note: "",
    });
    onClose();
  };

  return (
    <>
      {showPicker && (
        <AssigneePickerModal
          selected={assigneeIds}
          onConfirm={(names, ids) => {
            setAssigneeNames(names);
            setAssigneeIds(ids);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-stone-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg tracking-tight">
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Task Title *
              </label>
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="e.g. Design Event Poster"
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
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-left focus:outline-none hover:border-amber-300 transition-colors flex items-center justify-between min-h-[38px]"
              >
                {assigneeNames.length === 0 ? (
                  <span className="text-stone-300">
                    Click to select assignees...
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {assigneeNames.map((name, i) => (
                      <span
                        key={i}
                        className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
                <svg
                  className="w-4 h-4 text-stone-400 shrink-0 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
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
  console.log("User:", isUserLoggedIn);

  useEffect(() => {
    async function getTasks() {
      const response = await fetchTasks();
      if (Array.isArray(response)) {
        //toast.success("Tasks fetched successfully");
        console.log("Tasks:", response[0]);
        setTasks(response);
      }
    }
    getTasks();
  }, []);

  const handleCreate = useCallback(
    async (newTask) => {
      const response = await createTask(newTask);
      console.log(response);
      if (response) {
        //toast.success("Task created successfully");
        setTasks((prev) => [...prev, response]);
        return;
      }
    },
    [tasks],
  );

  const handleStatusUpdate = (id, newStatus, submissionNote, adminNote) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const progressMap = {
          pending: 0,
          "in-progress": 40,
          "under-review": 80,
          completed: 100,
        };
        return {
          ...t,
          status: newStatus,
          progress: progressMap[newStatus],
          submission_note:
            submissionNote !== undefined ? submissionNote : t.submission_note,
          admin_notes: adminNote || t.admin_notes,
        };
      }),
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
