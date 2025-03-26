import React, { useState, useContext } from "react";
import { AdminContext } from "../../App";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import GoogleIcon from "@mui/icons-material/Google";
import { registerUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [ID, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const status = await registerUser(name, ID, email, password);
    if (status) {
      setIsUserLoggedIn(true);
      navigate("/", { replace: true });
    }
  };

  return (
    <div
      className="auth-page min-h-screen flex flex-col sm:flex-row items-center justify-evenly bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/iit-bh.jpeg')" }}
    >
      {/* Logo and header */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/Logo_of_IIT_Bhilai.png"
          className="w-28 h-28 object-contain mb-3"
          alt="IIT Bhilai Logo"
        />
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-xl sm:text-3xl text-white text-center mt-1">
          Join the IIT Bhilai community
        </p>
      </div>

      <div className="w-full max-w-md px-4">
        {/* Glass effect card */}
        <div className="bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 md:p-10">
            {/* Registration Form */}
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-4">
                <Label
                  for="name"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </FormGroup>

              <FormGroup className="mb-4">
                <Label
                  for="ID"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Student ID
                </Label>
                <Input
                  type="number"
                  name="ID"
                  id="ID_No"
                  placeholder="Enter your student ID"
                  value={ID}
                  onChange={(e) => setId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </FormGroup>

              <FormGroup className="mb-4">
                <Label
                  for="email"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </FormGroup>

              <FormGroup className="mb-6">
                <Label
                  for="password"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Create Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-white">
                  Must be at least 8 characters
                </p>
              </FormGroup>

              {/* Register button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4"
              >
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white bg-opacity-90 text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Google Sign Up */}
              <a
                href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 mb-4"
              >
                <GoogleIcon className="w-5 h-5 mr-2 text-red-500" />
                <span>Sign up with Google</span>
              </a>

              {/* Login link */}
              <div className="text-center mt-4">
                <p className="text-sm text-white">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </Form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-xs mt-6">
          © {new Date().getFullYear()} Council of Student Affairs, IIT Bhilai.
          All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Register;
