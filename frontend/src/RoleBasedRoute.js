import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { IsUserLoggedIn } = useContext(AdminContext);

  if (!allowedRoles.includes(IsUserLoggedIn.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
