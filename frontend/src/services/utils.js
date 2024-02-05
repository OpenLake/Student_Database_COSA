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
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
