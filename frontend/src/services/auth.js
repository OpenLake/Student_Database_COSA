//import axios from "axios";
import api from "../utils/api";

export async function fetchCredentials() {
  const response = await api.get("/auth/fetchAuth");
  return response.data;
}

export async function completeOnboarding(userData) {
  try{
    const response = await api.put(`/onboarding`, userData);
    return response.data;
  }catch (error) {
    //console.error("Error obj is:",error.response);
    return error.response;
  }
}

export async function registerUser(username, password, name) {
  
  try {
    const response = await api.post(`/auth/register`, {
      name,
      username,
      password,
    });
    return response; 
  } catch (error) {
    //console.error("Error obj is:",error.response);
    return error.response;
  }
}

export async function loginUser(username, password) {
  try {
    const res = await api.post("/auth/login", { username, password });
    //console.log("Response is: ", res);
    return res.data;
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
