import "./App.css";
import Add from "./Add_User/Components/Add";
import Navbar from "../src/Components/Navbar";
import React from "react";
import Body from "./Components/Body";
import { AdminContext } from "./App";

function AddUser() {
  const { IsUserLoggedIn } = React.useContext(AdminContext);
  const [studentDetails, setStudentDetails] = React.useState();
  return (
    <div>
      <Navbar setStudentDetails={setStudentDetails} />
      {IsUserLoggedIn.role === "user" ? null : <Add />}
      <Body studentDetails={studentDetails} />
    </div>
  );
}

export default AddUser;
