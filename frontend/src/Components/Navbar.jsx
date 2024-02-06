import React, { useContext } from "react";
import { Button, Form, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";

function Navbar({ setStudentDetails }) {
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  return (
    <Row className="bg-success p-2">
      <Col xs="4" className="d-flex justify-content-start">
        <span style={{ color: "white", fontSize: "130%", marginLeft: "5px" }}>
          Student Database
        </span>
      </Col>
      <Col xs="4" className="d-flex justify-content-center">
        <Search setStudentDetails={setStudentDetails} />
      </Col>
      <Col xs="4" className="d-flex justify-content-end">
        <Button
          onClick={async (e) => {
            e.preventDefault();
            logoutUser();
            setIsUserLoggedIn(null);
            navigate("/login");
          }}
          href="/logout"
          color="danger"
        >
          Logout
        </Button>
      </Col>
    </Row>
  );
}

export default Navbar;
