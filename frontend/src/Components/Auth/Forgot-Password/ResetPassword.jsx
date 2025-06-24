import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/auth/reset-password/${id}/${token}`,
        );
        const data = await res.json();
        if (res.ok) {
          setIsTokenValid(true);
        }
        toast.info(data.message || "Token verification result.");
      } catch (error) {
        toast.error("Error verifying token.");
      }
    };
    verifyToken();
  }, [id, token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/reset-password/${id}/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.message ||
            "Password reset successful! Navigating to login page...",
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Error resetting password.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Reset Password
        </h2>

        {!isTokenValid ? (
          <p className="text-center text-gray-700">Verifying token...</p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ResetPassword;
