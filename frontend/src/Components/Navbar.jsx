import React, { useContext } from "react";
import {
  Button,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";
import { FaBell, FaUserCircle } from "react-icons/fa"; // Add icons

function Navbar({ setStudentDetails }) {
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logoutUser();
    setIsUserLoggedIn(null);
    navigate("/login");
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Row className="bg-success p-2">
      <Col xs="4" className="d-flex justify-content-start">
        <span
          className="text-white font-weight-bold"
          style={{ fontSize: "130%", marginLeft: "5px" }}
        >
          Student Database
        </span>
      </Col>
      <Col xs="4" className="d-flex justify-content-center">
        <Search setStudentDetails={setStudentDetails} />
      </Col>
      <Col xs="4" className="d-flex justify-content-end align-items-center">
        <FaBell className="text-white mx-2" />
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle caret className="text-white">
            <FaUserCircle />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            {/* Add more dropdown items as needed */}
          </DropdownMenu>
        </Dropdown>
      </Col>
    </Row>
  );
}

export default Navbar;
