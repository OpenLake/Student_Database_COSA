import React, { useState } from "react";
import { Card, CardTitle, CardText } from "reactstrap"; // Assuming you are using Reactstrap for styling

function IssueCards({ studentDetails }) {
  const data = studentDetails;
  const [isEditing, setIsEditing] = useState(false);
  const [editedPORs, setEditedPORs] = useState(data.PORS.slice());
  const [createdIssue, setCreated] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handledisarrange = () => {
    setIsEditing(false);
  };

  const addNewPOR = () => {
    const newPOR = {
      club: "",
      session: "",
      designation: "",
      type: "", // You can set the default type here
    };
    setEditedPORs([...editedPORs, newPOR]);
  };

  const handleSave = async (event) => {
    // Save the edited name and exit edit mode

    const editedData = {
      // achievements: editedAchievements,
      PORS: editedPORs,
    };
    setIsEditing(false);
    event.preventDefault();
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/auth/update`;
      const bodyData = {
        editedData: editedData, // Add editedData
        data: data, // Add the other variable data
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });
      if (response.ok) {
        setCreated(true);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center", width: "75%", marginLeft: "13%" }}>
      <Card body>
        <CardTitle tag="h5">Student Details</CardTitle>
        <CardText>
          <strong>Name:</strong> {data.student.name}
          <br />
          <strong>ID:</strong> {data.student.ID_No}
          <br />
          <strong>Program:</strong> {data.student.Program}
          <br />
          <strong>Discipline:</strong> {data.student.discipline}
          <br />
          <strong>Year of Admission:</strong> {data.student.add_year}
        </CardText>

        <div>
          <CardTitle tag="h5">Achievements and POR</CardTitle>
          <CardText>
            {isEditing ? (
              <div>
                <strong>Positions of Responsibility:</strong>
                <ul>
                  {editedPORs.map((por, index) => (
                    <li key={index}>
                      <label>Club:</label>
                      <input
                        type="text"
                        value={por.club}
                        onChange={(e) => {
                          const updatedPORs = [...editedPORs];
                          updatedPORs[index].club = e.target.value;
                          setEditedPORs(updatedPORs);
                        }}
                      />
                      <label>Session:</label>
                      <input
                        type="text"
                        value={por.session}
                        onChange={(e) => {
                          const updatedPORs = [...editedPORs];
                          updatedPORs[index].session = e.target.value;
                          setEditedPORs(updatedPORs);
                        }}
                      />
                      <label>Designation:</label>
                      <input
                        type="text"
                        value={por.designation}
                        onChange={(e) => {
                          const updatedPORs = [...editedPORs];
                          updatedPORs[index].designation = e.target.value;
                          setEditedPORs(updatedPORs);
                        }}
                      />

                      <li key={index}>
                        <label>Type:</label>
                        {por._id ? ( // Check if por.type exists
                          <span>{por.type}</span> // Display the current value as text
                        ) : (
                          <select
                            value={por.type}
                            onChange={(e) => {
                              const updatedPORs = [...editedPORs];
                              updatedPORs[index].type = e.target.value;
                              setEditedPORs(updatedPORs);
                            }}
                          >
                            <option value="Acad-POR">Academics POR</option>
                            <option value="Scitech-POR">Scitech POR</option>
                            <option value="Cult-POR">Culturals POR</option>
                            <option value="Sport-POR">Sports POR</option>
                          </select>
                        )}
                      </li>
                    </li>
                  ))}
                </ul>
                <li>
                  <button onClick={addNewPOR}>Add New POR</button>
                </li>
                <button onClick={handleSave}>Create Issue</button>
                <button onClick={handledisarrange}>Disarrange</button>
              </div>
            ) : (
              <div>
                <strong>Positions of Responsibility:</strong>
                <ul>
                  {data.PORS.slice().map((por, index) => (
                    <li key={index}>
                      {por.club}, {por.session}, {por.designation}, {por.type}
                    </li>
                  ))}
                </ul>
                <button onClick={handleEdit}>Suggest Edit</button>
              </div>
            )}
          </CardText>
        </div>
      </Card>
      {createdIssue ? <p>Issue Created Successfully</p> : null}
    </div>
  );
}

export default IssueCards;
