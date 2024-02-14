import React, { useState } from "react";
import { Card, CardTitle, CardText } from "reactstrap"; // Assuming you are using Reactstrap for styling

function IssueCards({ updatedDetails }) {
  const data = updatedDetails;
  const [reviewed, setReviewed] = useState(false);

  const handleSave = async (event) => {
    // Save the edited name and exit edit mode
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/auth/update`;
      const bodyData = {
        data: data.data,
        editedData: data.editedData,
        _id: data._id,
        issue: true,
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
        setReviewed(true);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return reviewed ? null : (
    <div style={{ textAlign: "center", width: "75%", marginLeft: "13%" }}>
      <Card body>
        <CardTitle tag="h5">Student Details</CardTitle>
        <CardText>
          <strong>Name:</strong> {data.data.student.name}
          <br />
          <strong>ID:</strong> {data.data.student.ID_No}
          <br />
          <strong>Program:</strong> {data.data.student.Program}
          <br />
          <strong>Discipline:</strong> {data.data.student.discipline}
          <br />
          <strong>Year of Admission:</strong> {data.data.student.add_year}
        </CardText>

        <div>
          <CardTitle tag="h5">Achievements and POR</CardTitle>
          <CardText>
            <div>
              <strong>Positions of Responsibility:</strong>
              <ul>
                {data.editedData.PORS.map((por, index) => (
                  <li key={index}>
                    {por.club}, {por.session}, {por.designation}, {por.type}
                  </li>
                ))}
              </ul>
              <button onClick={handleSave}>Accept</button>
            </div>
          </CardText>
        </div>
      </Card>
    </div>
  );
}

export default IssueCards;
