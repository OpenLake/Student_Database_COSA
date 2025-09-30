import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../utils/api";
import cosa from "../../../assets/COSA.png";
import backgroundImage from "../../../assets/iitbh.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });

      if (res.status === 400 && res.data.message?.includes("Google Login")) {
        toast.error(
          "This email is linked with Google. Please sign in with Google."
        );
      } else if (res.status === 200) {
        console.log("Triggering toast.success");
        toast.success(res.data.message || "Reset link sent successfully!");
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      toast.error(message);
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
          <h2 className="text-2xl font-bold text-center mb-6">
            Forgot Password
          </h2>
          <hr className="mb-6" />
          <label className="block text-sm mb-2 font-medium">
            Registered Email
          </label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
          />
          <button
            type="submit"
            className={`w-full py-2 rounded-xl font-medium flex items-center justify-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:opacity-90"
            }`}
            disabled={loading}
            style={{ borderRadius: "9999px" }}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : null}
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {/* CoSA Logo */}
        <div className="flex flex-col items-center text-white w-full max-w-xs mb-8 lg:mb-0">
          <img src={cosa} alt="CoSA Logo" className="w-52 h-52 mb-6" />
          <h1 className="text-2xl font-semibold">CoSA</h1>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
