// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth";
import { useAdminContext } from "../../context/AdminContext";
import {toast} from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsUserLoggedIn, setUserRole, isLoading, setIsLoading} = useAdminContext();
  useEffect(() => {
    const performLogout = async () => {
      try {
        const loggedOut = await logoutUser(); // server logout
        if(!loggedOut){
          toast.error("Server log out failed");
          return ;
        }
        
        setIsUserLoggedIn(null); // clear frontend session
        setUserRole("STUDENT"); // reset role
        toast.success("Logged out successfully");
        setTimeout(() => navigate("/"),1500); // redirect
      } catch (error) {
        console.error("Logout failed:", error);
      }finally{
        setIsLoading(false);
      }
    };

    performLogout();
  }, [setIsUserLoggedIn, setUserRole]);

  if(isLoading) return <p className="text-center mt-4">Logging out...</p>;
};

export default Logout;
