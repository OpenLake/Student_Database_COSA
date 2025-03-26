import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/dashboard/student-dashboard";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import { fetchCredentials } from "./services/auth";
import FeedbackForm from "./Components/FeedbackForm";
import EventList from "./Components/EventList";
import EventForm from "./Components/EventForm";
import { CreateTenure, ShowTenure } from "./Components/TenureRecords";
import ProfilePage from "./pages/profile";
import ProtectedRoute from "./route/ProtectedRoute";
import RoleBasedRoute from "./route/RoleBasedRoute";

import RoomBooking from "./Components/RoomBooking";
import PresidentApproval from "./Components/PresidentApproval";
import PresidentDashboard from "./pages/dashboard/PresidentDashboard";
import GenSecTechPage from "./Components/GenSecTechPage";
import GensecSciTechDashboard from "./pages/dashboard/GensecSciTechDashboard";
import ViewFeedback from "./Components/ViewFeedback";

import GensecAcadDashboard from "./pages/dashboard/GenSecAcad";
import GenSecAcadPage from "./Components/GenSecAcadPage";
import GenSecSportsPage from "./Components/GenSecSportsPage";
import GensecSportsDashboard from "./pages/dashboard/GenSecSports";
import GenSecCultPage from "./Components/GenSecCultPage";
import GensecCultDashboard from "./pages/dashboard/GenSecCult";

const AdminContext = createContext();

function App() {
  const [IsUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchCredentials().then((User) => {
  //     if (User != null) {
  //       setIsUserLoggedIn(User);
  //     }
  //     setLoading(false);
  //   });
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="loading-container" style={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       height: '100vh',
  //       background: '#f5f5f5'
  //     }}>
  //       <div className="spinner" style={{
  //         width: '50px',
  //         height: '50px',
  //         border: '5px solid rgba(0, 0, 0, 0.1)',
  //         borderTopColor: '#007bff',
  //         borderRadius: '50%',
  //         animation: 'spin 1s linear infinite'
  //       }}></div>
  //       <style>{`
  //         @keyframes spin {
  //           to { transform: rotate(360deg); }
  //         }
  //       `}</style>
  //       <p style={{
  //         marginTop: '20px',
  //         fontSize: '18px',
  //         color: '#333',
  //         fontWeight: '500'
  //       }}>Loading application...</p>
  //     </div>
  //   );
  // }

  return (
    <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/google/:id" element={<GoogleRegister />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/cosa/:id" element={<ShowTenure />} />
          <Route path="/cosa" element={<ShowTenure />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {({ userRole }) => {
                  if (userRole === "student") return <StudentDashboard />;
                  if (userRole === "president") return <PresidentDashboard />;
                  if (userRole === "gensec-scitech")
                    return <GensecSciTechDashboard />;
                  if (userRole === "gensec-acad")
                    return <GensecAcadDashboard />;
                  if (userRole === "gensec-sports")
                    return <GensecSportsDashboard />;
                  if (userRole === "gensec-cult")
                    return <GensecCultDashboard />;
                  return <Navigate to="/login" replace />;
                }}
              </ProtectedRoute>
            }
          />

          {/* President routes */}
          <Route
            path="/president-approval"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["president"]}>
                  <PresidentApproval />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cosa/create"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["president"]}>
                  <CreateTenure />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* GenSec Tech routes */}
          <Route
            path="/gensectech-endorse"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["gensec-scitech"]}>
                  <GenSecTechPage />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* GenSec Acad routes */}
          <Route
            path="/gensecacad-endorse"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["gensec-acad"]}>
                  <GenSecAcadPage />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          {/* GenSec Sports routes */}
          <Route
            path="/gensecsport-endorse"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["gensec-sports"]}>
                  <GenSecSportsPage />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* GenSec Cult routes */}
          <Route
            path="/genseccult-endorse"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["gensec-cult"]}>
                  <GenSecCultPage />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          {/* User routes */}
          <Route
            path="/add-event"
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  allowedRoles={[
                    "gensec-sports",
                    "gensec-cult",
                    "gensec-acad",
                    "gensec-scitech",
                    "president",
                  ]}
                >
                  <EventForm />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roombooking"
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  allowedRoles={[
                    "gensec-sports",
                    "gensec-cult",
                    "gensec-acad",
                    "gensec-scitech",
                    "president",
                  ]}
                >
                  <RoomBooking />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewfeedback"
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  allowedRoles={[
                    "gensec-sports",
                    "gensec-cult",
                    "gensec-acad",
                    "gensec-scitech",
                    "president",
                  ]}
                >
                  <ViewFeedback />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["student"]}>
                  <ProfilePage />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminContext.Provider>
  );
}

export { AdminContext };
export default App;
