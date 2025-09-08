import api from "../utils/api";
export async function fetchStudent(student_ID) {
  try {
    const response = await api.post("/fetch", { student_ID });
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error(
      "Error fetching student:",
      error.response?.data || error.message,
    );
    return null;
  }
}
