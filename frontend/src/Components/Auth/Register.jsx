import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { registerUser } from "../../services/auth";
import isIITBhilaiEmail from "../../utils/emailValidator";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import cosa from "../../assets/COSA.png";
import backgroundImage from "../../assets/iitbh.jpg";
import { toast } from "react-toastify";
import LoadingSpinner from '../common/LoadingScreen'
export default function Register() {
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const [name, setName] = useState("");
  const [ID, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isIITBhilaiEmail(email)) {
      toast.error("Please use an @iitbhilai.ac.in email address.");
      setLoading(false);
      return;
    }

    try {
      const status = await registerUser(name, ID, email, password);
      if (status) {
        setIsUserLoggedIn(true);
        toast.success("Registration successful! 🎉");
        navigate("/", { replace: true });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Register failed:", error);
      toast.error("Something went wrong. Please try again.");
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
        <div>
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
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            <hr className="mb-6" />

            {/* Name */}
            <label className="block text-sm mb-2 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            {/* ID */}
            <label className="block text-sm mb-2 font-medium">ID</label>
            <input
              type="number"
              value={ID}
              onChange={(e) => setId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            {/* Email */}
            <label className="block text-sm mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            {/* Password */}
            <label className="block text-sm mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md mb-3 font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:opacity-90"
              }`}
            >
              {loading ? <LoadingSpinner size='sm' fullscreen={false}/>: "Register"}
            </button>

            <div className="flex items-center my-1">
              <hr className="flex-1 border-gray-300" />
              <span className="mx-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Google Register */}
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
              className="block"
            >
              <button
                type="button"
                className="w-full bg-[#23659C] text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:opacity-90 font-medium"
              >
                <span>Sign up with Google</span>
                <GoogleIcon />
              </button>
            </a>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#23659C] hover:underline font-medium"
              >
                Login
              </a>
            </p>
          </form>
        </div>

        {/* CoSA Logo outside form */}
        <div className="flex flex-col items-center text-white w-full max-w-xs mb-8 lg:mb-0">
          <img src={cosa} alt="CoSA Logo" className="w-52 h-52 mb-6" />
          <h1 className="text-2xl font-semibold">CoSA</h1>
        </div>
      </div>
    </div>
  );
}
