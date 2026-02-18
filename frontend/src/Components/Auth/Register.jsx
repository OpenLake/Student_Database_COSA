import GoogleIcon from "@mui/icons-material/Google";
import cosa from "../../assets/COSA.png";
import backgroundImage from "../../assets/iitbh.jpg";
import {Link, useNavigate} from "react-router-dom"
import { useState } from "react";
import { registerUser } from "../../services/auth";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: ""
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("/");
  function handleChange(e){
    const {name, value} = e.target;
    setForm((prev)=> ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
          const response = await registerUser(form.username, form.password, form.name);
          // success response is the full axios response
          if (response && response.status === 200 && response.data && response.data.success) {
            toast.success(response.data.message || "Registration successful");
            setTimeout(()=>{
              navigate("/login", { replace: true });
            },1500)
            return;
          }

          // handle errors returned from server
          let errorMessage = "";
          const respData = response && response.data;
          if (respData) {
            const msg = respData.message;
            if (Array.isArray(msg)) {
              errorMessage = msg.join(". ");
            } else if (typeof msg === "string") {
              errorMessage = msg;
            } else if (msg && msg.message) {
              errorMessage = msg.message;
            }
          } else if (response && response.status) {
            errorMessage = response.statusText;
          }
          toast.error(errorMessage);
    } catch (error) {
          console.error("Registration failed:", error);
           toast.error("Registration failed. Please try again.");
    }finally {
          setLoading(false);
    }
  }
  
  
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
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <hr className="mb-6" />

          {/* Username */}
          <label className="block text-sm mb-2 font-medium">Username</label>
          <input
            type="email"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Password */}
          <label className="block text-sm mb-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Name */}
          <label className="block text-sm mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          
          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md mb-4 font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:opacity-90"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="flex items-center my-1">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Google Register */}
          {/*
          <Link
            to={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
            className="block"
          >
            <button
              type="button"
              className="w-full bg-[#23659C] text-white py-3 rounded-md flex items-center justify-center space-x-2 hover:opacity-90 font-medium transition-all"
            >
              <span>Sign up with Google</span>
              <GoogleIcon />
            </button>
          </Link>
          */}
          <button
            type="button"
            className="w-full bg-[#23659C] text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:opacity-90 font-medium transition-all"
            onClick= {()=>{
              window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
            }}
          >
              <span>Sign up with Google</span>
              <GoogleIcon />
          </button>
          


          <p className="text-center text-sm mt-6 p-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#23659C] hover:underline font-medium"
            >
              Login
            </Link>
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
