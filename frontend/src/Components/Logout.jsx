// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth";
import { AdminContext } from "../context/AdminContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsUserLoggedIn, setUserRole } = React.useContext(AdminContext);
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutUser(); // server logout
        setIsUserLoggedIn(null); // clear frontend session
        setUserRole("STUDENT"); // reset role
        navigate("/login"); // redirect
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    performLogout();
  }, [navigate, setIsUserLoggedIn, setUserRole]);

  return <p className="text-center mt-4">Logging out...</p>;
};

export default Logout;
