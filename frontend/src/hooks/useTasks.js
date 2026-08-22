import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import {
  fetchTasks,
  fetchAssignableUsers,
  createTask as createTaskApi,
  updateTaskStatus as updateTaskStatusApi,
} from "../services/tasks";

const ASSIGNER_ROLES = [
  "PRESIDENT",
  "GENSEC_SCITECH",
  "GENSEC_ACADEMIC",
  "GENSEC_CULTURAL",
  "GENSEC_SPORTS",
  "CLUB_COORDINATOR",
];

export function useTasks() {
  const { isUserLoggedIn } = useAdminContext();
  const [tasks, setTasks] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canAssign = Boolean(
    isUserLoggedIn && ASSIGNER_ROLES.includes(isUserLoggedIn.role),
  );

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAssignableUsers = useCallback(async () => {
    if (!canAssign) return;
    try {
      const data = await fetchAssignableUsers();
      setAssignableUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching assignable users:", err);
    }
  }, [canAssign]);

  useEffect(() => {
    if (isUserLoggedIn && Object.keys(isUserLoggedIn).length > 0) {
      loadTasks();
      loadAssignableUsers();
    }
  }, [isUserLoggedIn, loadTasks, loadAssignableUsers]);

  const createTask = useCallback(async (payload) => {
    const created = await createTaskApi(payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTaskStatus = useCallback(async (taskId, payload) => {
    const updated = await updateTaskStatusApi(taskId, payload);
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    return updated;
  }, []);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignees?.some((a) => a._id === isUserLoggedIn?._id)),
    [tasks, isUserLoggedIn],
  );

  const delegatedTasks = useMemo(
    () => tasks.filter((t) => t.assigned_by?._id === isUserLoggedIn?._id),
    [tasks, isUserLoggedIn],
  );

  return {
    tasks,
    myTasks,
    delegatedTasks,
    assignableUsers,
    loading,
    error,
    canAssign,
    createTask,
    updateTaskStatus,
    refresh: loadTasks,
  };
}