import axios from "axios";

export async function fetchCredentials() {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/auth/fetchAuth`,
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function registerUser(name, ID, email, password) {
  const data = JSON.stringify({
    name: name,
    ID: ID,
    email: email,
    password: password,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: data,
  };

  try {
    const response = await axios.request(config);

    if (response.status === 200) {
      return response.data.user;
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
    url: `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: data,
  };

  try {
    const response = await axios.request(config);

    if (response.status === 200) {
      return response.data.user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function registerStudentId(id, ID_No) {
  const data = JSON.stringify({
    token: id,
    ID_No: ID_No,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_BACKEND_URL}/auth/google/register`,
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
    console.error("Error registering student ID:", error);
    return null;
  }
}

export async function logoutUser() {
  await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
    {},
    { withCredentials: true },
  );
  return;
}
