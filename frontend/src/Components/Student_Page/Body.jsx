import React, { useState, useContext, useEffect } from "react";
import Add from "../../Add_User/Components/Add";
import UserProfileButtons from "../../Add_User/Components/UserProfileButtons";
import Card from "../Card";
import { fetchStudent } from "../../services/utils";
import { ShowSkills, AddSkill } from "../ShowAddSkill";
import { AdminContext } from "../../App";
// import "./Body.css";

function Body({ studentDetails }) {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (isUserLoggedIn?.ID_No) {
      fetchStudent(isUserLoggedIn.ID_No).then((data) => {
        setUserDetails(data);
      });
    }
  }, [isUserLoggedIn]);

  const refreshUserDetails = () => {
    if (isUserLoggedIn?.ID_No) {
      fetchStudent(isUserLoggedIn.ID_No).then((data) => {
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
              isLoggedIn={!!isUserLoggedIn}
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
