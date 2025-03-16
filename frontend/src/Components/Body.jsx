import { useState, useContext, useEffect } from "react";
import { AdminContext } from "../App";
import Card from "../Components/Card";
import { fetchStudent } from "../services/utils";
import { ShowSkills, AddSkill } from "../Components/ShowAddSkill"; // Import skill components

function Body({ studentDetails }) {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchStudent(IsUserLoggedIn.ID_No).then((data) => {
      setUserDetails(data);
    });
  }, [IsUserLoggedIn.ID_No]);

  return (
    <div>
      {studentDetails !== undefined ? (
        studentDetails !== null ? (
          <>
            <p
              style={{
                textAlign: "center",
                fontSize: "1.5em",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Search Results
            </p>
            <Card data={studentDetails} />
            <ShowSkills /> {/* Display skills of searched student */}
          </>
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5em",
              fontWeight: "bold",
            }}
          >
            No results found
          </p>
        )
      ) : userDetails ? (
        <>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5em",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Your Student Profile
          </p>
          <Card data={userDetails} />
          <ShowSkills /> {/* Show logged-in user's skills */}
          <AddSkill /> {/* Allow logged-in user to add skills */}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2em",
            height: "100%",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Your student profile doesn't exist yet, contact admins.
        </div>
      )}
    </div>
  );
}

export default Body;
