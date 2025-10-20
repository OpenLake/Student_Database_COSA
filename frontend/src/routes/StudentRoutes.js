// src/routes/StudentRoutes.js
import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../Components/common/ProtectedRoute";
import FeedbackForm from "../Components/Feedback/FeedbackForm";
import AchievementForm from "../Components/Student/AddUserAchievements";
import ViewAchievements from "../Components/Student/ViewUserAchievements";
import ManagePositions from "../Components/ManagePosition";
import SkillManagement from "../Components/Student/UserSkillManagement";
import Logout from "../Components/Logout";
import Home from "../Components/Student/Home";
import StudentProfile from "../Components/Student/ProfilePage";
import AnnouncementPage from "../Components/Announcements/AnnouncementPage";
import CreateAnnouncement from "../Components/Announcements/Create-Announcement/CreateAnnouncement";

export const getStudentRoutes = (isUserLoggedIn, isOnboardingComplete) => [
  <Route
    key="feedback"
    path="/feedback"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <FeedbackForm />
      </ProtectedRoute>
    }
  />,
  <Route
    key="add-achievement"
    path="/add-achievement"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <AchievementForm />
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-achievements"
    path="/view-achievements"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <ViewAchievements />
      </ProtectedRoute>
    }
  />,
  <Route
    key="manage-position"
    path="/manage-position"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <ManagePositions />
      </ProtectedRoute>
    }
  />,
  <Route
    key="skills"
    path="/skills"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <SkillManagement />
      </ProtectedRoute>
    }
  />,
  <Route
    key="logout"
    path="/logout"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <Logout />
      </ProtectedRoute>
    }
  />,
  <Route
    key="home"
    path="/home"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <Home />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile"
    path="/profile"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <StudentProfile />
      </ProtectedRoute>
    }
  />,
  <Route
    key="announcement"
    path="/announcements"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <AnnouncementPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-announcement"
    path="/announcements/create-announcement"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <CreateAnnouncement />
      </ProtectedRoute>
    }
  />,
];
