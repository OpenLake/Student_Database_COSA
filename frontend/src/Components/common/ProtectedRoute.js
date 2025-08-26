import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  children,
  isAuthenticated,
  isOnboardingComplete,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isOnboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

export const PublicRoute = ({
  children,
  isAuthenticated,
  redirectTo = "/",
}) => {
  return !isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};
