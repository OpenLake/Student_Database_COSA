import "./App.css";
import Add from "./Add_User/Components/Add";
import Navbar from "../src/Components/Navbar";
import React from "react";
import Body from "./Components/Body";

function AddUser() {
  const [studentDetails, setStudentDetails] = React.useState();
  return (
    <div>
      {/* <Navbar setStudentDetails={setStudentDetails} /> */}
      {/* <Add /> */}
      <Body studentDetails={studentDetails} />
    </div>
  );
}

export default AddUser;
