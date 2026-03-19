import api from "../utils/api";

export async function fetchBatchUsers(userIds = []) {
  try {
    const res = await api.post("/api/batches/batch-users", { userIds });
    return res.data.message;
  } catch (err) {
    console.error("fetchBatchUsers error:", err);
    return [];
  }
}

export async function fetchBatches() {
  try {
    const res = await api.get("/api/batches");
    return res.data.message;
  } catch (err) {
    console.error("fetchBatches error:", err);
  }
}

export async function createBatch(data) {
  try {
    const res = await api.post("/api/batches/create-batch", data);
    return res.data.message;
  } catch (err) {
    console.error("createBatch error:", err);
  }
}
