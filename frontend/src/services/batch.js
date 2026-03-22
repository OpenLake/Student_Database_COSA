import api from "../utils/api";

export async function fetchBatchUsers(userIds = []) {
  try {
    const res = await api.post("/api/batches/batch-users", { userIds });
    return res.data.message;
  } catch (err) {
    console.error("fetchBatchUsers error:", err);
    return err.response?.data.message;
  }
}

export async function fetchBatches(userId) {
  try {
    const res = await api.get(`/api/batches/${userId}`);
    return res.data.message;
  } catch (err) {
    console.error("fetchBatches error:", err);
    return err.response?.data.message;
  }
}

export async function createBatch(data) {
  try {
    const res = await api.post("/api/batches/create-batch", data);
    return res.data.message;
  } catch (err) {
    console.error("createBatch error:", err);
    return err.response?.data.message;
  }
}

export async function editBatch(data) {
  try {
    const res = await api.patch("/api/batches/edit-batch", data);
    return res.data.message;
  } catch (err) {
    console.error("Error while editing batch:", err);
    return err.response?.data.message;
  }
}

export async function approverEditBatch(data) {
  try {
    const res = await api.patch("/api/batches/approver/edit-batch", data);
    return res.data.message;
  } catch (err) {
    console.error("Error while editing batch:", err);
    return err.response?.data.message;
  }
}

export async function duplicateBatch(batchId) {
  try {
    const res = await api.post("/api/batches/duplicate-batch", { batchId });
    return res.data.message;
  } catch (err) {
    console.error("Error while duplicating batch:", err);
    return err.response?.data.message;
  }
}

export async function deleteBatch(batchId) {
  try {
    //console.log("Deleting batch:", batchId);
    const res = await api.delete("/api/batches/delete-batch", {
      data: { batchId },
    });
    return res.data.message;
  } catch (err) {
    console.error("Error while deleting batch:", err);
    return err.response?.data.message;
  }
}

export async function archiveBatchApi(batchId) {
  try {
    //console.log("Deleting batch:", batchId);
    const res = await api.patch("/api/batches/archive-batch", { batchId });
    return res.data.message;
  } catch (err) {
    console.error("Error while archiving batch:", err);
    return err.response?.data.message;
  }
}

export async function approveBatch(batch) {
  try {
    const res = await api.get(`/api/batches/${batch?._id}/approve`);
    console.log(res);
    return res.data.message;
  } catch (err) {
    console.error("Error while approving batch: ", err);
    return err.response?.data.message;
  }
}

export async function rejectBatch(batch) {
  try {
    const res = await api.get(`/api/batches/${batch?._id}/reject`);
    return res.data.message;
  } catch (err) {
    console.error("Error while rejecting batch: ", err);
    return err.response?.data.message;
  }
}
