import Add from "../Add_User/Components/Add";
import UserProfileButtons from "../Add_User/Components/UserProfileButtons";
import { useState, useContext, useEffect } from "react";
import { AdminContext } from "../App";
import Card from "../Components/Card";
import { fetchStudent } from "../services/utils";
import { Link, useNavigate } from "react-router-dom";
import { ShowSkills, AddSkill } from "./ShowAddSkill";

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

  const handleLogout = () => {
    setIsUserLoggedIn(null);
    navigate("/login");
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="logo">Student Portal</h2>
        </div>
        <div className="nav-right">
          <Link to="/cosa" className="nav-link">
            <span>📚</span> Cosa
          </Link>
          <Link to="/feedback" className="nav-link">
            <span>💬</span> Feedback
          </Link>
          <Link to="/events" className="nav-link">
            <span>🗓️</span> Events
          </Link>
          <button onClick={handleLogout} className="logout-button">
            <span>🚪</span> Logout
          </button>
        </div>
      </nav>

      <div className="content-container">
        {studentDetails !== undefined ? (
          studentDetails !== null ? (
            <div className="wide-content-card">
              <h3 className="heading">Search Results</h3>
              <Card data={studentDetails} />
            </div>
          ) : (
            <div className="content-card">
              <p className="message">No results found</p>
            </div>
          )
        ) : userDetails ? (
          <div className="wide-content-card">
            <h3 className="heading">Your Student Profile</h3>
            <Card data={userDetails} />
            <UserProfileButtons
              isLoggedIn={!!IsUserLoggedIn}
              userDetails={userDetails}
              onUpdateSuccess={refreshUserDetails}
            />
          </div>
        ) : (
          <div className="error-card">
            <div className="error-message">Your student profile doesn't exist yet.</div>
            <div className="add-button-container">
              <Add />
            </div>
          </div>
        )}
      </div>

      <ShowSkills />
      <AddSkill />

      <footer className="footer">
        <p>© 2025 Student Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Body;
