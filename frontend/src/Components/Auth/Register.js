import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import GoogleIcon from "@mui/icons-material/Google";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <img
        src="Logo_of_IIT_Bhilai.png"
        width={100}
        alt="IIT-Bhilai-Logo"
        style={{ position: "relative", bottom: 20 }}
      />
      <Container className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit} style={{ width: "30%" }}>
          <FormGroup className="text-center">
            <h2>Register</h2>
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="text-center">
            <Button type="submit" style={{ width: "100%" }} color="success">
              Register
            </Button>
          </FormGroup>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <hr style={{ width: "40%" }} />
            <p style={{ margin: "0 10px" }}>OR</p>
            <hr style={{ width: "40%" }} />
          </div>
          <FormGroup className="text-center">
            <Button type="submit" style={{ width: "100%" }} color="primary">
              Sign in with Google <GoogleIcon />
            </Button>
          </FormGroup>
          <FormGroup className="text-center">
            <Label>
              Already have an Account? <a href="/login">Login</a>
            </Label>
          </FormGroup>
        </Form>
      </Container>
    </Container>
  );
}

export default Register;
