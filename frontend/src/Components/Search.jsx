import React, { useState } from "react";
import { Input } from "reactstrap";
import { Button, Form } from "reactstrap";
import { fetchStudent } from "../services/utils";

function Search({ setStudentDetails }) {
  const [student_ID, setStudentID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChangestudentID = (e) => {
    setStudentID(e.target.value);
    setErrorMessage(""); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!student_ID.trim()) {
      setErrorMessage("Please enter a valid student ID.");
      return;
    }

    const data = await fetchStudent(student_ID);

    if (!data || !data.student) {
      setErrorMessage("Student not found. Please check the ID and try again.");
      setStudentDetails(null); 
    } else {
      setErrorMessage(""); 
      setStudentDetails(data);
    }
  };

  return (
    <div>
      <Form className="d-flex">
        <Input
          id="Txt"
          className="form-control me-2"
          name="text"
          placeholder="Enter ID Number"
          type="text"
          value={student_ID}
          onChange={onChangestudentID}
        />
        <Button className="btn btn-light" type="submit" onClick={handleSubmit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="mb-1 bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </Button>
      </Form>
      {errorMessage && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default Search;
