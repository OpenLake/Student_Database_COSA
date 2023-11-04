import React, { useState }  from 'react';
import { Card, CardTitle, CardText } from 'reactstrap'; // Assuming you are using Reactstrap for styling

function UpdateCards({studentDetails}) {
  
    const data = studentDetails
    const [isEditing, setIsEditing] = useState(false);
    // const [editedAchievements, setEditedAchievements] = useState(data.achievements.slice());
    const [editedPORs, setEditedPORs] = useState(data.PORS.slice());
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async (event)=> {
        // Save the edited name and exit edit mode
     
        const editedData = {
            // achievements: editedAchievements,
            PORS: editedPORs,
          };
          console.log(editedData);
        setIsEditing(false);
        event.preventDefault(); 
        try {
            const url = 'http://localhost:8000/auth/update';
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data,editedData),
              credentials: 'include',
            });
        
            if (response.status == 201) {
              console.log(response)
         
            } else {
              throw new Error('Request failed');
            }
          } catch (error) {
            console.log(error);
          }
    };
  return (
    <div style={{ textAlign: 'center', width: '75%', marginLeft: '13%' }}>
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
            <strong>Achievements:</strong>
            {/* <ul>
              {editedAchievements.map((achievement, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => {
                      const updatedAchievements = [...editedAchievements];
                      updatedAchievements[index] = e.target.value;
                      setEditedAchievements(updatedAchievements);
                    }}
                  />
                </li>
              ))}
            </ul> */}

            <strong>Positions of Responsibility:</strong>
            <ul>
              {editedPORs.map((por, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={por.club}
                    onChange={(e) => {
                      const updatedPORs = [...editedPORs];
                      updatedPORs[index].club = e.target.value;
                      setEditedPORs(updatedPORs);
                    }}
                  />
                  <input
                    type="text"
                    value={por.session}
                    onChange={(e) => {
                      const updatedPORs = [...editedPORs];
                      updatedPORs[index].session = e.target.value;
                      setEditedPORs(updatedPORs);
                    }}
                  />
                  <input
                    type="text"
                    value={por.designation}
                    onChange={(e) => {
                      const updatedPORs = [...editedPORs];
                      updatedPORs[index].designation = e.target.value;
                      setEditedPORs(updatedPORs);
                    }}
                  />
                  {por.type}
                </li>
              ))}
            </ul>

            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div>
            <strong>Achievements:</strong>
            {/* <ul>
              {editedAchievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul> */}

            <strong>Positions of Responsibility:</strong>
            <ul>
              {editedPORs.map((por, index) => (
                <li key={index}>
                  {por.club}, {por.session}, {por.designation},{por.type}
                </li>
              ))}
            </ul>

            <button onClick={handleEdit}>Edit</button>
          </div>
        )}
      </CardText>
    </div>
      </Card>
    </div>
  );
}

export default UpdateCards;

  