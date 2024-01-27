import React, { useContext } from "react";
import axios from "axios";
import { Button, Form, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import { AdminContext } from "../App";

function Navbar() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  return (
    <Row xs="2" className="bg-success p-2">
      <Col>
        <p className="text-light">User is authenticated</p>
      </Col>
      <Col>
        <Search IsUserLoggedIn={IsUserLoggedIn} />
      </Col>
      <Col>
        <a
          onClick={async (e) => {
            e.preventDefault();
            await axios.post(
              "http://localhost:8000/auth/logout",
              {},
              { withCredentials: true },
            );
            setIsUserLoggedIn(null);
          }}
          href="/logout"
        >
          Logout
        </a>
      </Col>
    </Row>
  );
}

export default Navbar;
