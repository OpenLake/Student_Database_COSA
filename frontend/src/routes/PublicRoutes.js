import React from "react";
import { Route } from "react-router-dom";
import { PublicRoute } from "../Components/common/ProtectedRoute";
import EventList from "../Components/Events/EventList";
import EventDetail from "../Components/Events/EventDetail";
import ViewFeedback from "../Components/Feedback/ViewFeedback";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import ForgotPassword from "../Components/Auth/Forgot-Password/ForgotPassword";
import ResetPassword from "../Components/Auth/Forgot-Password/ResetPassword";
import AnnouncementPage from "../Components/Announcements/AnnouncementPage";
import CreateAnnouncement from "../Components/Announcements/Create-Announcement/CreateAnnouncement";

export const getPublicRoutes = (isUserLoggedIn) => [
  // Public routes accessible to everyone
  <Route key="events" path="/events" element={<EventList />} />,
  <Route key="event-detail" path="/events/:id" element={<EventDetail />} />,
  <Route key="view-feedback" path="/viewfeedback" element={<ViewFeedback />} />,
  <Route
    key="announcement"
    path="/announcements"
    element={<AnnouncementPage />}
  />,
  <Route
    key="create-announcement"
    path="/announcements/create-announcement"
    element={<CreateAnnouncement />}
  />,

  // Authentication routes - only for non-authenticated users
  <Route
    key="login"
    path="/login"
    element={
      <PublicRoute isAuthenticated={isUserLoggedIn}>
        <Login />
      </PublicRoute>
    }
  />,
  <Route
    key="register"
    path="/register"
    element={
      <PublicRoute isAuthenticated={isUserLoggedIn}>
        <Register />
      </PublicRoute>
    }
  />,
  <Route
    key="forgot-password"
    path="/forgot-password"
    element={
      <PublicRoute isAuthenticated={isUserLoggedIn}>
        <ForgotPassword />
      </PublicRoute>
    }
  />,
  <Route
    key="reset-password"
    path="/reset-password/:id/:token"
    element={
      <PublicRoute isAuthenticated={isUserLoggedIn}>
        <ResetPassword />
      </PublicRoute>
    }
  />,
];
