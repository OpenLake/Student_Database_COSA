import React, { useState, useContext, useEffect } from "react";
import { AdminContext } from "../../App";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import GoogleIcon from "@mui/icons-material/Google";
import { loginUser } from "../../services/auth";
import { fetchCredentials } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCredentials().then((User) => {
      if (User) {
        setIsUserLoggedIn(User);
        navigate("/", { replace: true });
      }
    });
  }, [setIsUserLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const status = await loginUser(email, password);
    if (status) {
      setIsUserLoggedIn(status);
      navigate("/", { replace: true });
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div
      className="auth-page min-h-screen flex sm:flex-row flex-col items-center justify-evenly bg-cover bg-center"
      style={{ backgroundImage: "url('/iit-bh.jpeg')" }}
    >
      {/* Logo and header */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/Logo_of_IIT_Bhilai.png"
          className="w-28 h-28 object-contain mb-4"
          alt="IIT Bhilai Logo"
        />
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-xl sm:text-3xl text-white text-center mt-1">
          Please sign in to your account
        </p>
      </div>

      <div className="w-full max-w-md px-4">
        {/* Glass effect card */}
        <div className="bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 md:p-10">
            {/* Login Form */}
            <Form onSubmit={handleSubmit}>
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
                <div className="flex justify-between items-center mb-1">
                  <Label
                    for="password"
                    className="block text-sm font-medium text-white"
                  >
                    Password
                  </Label>
                  <a
                    href="#forgot"
                    className="text-xs text-indigo-800 hover:text-indigo-900 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </FormGroup>

              {/* Sign in button */}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
              >
                Sign In
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white bg-opacity-90 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <a
                href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 mb-4"
              >
                <GoogleIcon className="w-5 h-5 mr-2 text-red-500" />
                <span>Sign in with Google</span>
              </a>

              {/* Register link */}
              <div className="text-center mt-4">
                <p className="text-sm text-white">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Register here
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </div>
  );
}

export default Login;
