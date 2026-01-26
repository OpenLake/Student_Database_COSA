// src/routes/StudentRoutes.js
import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../Components/common/ProtectedRoute";
import FeedbackForm from "../Components/Feedback/FeedbackForm";
import AchievementForm from "../Components/Achievements/AchievementForm";
import ViewAchievements from "../Components/Achievements/ViewAchievements";
import ManagePositions from "../Components/ManagePosition";
import SkillManagement from "../Components/Skills/SkillManagement";
import Logout from "../Components/Logout";
import Home from "../Components/OldComponents/Home";
import StudentProfile from "../Components/Profile/ProfilePage";
import TenurePage from "../pages/TenurePage";

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
    key="tenure"
    path="/tenure"
    element={
      <ProtectedRoute
        isAuthenticated={isUserLoggedIn}
        isOnboardingComplete={isOnboardingComplete}
      >
        <TenurePage />
      </ProtectedRoute>
    }
  />,
];
