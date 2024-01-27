import "./App.css";
import Add from "./Add_User/Components/Add";
import Navbar from "../src/Components/Navbar";
import React from "react";

function AddUser() {
  return (
    <div>
      <Navbar />

      <Add />
    </div>
  );
}

export default AddUser;
