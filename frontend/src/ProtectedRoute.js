import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const ProtectedRoute = ({ children }) => {
  const { IsUserLoggedIn } = useContext(AdminContext);

  //   if (IsUserLoggedIn === null) {
  //     return <div>Loading...</div>;
  //   }

  if (!IsUserLoggedIn?._id) {
    console.log("User not logged in", IsUserLoggedIn);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
