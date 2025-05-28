import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import AddUser from "./AddUser";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import FeedbackForm from "./Components/FeedbackForm";
import ViewFeedback from "./Components/ViewFeedback";
import EventList from "./Components/EventList";
import EventForm from "./Components/EventForm";
import RoomBooking from "./Components/RoomBooking";
import GenSecDashboard from "./Components/GenSecDashboard";
import GenSecEndorse from "./Components/GenSecEndorse";
import PresidentApproval from "./Components/PresidentApproval";
import PresidentDashboard from "./Components/PresidentDashboard";
import { CreateTenure, ShowTenure } from "./Components/TenureRecords";
import { fetchCredentials } from "./services/auth";

export const AdminContext = createContext();

const genSecRoles = [
  { path: "cult", role: "Cultural" },
  { path: "sport", role: "Sports" },
  { path: "acad", role: "Academic" },
  { path: "tech", role: "SciTech" },
];

const ProtectedRoute = ({
  children,
  isAuthenticated,
  redirectTo = "/login",
}) => {
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

const PublicRoute = ({ children, isAuthenticated, redirectTo = "/" }) => {
  return !isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await fetchCredentials();
        setIsUserLoggedIn(user || false);
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
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/events" element={<EventList />} />
          <Route path="/viewfeedback" element={<ViewFeedback />} />

          {/* GenSec Dashboard routes - accessible to everyone for now */}
          {genSecRoles.map(({ path, role }) => (
            <Route
              key={`gensec-${path}`}
              path={`/gensec-${path}`}
              element={<GenSecDashboard role={role} />}
            />
          ))}

          {/* GenSec Endorse routes - accessible to everyone for now */}
          {genSecRoles.map(({ path, role }) => (
            <Route
              key={`gensec-${path}-endorse`}
              path={`/gensec-${path}-endorse`}
              element={
                <GenSecEndorse role={role === "SciTech" ? "Tech" : role} />
              }
            />
          ))}

          {/* President routes - accessible to everyone for now */}
          <Route path="/president-approval" element={<PresidentApproval />} />
          <Route path="/president-dashboard" element={<PresidentDashboard />} />

          {/* Room booking */}
          <Route path="/roombooking" element={<RoomBooking />} />

          {/* COSA routes */}
          <Route path="/cosa" element={<ShowTenure />} />
          <Route path="/cosa/create" element={<CreateTenure />} />
          <Route path="/cosa/:id" element={<ShowTenure />} />

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

          {/* Protected routes - only for authenticated users */}
          <Route
            path="/feedback"
            element={
              <ProtectedRoute isAuthenticated={isUserLoggedIn}>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-event"
            element={
              <ProtectedRoute isAuthenticated={isUserLoggedIn}>
                <EventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <ProtectedRoute isAuthenticated={isUserLoggedIn}>
                <AddUser />
              </ProtectedRoute>
            }
          />

          {/* Home route */}
          <Route
            path="/"
            element={
              isUserLoggedIn ? <Home /> : <Navigate to="/login" replace />
            }
          />

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
