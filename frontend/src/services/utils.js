export async function fetchStudent(student_ID) {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/fetch`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_ID }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.json();
      return { success: false, message: error.message };
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    return { success: false, message: "Failed to connect to the server" };
  }
}
