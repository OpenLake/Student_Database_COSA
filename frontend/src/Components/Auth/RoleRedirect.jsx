import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../../App.js";
import Home from "../Student_Page/Home.js";
const RoleRedirect = () => {
  const { userRole } = useContext(AdminContext);
  const { isOnboardingComplete } = useContext(AdminContext);
  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />;
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
    default:
      return <Home />; // fallback for student
  }
};

export default RoleRedirect;
// This component checks the user's role and redirects them to the appropriate dashboard.
