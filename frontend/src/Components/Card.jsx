import React from "react";
import { Table } from "reactstrap";

function Cards({ data }) {
  if (!data || !data.student) {
    return null; // Return early if data or data.student is undefined
  }

  return (
    <div
      style={{
        textAlign: "center",
        width: "1000px",
        margin: "auto",

        marginTop: "30px ",
        backgroundColor: "black",
        color: "red",
      }}
    >
      <Table
        bordered
        style={{ background: "black", color: "white", margin: "auto" }}
      >
        <thead>
          <tr>
            <th colSpan="2" className="table-heading">
              Student Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{data.student.name}</td>
          </tr>
          <tr>
            <td>ID</td>
            <td>{data.student.ID_No}</td>
          </tr>
          <tr>
            <td>Program</td>
            <td>{data.student.Program}</td>
          </tr>
          <tr>
            <td>Discipline</td>
            <td>{data.student.discipline}</td>
          </tr>
          <tr>
            <td>Year of Admission</td>
            <td>{data.student.add_year}</td>
          </tr>
        </tbody>
      </Table>

      <Table
        bordered
        style={{
          background: "black",
          color: "white",
          marginTop: "30px",
          margin: "auto",
        }}
      >
        <thead>
          <tr>
            <th colSpan="4" className="table-heading">
              Achievements
            </th>
          </tr>
          <tr>
            <th>Under</th>
            <th>Designation</th>
            <th>Event Name</th>
            <th>Conducted By</th>
          </tr>
        </thead>
        <tbody>
          {data.achievements &&
            data.achievements.map((ach, index) => (
              <tr key={index}>
                <td>{ach.under}</td>
                <td>{ach.designation}</td>
                <td>{ach.eventName}</td>
                <td>{ach.conductedBy}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Table
        bordered
        style={{
          background: "black",
          color: "white",
          marginTop: "30px",
          margin: "auto",
        }}
      >
        <thead>
          <tr>
            <th colSpan="5" className="table-heading">
              Positions of Responsibility
            </th>
          </tr>
          <tr>
            <th>Club</th>
            <th>Designation</th>
            <th>Session</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.PORS &&
            data.PORS.map((por, index) => (
              <tr key={index}>
                <td>{por.club}</td>
                <td>{por.designation}</td>
                <td>{por.session}</td>
                <td>{por.type}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Cards;
