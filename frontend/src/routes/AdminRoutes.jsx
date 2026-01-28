// src/routes/AdminRoutes.js
import React from "react";
import { Route } from "react-router-dom";
import RoleProtectedRoute from "../utils/RoleProtectedRoute";
import { ALL_ADMIN_ROLES, genSecRoles } from "../constants/roles";
import GenSecDashboard from "../Components/GenSec/GenSecDashboard";
import GenSecEndorse from "../Components/GenSec/GenSecEndorse";
import PresidentApproval from "../Components/President/PresidentApproval";
import PresidentDashboard from "../Components/President/PresidentDashboard";
import RoomBooking from "../Components/RoomBooking";
import {
  CreateTenure,
  ViewTenure,
} from "../Components/Positions/TenureRecords";
import CreateOrgUnit from "../Components/organization/CreateOrgUnit";
import EventForm from "../Components/Events/EventForm";
import ClubDashboard from "../Components/OldComponents/ClubCoorinatorDashboard";

export const getAdminRoutes = () => [
  // GenSec Dashboard routes
  ...genSecRoles.map(({ path, role }) => (
    <Route
      key={`gensec-${path}`}
      path={`/gensec-${path}`}
      element={
        <RoleProtectedRoute allowedRoles={[role]}>
          <GenSecDashboard role={role} />
        </RoleProtectedRoute>
      }
    />
  )),

  // GenSec Endorse routes
  <Route
    key="gensec-endorse"
    path="/gensec-endorse"
    element={
      <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
        <GenSecEndorse />
      </RoleProtectedRoute>
    }
  />,

  // Club Coordinator routes
  <Route
    key="club-dashboard"
    path="/club-dashboard"
    element={
      <RoleProtectedRoute allowedRoles={["CLUB_COORDINATOR"]}>
        <ClubDashboard />
      </RoleProtectedRoute>
    }
  />,

  // President routes
  <Route
    key="president-approval"
    path="/president-approval"
    element={
      <RoleProtectedRoute allowedRoles={["PRESIDENT"]}>
        <PresidentApproval />
      </RoleProtectedRoute>
    }
  />,
  <Route
    key="president-dashboard"
    path="/president-dashboard"
    element={
      <RoleProtectedRoute allowedRoles={["PRESIDENT"]}>
        <PresidentDashboard />
      </RoleProtectedRoute>
    }
  />,

  // Room booking
  <Route
    key="room-booking"
    path="/roombooking"
    element={
      <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
        <RoomBooking />
      </RoleProtectedRoute>
    }
  />,

  // COSA routes
  <Route
    key="cosa-create"
    path="/cosa/create"
    element={
      <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
        <CreateTenure />
      </RoleProtectedRoute>
    }
  />,
  <Route
    key="cosa-view"
    path="/cosa"
    element={
      <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
        <ViewTenure />
      </RoleProtectedRoute>
    }
  />,
  <Route
    key="create-org-unit"
    path="/create-org-unit"
    element={
      <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
        <CreateOrgUnit />
      </RoleProtectedRoute>
    }
  />,
  <Route
    key="add-event"
    path="/add-event"
    element={
      <RoleProtectedRoute allowedRoles={ALL_ADMIN_ROLES}>
        <EventForm />
      </RoleProtectedRoute>
    }
  />,
];
