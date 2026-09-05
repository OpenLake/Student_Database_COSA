import api from "../utils/api";

export async function fetchStudents(params = {}) {
  try {
    const res = await api.get("/api/students", { params });
    return { data: res.data, status: res.status };
  } catch (err) {
    console.error("fetchStudents error:", err);
    return { data: err.response?.data, status: err.response?.status };
  }
}

export async function fetchStudentById(id) {
  try {
    const res = await api.get(`/api/students/${id}`);
    return { data: res.data, status: res.status };
  } catch (err) {
    console.error("fetchStudentById error:", err);
    return { data: err.response?.data, status: err.response?.status };
  }
}

export async function fetchStudentFilterOptions() {
  try {
    const res = await api.get("/api/students/filters/options");
    return { data: res.data, status: res.status };
  } catch (err) {
    console.error("fetchStudentFilterOptions error:", err);
    return { data: err.response?.data, status: err.response?.status };
  }
}