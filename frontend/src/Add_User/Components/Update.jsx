// import React, { useState }  from 'react';
// import { Card, CardTitle, CardText } from 'reactstrap'; // Assuming you are using Reactstrap for styling

// function UpdateCards({studentDetails}) {

//     const data = studentDetails
//     const [isEditing, setIsEditing] = useState(false);
//     // const [editedAchievements, setEditedAchievements] = useState(data.achievements.slice());
//     const [editedPORs, setEditedPORs] = useState(data.PORS.slice());
//     const handleEdit = () => {
//         setIsEditing(true);
//     };
//     const handledisarrange = ()=>{
//       setIsEditing(false)
//     }
//     const addNewPOR = () => {
//         const newPOR = {
//           club: '',
//           session: '',
//           designation: '',
//           type: '', // You can set the default type here
//         };

//         // Append the new POR object to the editedPORs array
//         setEditedPORs([...editedPORs, newPOR]);
//       };
//     const handleSave = async (event)=> {
//         // Save the edited name and exit edit mode

//         const editedData = {
//             // achievements: editedAchievements,
//             PORS: editedPORs,
//           };
//           console.log(editedData);
//         setIsEditing(false);
//         event.preventDefault();
//         try {
//             const url = 'http://localhost:8000/auth/update';
//             const response = await fetch(url, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify(data),
//               credentials: 'include',
//             });

//             if (response.status === 201) {

//             } else {
//               throw new Error('Request failed');
//             }
//           } catch (error) {
//             console.log(error);
//           }
//     };
//   return (
//     <div style={{ textAlign: 'center', width: '75%', marginLeft: '13%' }}>
//       <Card body>
//         <CardTitle tag="h5">Student Details</CardTitle>
//         <CardText>
//           <strong>Name:</strong> {data.student.name}
//           <br />
//           <strong>ID:</strong> {data.student.ID_No}
//           <br />
//           <strong>Program:</strong> {data.student.Program}
//           <br />
//           <strong>Discipline:</strong> {data.student.discipline}
//           <br />
//           <strong>Year of Admission:</strong> {data.student.add_year}
//         </CardText>

//         <div>
//       <CardTitle tag="h5">Achievements and POR</CardTitle>
//       <CardText>
//         {isEditing ? (
//           <div>
//             <strong>Achievements:</strong>
//             {/* <ul>
//               {editedAchievements.map((achievement, index) => (
//                 <li key={index}>
//                   <input
//                     type="text"
//                     value={achievement}
//                     onChange={(e) => {
//                       const updatedAchievements = [...editedAchievements];
//                       updatedAchievements[index] = e.target.value;
//                       setEditedAchievements(updatedAchievements);
//                     }}
//                   />
//                 </li>
//               ))}
//             </ul> */}

//             <strong>Positions of Responsibility:</strong>
//             <ul>
//               {editedPORs.map((por, index) => (
//                 <li key={index}>
//                 <label>Club:</label>
//                   <input
//                     type="text"
//                     value={por.club}
//                     onChange={(e) => {
//                       const updatedPORs = [...editedPORs];
//                       updatedPORs[index].club = e.target.value;
//                       setEditedPORs(updatedPORs);
//                     }}
//                   />
//                   <label>Session</label>
//                   <input
//                     type="text"
//                     value={por.session}
//                     onChange={(e) => {
//                       const updatedPORs = [...editedPORs];
//                       updatedPORs[index].session = e.target.value;
//                       setEditedPORs(updatedPORs);
//                     }}
//                   />
//                   <label>designation</label>
//                   <input
//                     type="text"
//                     value={por.designation}
//                     onChange={(e) => {
//                       const updatedPORs = [...editedPORs];
//                       updatedPORs[index].designation = e.target.value;
//                       setEditedPORs(updatedPORs);
//                     }}
//                   />
//                   {por.type}
//                 </li>
//               ))}
//             </ul>
//                 <li>
//         <button onClick={addNewPOR}>Add New POR</button>
//       </li>
//             <button onClick={handleSave}>Save</button>
//             <button onClick={handledisarrange}>disarrange</button>
//           </div>
//         ) : (
//           <div>
//             <strong>Achievements:</strong>
//             {/* <ul>
//               {editedAchievements.map((achievement, index) => (
//                 <li key={index}>{achievement}</li>
//               ))}
//             </ul> */}

//             <strong>Positions of Responsibility:</strong>
//             <ul>
//               {editedPORs.map((por, index) => (
//                 <li key={index}>
//                   {por.club}, {por.session}, {por.designation},{por.type}
//                 </li>
//               ))}
//             </ul>

//             <button onClick={handleEdit}>Edit</button>
//           </div>
//         )}
//       </CardText>
//     </div>
//       </Card>
//     </div>
//   );
// }

// export default UpdateCards;

import React, { useState } from "react";
import { Card, CardTitle, CardText } from "reactstrap"; // Assuming you are using Reactstrap for styling

function UpdateCards({ studentDetails }) {
  const data = studentDetails;
  const [isEditing, setIsEditing] = useState(false);
  const [editedPORs, setEditedPORs] = useState(data.PORS.slice());
  const [newPOR, setNewPOR] = useState({
    club: "",
    session: "",
    designation: "",
    type: "", // You can set the default type here
  });

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
    console.log(editedData);
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

      if (response.status === 201) {
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
                <button onClick={handleSave}>Save</button>
                <button onClick={handledisarrange}>Disarrange</button>
              </div>
            ) : (
              <div>
                <strong>Positions of Responsibility:</strong>
                <ul>
                  {editedPORs.map((por, index) => (
                    <li key={index}>
                      {por.club}, {por.session}, {por.designation}, {por.type}
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
