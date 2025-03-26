import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Add from "../Add_User/Components/Add";
import UserProfileButtons from "../Add_User/Components/UserProfileButtons";
import Card from "../Components/Card";
import { fetchStudent } from "../services/utils";
import { ShowSkills, AddSkill } from "./ShowAddSkill";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";
// import "./Body.css";

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

  const refreshUserDetails = () => {
    if (IsUserLoggedIn?.ID_No) {
      fetchStudent(IsUserLoggedIn.ID_No).then((data) => {
        setUserDetails(data);
      });
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await logoutUser();
    setIsUserLoggedIn(null);
    navigate("/login");
  };

  return (
    <div className="body-container">
      <nav className="navbar px-4">
        <h2 className="navbar-title">Student Portal</h2>
        <div className="navbar-links">
          <Link to="/cosa" className="nav-link">
            📚 Cosa
          </Link>
          <Link to="/feedback" className="nav-link">
            💬 Feedback
          </Link>
          <Link to="/events" className="nav-link">
            🗓️ Events
          </Link>
          <button onClick={handleLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </nav>

      <div className="main-content">
        {studentDetails !== undefined ? (
          studentDetails !== null ? (
            <div className="wide-content-card">
              <h3>Search Results</h3>
              <Card data={studentDetails} />
            </div>
          ) : (
            <div className="content-card">
              <p>No results found</p>
            </div>
          )
        ) : userDetails ? (
          <div className="wide-content-card">
            <h3>Your Student Profile</h3>
            <Card data={userDetails} />
            <UserProfileButtons
              isLoggedIn={!!IsUserLoggedIn}
              userDetails={userDetails}
              onUpdateSuccess={refreshUserDetails}
            />
          </div>
        ) : (
          <div className="error-card">
            <p>Your student profile doesn't exist yet.</p>
            <div>
              <Add />
            </div>
          </div>
        )}
      </div>

      {/* Responsive Skills Section */}
      <div className="skills-section-container">
        <div className="skills-row">
          <div className="skill-card">
            <ShowSkills />
          </div>
          <div className="skill-card">
            <AddSkill />
          </div>
        </div>
      </div>

      <footer className="footer">
        © 2025 Student Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default Body;
