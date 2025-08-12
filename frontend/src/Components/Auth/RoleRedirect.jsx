import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../../App.js";

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

  switch (userRole) {
    case "PRESIDENT":
      return <Navigate to="/president-dashboard" replace />;
    case "GENSEC_SCITECH":
      return <Navigate to="/gensec-tech" replace />;
    case "GENSEC_ACADEMIC":
      return <Navigate to="/gensec-acad" replace />;
    case "GENSEC_CULTURAL":
      return <Navigate to="/gensec-cult" replace />;
    case "GENSEC_SPORTS":
      return <Navigate to="/gensec-sport" replace />;
    case "CLUB_COORDINATOR":
      return <Navigate to="/club-dashboard" replace />;
    default:
      return <Navigate to="/home" replace />; // fallback for student
  }
};

export default RoleRedirect;
