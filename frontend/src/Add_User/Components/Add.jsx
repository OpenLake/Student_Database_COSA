import { useNavigate } from "react-router-dom";
import "./Add.css";
import React, { useState } from "react";
import { Modal } from "reactstrap";
import Card from "./Card"; // Import the Card component

function Add() {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const navigate = useNavigate();

  const toggleCardVisibility = () => {
    setIsCardVisible((prevState) => !prevState);
  };

  const navigateToIssues = () => {
    navigate("/issues");
  };

  return (
    <div style={{ textAlign: "center", margin: "10px" }}>
      <button onClick={toggleCardVisibility} className={"Add_user"}>
        Add User
      </button>
      <button onClick={navigateToIssues} className={"Add_user"}>
        Issues
      </button>
      <Modal isOpen={isCardVisible} toggle={toggleCardVisibility} size={"lg"}>
        <Card />
      </Modal>
    </div>
  );
}

export default Add;
