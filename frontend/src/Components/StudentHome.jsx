import { useState, useContext, useEffect } from "react";
import { AdminContext } from "../App";
import Card from "../Components/Card";
import { fetchStudent } from "../services/utils";
import { Link } from "react-router-dom";

function StudentHome({ studentDetails }) {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchStudent(IsUserLoggedIn.ID_No).then((data) => {
      setUserDetails(data);
    });
  }, [IsUserLoggedIn.ID_No]);

  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-around", padding: "10px", background: "#333", color: "#fff" }}>
        <Link to="/cosa" style={{ color: "#fff", textDecoration: "none" }}>COSA</Link>
        <Link to="/feedback" style={{ color: "#fff", textDecoration: "none" }}>Feedback</Link>
        <Link to="/events" style={{ color: "#fff", textDecoration: "none" }}>Events</Link>
      </nav>
      
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

export default StudentHome;
