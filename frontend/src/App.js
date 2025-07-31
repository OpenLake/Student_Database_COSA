import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import FeedbackForm from "./Components/Feedback/FeedbackForm";
import ViewFeedback from "./Components/Feedback/ViewFeedback";
import EventList from "./Components/Events/EventList";
import EventForm from "./Components/Events/EventForm";
import EventDetail from "./Components/Events/EventDetail";
import RoomBooking from "./Components/RoomBooking";
import GenSecDashboard from "./Components/GenSec/GenSecDashboard";
import GenSecEndorse from "./Components/GenSec/GenSecEndorse";
import PresidentApproval from "./Components/President/PresidentApproval";
import PresidentDashboard from "./Components/President/PresidentDashboard";
import { CreateTenure, ViewTenure } from "./Components/Positions/TenureRecords";
import { fetchCredentials } from "./services/auth";
import Unauthorised from "./Components/Unauthorised";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";
import RoleRedirect from "./Components/Auth/RoleRedirect";
import OnboardingForm from "./Components/UserOnboarding";
import StudentProfile from "./Components/Student_Page/ProfilePage";
import ForgotPassword from "./Components/Auth/Forgot-Password/ForgotPassword";
import ResetPassword from "./Components/Auth/Forgot-Password/ResetPassword";

const ALL_ADMIN_ROLES = [
  "GENSEC_SCITECH",
  "GENSEC_ACADEMIC",
  "GENSEC_CULTURAL",
  "GENSEC_SPORTS",
  "PRESIDENT",
];

export const AdminContext = createContext();

const genSecRoles = [
  { path: "cult", role: "GENSEC_CULTURAL" },
  { path: "sport", role: "GENSEC_SPORTS" },
  { path: "acad", role: "GENSEC_ACADEMIC" },
  { path: "tech", role: "GENSEC_SCITECH" },
];

const ProtectedRoute = ({
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

const PublicRoute = ({ children, isAuthenticated, redirectTo = "/" }) => {
  return !isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("STUDENT");
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await fetchCredentials();
        //console.log("Fetched user:", user);
        if (user) {
          setIsUserLoggedIn(user);
          const role = user.role;
          setUserRole(role);
          console.log("User role:", role);
          console.log(user);
          if (role !== "STUDENT") {
            setIsOnboardingComplete(true);
          } else {
            setIsOnboardingComplete(user.onboardingComplete);
          }
        } else {
          setIsUserLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsUserLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  const contextValue = {
    isUserLoggedIn,
    setIsUserLoggedIn,
    userRole,
    setUserRole,
    isOnboardingComplete,
    setIsOnboardingComplete,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/viewfeedback" element={<ViewFeedback />} />

          {/* GenSec Dashboard routes - accessible to only respective Gensec */}
          {genSecRoles.map(({ path, role }) => (
            <Route
              key={`gensec-${path}`}
              path={`/gensec-${path}`}
              element={
                <RoleProtectedRoute allowedRoles={[role]}>
                  <GenSecDashboard role={role} />
                </RoleProtectedRoute>
              }
            />
          ))}

          {/* GenSec Endorse routes */}
          <Route
            path="/gensec-endorse"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
                <GenSecEndorse />
              </RoleProtectedRoute>
            }
          />
          {/* President routes - accessible to only president*/}
          <Route
            path="/president-approval"
            element={
              <RoleProtectedRoute allowedRoles={["PRESIDENT"]}>
                <PresidentApproval />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/president-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["PRESIDENT"]}>
                <PresidentDashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Room booking */}
          <Route
            path="/roombooking"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
                <RoomBooking />
              </RoleProtectedRoute>
            }
          />

          {/* COSA routes */}
          {/* <Route path="/cosa" element={<ShowTenure />} /> */}
          <Route
            path="/cosa/create"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
                <CreateTenure />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/cosa"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
                <ViewTenure />
              </RoleProtectedRoute>
            }
          />

          {/* Authentication routes - only for non-authenticated users */}
          <Route
            path="/login"
            element={
              <PublicRoute isAuthenticated={isUserLoggedIn}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute isAuthenticated={isUserLoggedIn}>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/register/google/:id" element={<GoogleRegister />} />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute isAuthenticated={isUserLoggedIn}>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:id/:token"
            element={
              <PublicRoute isAuthenticated={isUserLoggedIn}>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Protected routes - only for authenticated users */}
          <Route
            path="/feedback"
            element={
              <ProtectedRoute
                isAuthenticated={isUserLoggedIn}
                isOnboardingComplete={isOnboardingComplete}
              >
                <FeedbackForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-event"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
                <EventForm />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              isUserLoggedIn && !isOnboardingComplete ? (
                <OnboardingForm />
              ) : isUserLoggedIn ? (
                <RoleRedirect />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              isUserLoggedIn ? (
                <RoleRedirect />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                isAuthenticated={isUserLoggedIn}
                isOnboardingComplete={isOnboardingComplete}
              >
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorised" element={<Unauthorised />} />
          {/* Catch-all route */}
          <Route
            path="*"
            element={<Navigate to={isUserLoggedIn ? "/" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </AdminContext.Provider>
  );
}

// export { AdminContext };
export default App;
