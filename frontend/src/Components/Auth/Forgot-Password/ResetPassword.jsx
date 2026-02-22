import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../utils/api";
import cosa from "../../../assets/COSA.png";
import backgroundImage from "../../../assets/iitbh.jpg";

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
        const res = await api.get(`/auth/reset-password/${id}/${token}`);
        if (res.status === 200) {
          setIsTokenValid(true);
          toast.info(res.data.message || "Token verification result.");
        }
      } catch (error) {
        const message =
          error.response?.data?.message || "Error verifying token.";
        toast.error(message);
        setIsTokenValid(false);
      }
    };
    verifyToken();
  }, [id, token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${id}/${token}`, {
        password,
      });
      toast.success(
        res.data.message ||
          "Password reset successfully! Navigating to login page..."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Error resetting password.";
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
          onSubmit={handleReset}
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
            Reset Password
          </h2>
          <hr className="mb-6" />
          {!isTokenValid ? (
            <p className="text-center text-gray-700">Verifying token...</p>
          ) : (
            <>
              <label className="block text-sm mb-2 font-medium">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
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

export default ResetPassword;
