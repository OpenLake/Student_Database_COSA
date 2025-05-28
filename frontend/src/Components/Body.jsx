import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Add from "../Add_User/Components/Add";
import UserProfileButtons from "../Add_User/Components/UserProfileButtons";
import Card from "../Components/Card";
import { fetchStudent } from "../services/utils";
import { ShowSkills, AddSkill } from "./ShowAddSkill";
import { AdminContext } from "../App";
// import "./Body.css";

function Body({ studentDetails }) {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState(null);

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

  return (
    <div className="body-container">
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
    </div>
  );
}

export default Body;
