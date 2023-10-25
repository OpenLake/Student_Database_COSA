import React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap'; // Assuming you are using Reactstrap for styling

function Cards({ data }) {
  return (
    <div style={{ textAlign: 'center', width: '75%', marginLeft: '13%' }}>
      <Card body>
        <CardTitle tag="h5">Student Details</CardTitle>
        <CardText>
          <strong>Name:</strong> {data.name}
          <br />
          <strong>ID:</strong> {data.id}
          <br />
          <strong>Program:</strong> {data.Program}
          <br />
          <strong>Discipline:</strong> {data.discipline}
          <br />
          <strong>Year of Admission:</strong> {data.add_year}
        </CardText>
        <CardTitle tag="h5">Achievements and POR</CardTitle>
        <CardText>
          {/* Assuming data.achievements and data.pos_res are arrays */}
          <strong>Achievements:</strong>
          {/* <ul>
            {data.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul> */}
          <br />
          <strong>Positions of Responsibility:</strong>
          {/* <ul>
            {data.pos_res.map((por, index) => (
              <li key={index}>{por}</li>
            ))}
          </ul> */}
        </CardText>
        
      </Card>
    </div>
  );
}

export default Cards;

  