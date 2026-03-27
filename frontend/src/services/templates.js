import api from "../utils/api";

/* /api/templates */
export async function fetchTemplates() {
  try {
    const res = await api.get("/api/templates");
    // Axios auto-throws on non-2xx; res.data is the response body directly
    return {data: res.data.message, status: res.status};
  } catch (err) {
    console.error("fetchTemplates error:", err);
    return err.response?.data.message;
  }
}
