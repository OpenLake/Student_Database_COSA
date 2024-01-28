import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Container } from "reactstrap";
import { registerStudentId } from "../../services/auth";

function GoogleRegister() {
  const { id } = useParams();
  const [ID_No, setId] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const status = await registerStudentId(id, ID_No);
    if (status) {
      navigate("/");
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <img
        src="/Logo_of_IIT_Bhilai.png"
        width={100}
        alt="IIT-Bhilai-Logo"
        style={{ position: "relative", bottom: 20 }}
      />
      <Container className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit} style={{ width: "30%" }}>
          <FormGroup className="text-center">
            <h2>Complete Registration</h2>
          </FormGroup>
          <FormGroup style={{ paddingTop: 15 }}>
            <Input
              type="number"
              name="ID"
              id="ID_No"
              placeholder="Student ID"
              value={ID_No}
              onChange={(e) => setId(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="text-center">
            <Button type="submit" style={{ width: "100%" }} color="success">
              Register
            </Button>
          </FormGroup>
        </Form>
      </Container>
    </Container>
  );
}

export default GoogleRegister;
