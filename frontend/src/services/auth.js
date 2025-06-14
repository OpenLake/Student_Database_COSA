import axios from "axios";

//Error Handeling function (centralised)
//While i was running the project, there was a 404 status form the backend due to which the the frontend was not running so i added a handleError functio which will handle the errors smoothly.
function handleError(error, functionName) {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.log(`[${functionName}] Error: ${error.response.status} - ${error.response.data}`);
  } else if (error.request) {
    // No response received from server
    console.log(`[${functionName}] No response received:`, error.request);
  } else {
    // Error setting up the request
    console.log(`[${functionName}] Request setup error:`, error.message);
  }
}


export async function fetchCredentials() {
  try{
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/auth/fetchAuth`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  }catch(err){
    handleError(err, "fetchCredentials");
  }
  
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
    handleError(error, "registerUser");
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
    handleError(error, "loginUser");
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
    handleError(error, "registerStudentID");
  }
}

export async function logoutUser() {
  try{
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );
    return;
  }catch(error){
    handleError(error , "logoutUser")
  }
  
}
