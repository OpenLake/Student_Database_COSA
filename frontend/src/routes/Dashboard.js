import { Route } from "react-router-dom";
import { ProtectedRoute } from "../Components/common/ProtectedRoute";
import Dashboard from "../Components/Dashboard/Dashboard";

export const getDashboardRoutes = (isUserLoggedIn, isOnboardingComplete) => [
<Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <Dashboard/>
      </ProtectedRoute>
    }
  />,
];
