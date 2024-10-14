import "./App.css";
import Navbar from "../src/Components/Navbar";
import Footer from "./Components/Footer";
import React from "react";
import { useNavigate } from "react-router-dom";
import IssueCards from "./Add_User/Components/ReviewIssue";
import { AdminContext } from "./App";
import "./Add_User/Components/Add.css";

function Issues() {
  const { IsUserLoggedIn } = React.useContext(AdminContext);
  const [IssuesList, setIssuesList] = React.useState([]);
  const [studentDetails, setStudentDetails] = React.useState();
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/issues`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setIssuesList(data))
      .catch((error) => console.error("Error:", error));
  }, [IsUserLoggedIn]);

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar setStudentDetails={setStudentDetails} />
      <button onClick={navigateToHome} className={"Add_user"}>
        Home
      </button>
      {IssuesList && IssuesList.length > 0 ? (
        IssuesList.map((issue, index) => (
          <div key={index}>
            <IssueCards updatedDetails={issue} />
          </div>
        ))
      ) : (
        <p
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
          No issues
        </p>
      )}
      <Footer />
    </div>
  );
}

export default Issues;
