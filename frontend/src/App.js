// src/App.js - Refactored
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminContext } from "./context/AdminContext";
import { useAuth } from "./hooks/useAuth";
import LoadingScreen from "./Components/common/LoadingScreen";
import { getPublicRoutes } from "./routes/PublicRoutes";
import { getAdminRoutes } from "./routes/AdminRoutes";
import { getStudentRoutes } from "./routes/StudentRoutes";
import OnboardingForm from "./Components/UserOnboarding";
import RoleRedirect from "./Components/Auth/RoleRedirect";
import Unauthorised from "./Components/Unauthorised";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const authData = useAuth();
  const { isUserLoggedIn, isOnboardingComplete, isLoading } = authData;

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AdminContext.Provider value={authData}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            {getPublicRoutes(isUserLoggedIn)}

            {/* Admin Routes */}
            {getAdminRoutes()}

            {/* Student Routes */}
            {getStudentRoutes(isUserLoggedIn, isOnboardingComplete)}

            {/* Special Routes */}
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/onboarding" element={<OnboardingForm />} />
            <Route path="/unauthorised" element={<Unauthorised />} />

            {/* Catch-all route */}
            <Route
              path="*"
              element={
                <Navigate to={isUserLoggedIn ? "/" : "/login"} replace />
              }
            />
          </Routes>
        </BrowserRouter>
      </AdminContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }} // Add this
        toastStyle={{ zIndex: 9999 }} // And this
      />
    </>
  );
}

export default App;
