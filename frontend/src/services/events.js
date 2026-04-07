import api from "../utils/api";

/* api/events */
export async function fetchEvents() {
  try {
    const res = await api.get("/api/events");
    // Axios auto-throws on non-2xx; res.data is the response body directly
    return res.data;
  } catch (err) {
    console.error("fetchEvents error:", err);
    return err.response?.data.message;
  }
}
