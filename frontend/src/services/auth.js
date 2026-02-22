import api from "../utils/api";
export async function fetchCredentials() {
  const response = await api.get(`/auth/fetchAuth`);
  return response.data;
}

export async function completeOnboarding(userData) {
  const response = await api.post(`/onboarding`, userData);
  return response.data;
}
export async function registerUser(name, ID, email, password) {
  try {
    const response = await api.post(`/auth/register`, {
      name,
      ID,
      email,
      password,
    });
    return response.data.user || null;
  } catch (error) {
    return null;
  }
}

export async function loginUser(email, password) {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data.user || null;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return null;
  }
}

export async function registerStudentId(id, ID_No) {
  try {
    const res = await api.post("/auth/google/register", {
      token: id,
      ID_No,
    });
    return res.data || null;
  } catch (error) {
    console.error(
      "Error registering student ID:",
      error.response?.data || error.message,
    );
    return null;
  }
}
export async function logoutUser() {
  try {
    await api.post("/auth/logout");
    return true;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    return false;
  }
}
