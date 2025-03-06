import { useState, useContext, useEffect } from "react";
import { AdminContext } from "../App";
import Card from "../Components/Card";
import { fetchStudent } from "../services/utils";
import { Link, useNavigate } from "react-router-dom";

function Body({ studentDetails }) {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (IsUserLoggedIn?.ID_No) {
      fetchStudent(IsUserLoggedIn.ID_No).then((data) => {
        setUserDetails(data);
      });
    }
  }, [IsUserLoggedIn]);

  // Logout function
  const handleLogout = () => {
    setIsUserLoggedIn(null); // Clears user session
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={containerStyle}>
      {/* SINGLE NAVBAR */}
      <nav style={navbarStyle}>
        <h2 style={logoStyle}>Student Portal</h2>
        <div style={navLinksContainer}>
          <Link to="/cosa" style={navLinkStyle}>Cosa</Link>
          <Link to="/feedback" style={navLinkStyle}>Feedback</Link>
          <Link to="/events" style={navLinkStyle}>Events</Link>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ padding: "2em" }}>
        {studentDetails !== undefined ? (
          studentDetails !== null ? (
            <>
              <h3 style={headingStyle}>Search Results</h3>
              <Card data={studentDetails} />
            </>
          ) : (
            <p style={messageStyle}>No results found</p>
          )
        ) : userDetails ? (
          <>
            <h3 style={headingStyle}>Your Student Profile</h3>
            <Card data={userDetails} />
          </>
        ) : (
          <div style={errorMessageStyle}>
            Your student profile doesn't exist yet, contact admins.
          </div>
        )}
      </div>

      {/* EMPTY SPACE FOR ADD COMPONENT */}
      <div style={{ height: "3em" }}></div>
    </div>
  );
}

/* Styles */
const containerStyle = {
  fontFamily: "Arial, sans-serif",
  background: "#f4f4f4",
  minHeight: "100vh",
};

const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1em 2em",
  background: "#333",
  color: "white",
};

const logoStyle = {
  margin: 0,
  color: "#ffcc00",
};

const navLinksContainer = {
  display: "flex",
  gap: "1em",
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "1em",
  fontWeight: "bold",
  transition: "0.3s",
};

const logoutButtonStyle = {
  background: "#ff4d4d",
  color: "white",
  border: "none",
  padding: "0.5em 1em",
  fontSize: "1em",
  cursor: "pointer",
  borderRadius: "5px",
};

const headingStyle = {
  textAlign: "center",
  fontSize: "1.5em",
  fontWeight: "bold",
  textDecoration: "underline",
};

const messageStyle = {
  textAlign: "center",
  fontSize: "1.5em",
  fontWeight: "bold",
};

const errorMessageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2em",
  height: "100%",
  fontWeight: "bold",
  color: "#555",
};

export default Body;
