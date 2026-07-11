import api from "../utils/api";

/* GET /api/templates */
export async function fetchTemplates() {
  try {
    const res = await api.get("/api/templates");

    return {
      data: res.data.message,
      status: res.status,
    };
  } catch (err) {
    console.error("fetchTemplates error:", err);
    return err.response?.data?.message;
  }
}

/* GET /api/templates/:id */
export async function fetchTemplate(id) {
  try {
    const res = await api.get(`/api/templates/${id}`);

    return {
      data: res.data.message,
      status: res.status,
    };
  } catch (err) {
    console.error("fetchTemplate error:", err);
    return err.response?.data?.message;
  }
}

/* POST /api/templates */
export async function createTemplate(data) {
  try {
    const res = await api.post("/api/templates", data);

    return {
      data: res.data.message,
      status: res.status,
    };
  } catch (err) {
    console.error("createTemplate error:", err);
    return err.response?.data?.message;
  }
}

/* PATCH /api/templates/:id */
export async function updateTemplate(id, data) {
  try {
    const res = await api.patch(`/api/templates/${id}`, data);

    return {
      data: res.data.message,
      status: res.status,
    };
  } catch (err) {
    console.error("updateTemplate error:", err);
    return err.response?.data?.message;
  }
}

/* DELETE /api/templates/:id */
/* (Archives the template if your backend uses soft delete) */
export async function deleteTemplate(id) {
  try {
    const res = await api.delete(`/api/templates/${id}`);

    return {
      data: res.data.message,
      status: res.status,
    };
  } catch (err) {
    console.error("deleteTemplate error:", err);
    return err.response?.data?.message;
  }
}

export async function archiveTemplate(id) {
  try {
    const res = await api.delete(`/api/templates/${id}`);

    return {
      data: res.data.message,
      status: res.status,
    };
  } catch (err) {
    console.error("archiveTemplate error:", err);
    throw err;
  }
}