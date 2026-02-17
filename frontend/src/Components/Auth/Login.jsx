import React, { useState, useContext } from "react";
import { useAdminContext } from "../../context/AdminContext";
import { loginUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import cosa from "../../assets/COSA.png";
import backgroundImage from "../../assets/iitbh.jpg";
import { toast } from "react-toastify";

export default function Login() {
  const { handleLogin } = useAdminContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      //console.log(response);
      if (response.success) {
        handleLogin(response.data);
        toast.success("Login successful ");
        navigate("/onboarding", { replace: true });
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blur Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      />
      {/* Shade Overlay */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* Main container */}
      <div
        className="flex flex-wrap flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full max-w-7xl relative"
        style={{ zIndex: 2 }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl"
          style={{
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.15),
              0 10px 20px rgba(0, 0, 0, 0.1),
              0 4px 8px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <hr className="mb-6" />

          {/* Email */}
          <label className="block text-sm mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Password */}
          <label className="block text-sm mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <div className="flex justify-end mb-6">
            <a
              href="/forgot-password"
              className="text-xs text-[#24648B] hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md mb-4 font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:opacity-90"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center my-1">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Google Login */}
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
            className="block"
          >
            <button
              type="button"
              className="w-full bg-[#23659C] text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:opacity-90 font-medium"
            >
              <span>Sign in with Google</span>
              <GoogleIcon />
            </button>
          </a>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#23659C] hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </form>

        {/* CoSA Logo */}
        <div className="flex flex-col items-center text-white w-full max-w-xs mb-8 lg:mb-0">
          <img src={cosa} alt="CoSA Logo" className="w-52 h-52 mb-6" />
          <h1 className="text-2xl font-semibold">CoSA</h1>
        </div>
      </div>
    </div>
  );
}
