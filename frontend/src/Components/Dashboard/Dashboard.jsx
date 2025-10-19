import React, { useState, useEffect } from "react";
import { NavbarConfig } from "../../config/navbarConfig";
import { DashboardComponents } from "../../config/dashboardComponents";
import api from "../../utils/api";
import LeftColumn from "./QuickStats";
import { AdminContext } from "../../context/AdminContext";
import Layout from "../common/Layout";
import { SidebarProvider, useSidebar } from "../../hooks/useSidebar";
import Home from "./Home";

function Content() {
  const { selected: selectedRoute } = useSidebar();
  const ActiveComponent =
    DashboardComponents[selectedRoute] || (() => <div>Home</div>);
  return <ActiveComponent />;
}
// Main component that provides the sidebar context
export default function RoleBasedDashboard() {
  const { isUserLoggedIn } = React.useContext(AdminContext);

  if (!isUserLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Loading Dashboard.....
          </h2>
        </div>
      </div>
    );
  }

  const role = isUserLoggedIn?.role || "STUDENT";
  const navItems = NavbarConfig[role] || [];

  return (
    <SidebarProvider role={role} navItems={navItems}>
      <Content />
      {/* <ActiveComponent /> */}
      {/* <DashboardContent /> */}
    </SidebarProvider>
  );
}
