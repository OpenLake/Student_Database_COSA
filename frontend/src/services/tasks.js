import api from "../utils/api";

export async function fetchTasks() {
  try {
    const response = await api.get("api/tasks");
    return { data: response.data.message, success: true };
  } catch (err) {
    console.error(err);
    return err?.message || "An error occurred while fetching tasks";
  }
}

export async function createTask(newTask) {
  try {
    const response = await api.post("api/tasks/create-task", newTask);
    return { data: response.data.message, success: true };
  } catch (err) {
    console.error(err);
    return "An error occurred while creating the task";
  }
}

export async function updateTask(
  taskId,
  newStatus,
  submissionNote,
  adminNotes,
) {
  try {
    const response = await api.patch(`/api/tasks/${taskId}`, {
      status: newStatus,
      submission_note: submissionNote,
      admin_note: adminNotes,
    });

    return { data: response.data.message, success: true };
  } catch (err) {
    console.error(err);
    return err?.message || "An error occurred while updating the task";
  }
}

export async function fetchTaskUsers() {
  try {
    const response = await api.get("api/tasks/get-users");
    return { data: response.data.message, success: true };
  } catch (err) {
    console.error(err);
    return err?.message || "An error occurred while fetching task users";
  }
}
