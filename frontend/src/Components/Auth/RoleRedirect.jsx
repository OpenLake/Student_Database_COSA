import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const RoleRedirect = () => {
  const { userRole, isUserLoggedIn, isOnboardingComplete, isLoading } =
    useContext(AdminContext);

  if (isLoading) return <div>Loading...</div>;

  if (!isUserLoggedIn) {
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
