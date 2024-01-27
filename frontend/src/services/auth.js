import axios from "axios";

export async function fetchCredentials() {
  const response = await axios.get("http://localhost:8000/auth/fetchAuth", {
    withCredentials: true,
  });
  return response.data;
}

export async function registerUser(name, email, password) {
  const data = JSON.stringify({
    name: name,
    email: email,
    password: password,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8000/auth/register",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: data,
  };

  try {
    const response = await axios.request(config);

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function loginUser(email, password) {
  const data = JSON.stringify({
    email: email,
    password: password,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8000/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: data,
  };

  try {
    const response = await axios.request(config);

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
