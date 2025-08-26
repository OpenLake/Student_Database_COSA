import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import GoogleIcon from "@mui/icons-material/Google";
import { loginUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
function Login() {
  const { handleLogin } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userObject = await loginUser(email, password);
      if (userObject) {
        handleLogin(userObject);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
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
            <h2>Login</h2>
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
          <div className="d-flex justify-content-end mt-2">
            <a
              href="/forgot-password"
              style={{
                fontSize: "0.9rem",
                textDecoration: "none",
                color: "#007bff",
              }}
            >
              {" "}
              Forgot Password?{" "}
            </a>
          </div>
          <FormGroup className="text-center">
            <Button type="submit" style={{ width: "100%" }} color="success">
              Login
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
            <a href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}>
              <Button type="button" style={{ width: "100%" }} color="primary">
                Sign in with Google <GoogleIcon />
              </Button>
            </a>
          </FormGroup>
          <FormGroup className="text-center">
            <Label>
              Don't have an Account? <a href="/register">Register</a>
            </Label>
          </FormGroup>
        </Form>
      </Container>
    </Container>
  );
}

export default Login;
