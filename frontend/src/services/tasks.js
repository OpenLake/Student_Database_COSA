import api from "../utils/api";

export async function fetchTasks() {
  const response = await api.get("/api/tasks");
  return response.data;
}

export async function fetchTaskStats() {
  const response = await api.get("/api/tasks/stats");
  return response.data;
}

export async function fetchAssignableUsers() {
  const response = await api.get("/api/tasks/assignable-users");
  return response.data;
}

export async function createTask(payload) {
  const response = await api.post("/api/tasks", payload);
  return response.data;
}

export async function updateTaskStatus(taskId, payload) {
  const response = await api.patch(`/api/tasks/${taskId}/status`, payload);
  return response.data;
}