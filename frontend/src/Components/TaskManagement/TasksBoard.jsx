import React, { useState } from "react";
import { Plus, Search, ClipboardList } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";
import { useTasks } from "../../hooks/useTasks";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailModal from "./TaskDetailModal";

const STATUS_FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Under Review", value: "under-review" },
  { label: "Completed", value: "completed" },
];

const TasksBoard = () => {
  const { isUserLoggedIn } = useAdminContext();
  const { myTasks, delegatedTasks, assignableUsers, loading, error, canAssign, createTask, updateTaskStatus } = useTasks();

  const showMyTasksTab = isUserLoggedIn?.role !== "PRESIDENT";
const [selectedTab, setSelectedTab] = useState("mine");
const activeTab = showMyTasksTab ? selectedTab : "delegated";
const setActiveTab = setSelectedTab;
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const activeList = activeTab === "mine" ? myTasks : delegatedTasks;

  const filteredTasks = activeList.filter((t) => {
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesSearch = !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="text-gray-600 text-lg">Loading tasks...</div></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full"><div className="text-red-600 text-lg">{error}</div></div>;
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4 flex-shrink-0 gap-3 flex-wrap">
        <div className="flex gap-2">
          {showMyTasksTab && (
            <button type="button" onClick={() => setActiveTab("mine")} className={`px-4 h-[40px] rounded-2xl font-semibold transition-all duration-200 ${activeTab === "mine" ? "bg-black text-white shadow-md" : "bg-white text-black border-2 border-black hover:bg-gray-50"}`}>
              My Tasks
            </button>
          )}
          {canAssign && (
            <button type="button" onClick={() => setActiveTab("delegated")} className={`px-4 h-[40px] rounded-2xl font-semibold transition-all duration-200 ${activeTab === "delegated" ? "bg-black text-white shadow-md" : "bg-white text-black border-2 border-black hover:bg-gray-50"}`}>
              Delegated Tasks
            </button>
          )}
        </div>

        {canAssign && (
          <button type="button" onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 h-[40px] rounded-2xl bg-black text-white font-semibold hover:bg-gray-800">
            <Plus size={18} />
            New Task
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-6 flex-shrink-0 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button key={f.value} type="button" onClick={() => setStatusFilter(f.value)} className={`px-3 h-[36px] rounded-xl text-sm font-semibold transition-all duration-200 ${statusFilter === f.value ? "bg-black text-white" : "bg-white text-black border-2 border-black hover:bg-gray-50"}`}>
            {f.label}
          </button>
        ))}

        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-1.5 rounded-xl border-2 border-black bg-white text-black placeholder-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ClipboardList size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No tasks found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} mode={activeTab === "delegated" ? "delegated" : "mine"} onView={setSelectedTask} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTaskModal assignableUsers={assignableUsers} onCreate={createTask} onClose={() => setShowCreateModal(false)} />
      )}

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onUpdateStatus={updateTaskStatus} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default TasksBoard;