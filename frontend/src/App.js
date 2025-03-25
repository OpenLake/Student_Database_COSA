import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./AddUser";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import { fetchCredentials } from "./services/auth";
import FeedbackForm from "./Components/FeedbackForm";
import EventList from "./Components/EventList";
import EventForm from "./Components/EventForm";
import { CreateTenure, ShowTenure } from "./Components/TenureRecords";
import ProfilePage from "./pages/profile";
import { EditProfile } from "./Components/profile";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import President from "./pages/president";

const AdminContext = createContext();

function App() {
  const [IsUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredentials().then((User) => {
      if (User != null) {
        setIsUserLoggedIn(User);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/google/:id" element={<GoogleRegister />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/add-event" element={<EventForm />} />
          <Route path="/cosa/:id" element={<ShowTenure />} />
          <Route path="/cosa" element={<ShowTenure />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["student"]}>
                  <AddUser />
                </RoleBasedRoute>
                <RoleBasedRoute allowedRoles={["president"]}>
                  <President />
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
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminContext.Provider>
  );
}

export { AdminContext };
export default App;
