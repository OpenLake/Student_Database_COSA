import Add from "../Add_User/Components/Add";
import UserProfileButtons from "../Add_User/Components/UserProfileButtons"; // Update this path to match your project structure
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

  // Refresh user details function
  const refreshUserDetails = () => {
    if (IsUserLoggedIn?.ID_No) {
      fetchStudent(IsUserLoggedIn.ID_No).then((data) => {
        setUserDetails(data);
      });
    }
  };

  // Logout function
  const handleLogout = () => {
    setIsUserLoggedIn(null); // Clears user session
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={containerStyle}>
      {/* ENHANCED NAVBAR */}
      <nav style={navbarStyle}>
        <div style={navLeftStyle}>
          <h2 style={logoStyle}>Student Portal</h2>
        </div>
        
        {/* Navigation links now at the right side */}
        <div style={navRightStyle}>
          <Link to="/cosa" style={navLinkStyle}>
            <span style={linkIconStyle}>📚</span> Cosa
          </Link>
          <Link to="/feedback" style={navLinkStyle}>
            <span style={linkIconStyle}>💬</span> Feedback
          </Link>
          <Link to="/events" style={navLinkStyle}>
            <span style={linkIconStyle}>🗓️</span> Events
          </Link>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <span style={logoutIconStyle}>🚪</span> Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT - WIDER CONTAINER */}
      <div style={contentContainerStyle}>
        {studentDetails !== undefined ? (
          studentDetails !== null ? (
            <div style={wideContentCardStyle}>
              <h3 style={headingStyle}>Search Results</h3>
              <Card data={studentDetails} />
            </div>
          ) : (
            <div style={contentCardStyle}>
              <p style={messageStyle}>No results found</p>
            </div>
          )
        ) : userDetails ? (
          <div style={wideContentCardStyle}>
            <h3 style={headingStyle}>Your Student Profile</h3>
            <Card data={userDetails} />
            
            {/* Add UserProfileButtons for Edit and Update functionality */}
            <UserProfileButtons 
              isLoggedIn={!!IsUserLoggedIn} 
              userDetails={userDetails}
              onUpdateSuccess={refreshUserDetails}
            />
          </div>
        ) : (
          <div style={errorCardStyle}>
            <div style={errorMessageStyle}>
              Your student profile doesn't exist yet.
            </div>
            {/* Add button for users without a profile */}
            <div style={addButtonContainerStyle}>
              <Add />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <p>© 2025 Student Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* Styles */
const containerStyle = {
  fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1em 2em",
  background: "linear-gradient(to right, #3f51b5, #5c6bc0)",
  color: "white",
  boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
};

const navLeftStyle = {
  display: "flex",
  alignItems: "center",
};

const navRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1.5em",
};

const logoStyle = {
  margin: 0,
  color: "#ffcc00",
  fontSize: "1.8rem",
  fontWeight: "bold",
  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  letterSpacing: "1px",
};

const linkIconStyle = {
  marginRight: "5px",
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "1.1em",
  fontWeight: "600",
  padding: "0.6em 1em",
  borderRadius: "4px",
  background: "rgba(255,255,255,0.1)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
};

const logoutIconStyle = {
  marginRight: "5px",
};

const logoutButtonStyle = {
  background: "linear-gradient(to right, #ff4d4d, #f44336)",
  color: "white",
  border: "none",
  padding: "0.6em 1.2em",
  fontSize: "1.1em",
  fontWeight: "600",
  cursor: "pointer",
  borderRadius: "4px",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
};

const contentContainerStyle = {
  padding: "2em",
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const contentCardStyle = {
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "2em",
  width: "100%",
  maxWidth: "800px",
  transition: "transform 0.3s ease",
};

// Wider card for student profiles and search results
const wideContentCardStyle = {
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "2em",
  width: "100%",
  maxWidth: "1200px", // Much wider container for student details
  transition: "transform 0.3s ease",
  overflow: "auto", // Ensures content doesn't overflow
};

const errorCardStyle = {
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "3em",
  width: "100%",
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const headingStyle = {
  textAlign: "center",
  fontSize: "1.8em",
  fontWeight: "bold",
  color: "#3f51b5",
  marginBottom: "1.5em",
  paddingBottom: "0.8em",
  borderBottom: "2px solid #e0e0e0",
};

const messageStyle = {
  textAlign: "center",
  fontSize: "1.5em",
  fontWeight: "bold",
  color: "#666",
};

const errorMessageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "1.5em",
  fontWeight: "bold",
  color: "#e53935",
  textAlign: "center",
  padding: "2em",
};

// Style for the Add button container when no profile exists
const addButtonContainerStyle = {
  marginTop: "2em",
};

const footerStyle = {
  textAlign: "center",
  padding: "1em",
  background: "#f8f9fa",
  color: "#6c757d",
  borderTop: "1px solid #dee2e6",
  marginTop: "auto",
};

export default Body;