import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../utils/api";
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
          "This email is linked with Google. Please sign in with Google.",
        );
      } else if (res.status === 200) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
            style={{ borderRadius: "9999px" }}
            disabled={loading}
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
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ForgotPassword;
