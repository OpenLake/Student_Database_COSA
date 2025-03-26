import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const { IsUserLoggedIn } = useContext(AdminContext);

  // If user is not logged in, redirect to login
  if (!IsUserLoggedIn) {
    console.log("User not logged in", IsUserLoggedIn);
    return <Navigate to="/login" replace />;
  }

  // If render prop is provided, use it and pass the user data
  // If children is a function, pass the userRole as a prop
  if (typeof children === "function") {
    return children({ userRole: IsUserLoggedIn.role });
  }

  // Otherwise, render children as before
  return children;
};

export default ProtectedRoute;
