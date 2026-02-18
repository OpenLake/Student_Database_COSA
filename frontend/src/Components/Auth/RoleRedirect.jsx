import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAdminContext } from "../../context/AdminContext";

const RoleRedirect = () => {
  const { userRole, isUserLoggedIn, isOnboardingComplete, isLoading } =
    useAdminContext();
  if (isLoading) return <div>Loading...</div>;

  if (Object.keys(isUserLoggedIn).length === 0) {  
    return <Navigate to="/login" replace />;
  }

  if (isOnboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!userRole) {
    return <div>Loading user role...</div>; // Or just return null for a blank screen
  }
  return <Navigate to="/dashboard" replace />;
};

export default RoleRedirect;
