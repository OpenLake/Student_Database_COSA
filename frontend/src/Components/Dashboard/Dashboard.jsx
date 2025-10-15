import React, { useState, useEffect } from "react";
import { NavbarConfig } from "../../config/navbarConfig";
import { DashboardComponents } from "../../config/dashboardComponents";
import Logout from "../Logout";
import logo from "../../assets/COSA.png"
import api from "../../utils/api";
import UpdatesCard from "./Cards/Common/LatestUpdatesCard";
import LeftColumn from "./LeftColumn";


const Navbar = ({ role, navItems, selected, setSelected, showLogout, setShowLogout }) => (
  <div className="fixed top-0 left-0 z-50 flex items-center justify-between w-full p-3 border-b border-black/10 bg-white/90 ">
    <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white font-bold">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="font-poppins font-semibold text-[28px] leading-[100%] tracking-[0%] text-slate-900">CoSA</div>
      </div>

      <div className="flex-1 flex justify-center gap-0 bg-white p-0 rounded-full">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setSelected(item.key)}
            className={`flex items-center text-sm px-3 py-2 transition-all duration-200 ${
            selected === item.key
            ? "bg-black/80 text-white gap-1"
            : "bg-transparent hover:bg-gray-200 text-black gap-2"
           }`}
           style={{
            borderRadius: selected === item.key ? "9999px" : "0.75rem", 
         }}
         >
        <item.icon size={16} />
        <span>{item.label}</span>
      </button>
      
              ))}
            </div>

    <div className="flex items-center gap-3">
       {!showLogout ? (
        <button
          onClick={() => setShowLogout(true)}
          className="px-3 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-800"
          style={{
            borderRadius: "0.75rem", 
         }}
        >
          Logout
        </button>
      ) : (
        <Logout />
      )}
    </div>
  </div>
);

export default function RoleBasedDashboard() {
  const [role, setRole] = useState("STUDENT");
  const navItems = NavbarConfig[role];
  const [selectedRoute, setSelectedRoute] = useState(navItems[0].key);
  const ActiveComponent = DashboardComponents[selectedRoute] || (() => <div>Home</div>);
  const [showLogout, setShowLogout] = useState(false);
  const [updates, setUpdates] = useState([]);

   useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const response = await api.get('/api/events/latest'); 
        setUpdates(response.data);
      } catch (error) {
        console.error("Failed to fetch updates:", error);
      }
    };

    fetchLatestUpdates();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFAE2]">
      <Navbar role={role} navItems={navItems} selected={selectedRoute} setSelected={setSelectedRoute} showLogout={showLogout} setShowLogout={setShowLogout} />
      <div className="p-6" style={{ paddingTop: "96px" }}>
        {/* Role switcher */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <label className="text-sm text-slate-700">Preview role:</label>
          <select
            value={role}
            onChange={(e) => {
              const newRole = e.target.value;
              setRole(newRole);
              setSelectedRoute(NavbarConfig[newRole][0].key);
            }}
            className="p-2 rounded-md"
          >
            {Object.keys(NavbarConfig).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* 3-column layout */}
        <div style={{
               display: "grid",
               gap: "1rem",
               gridTemplateColumns: "3fr 10fr 3fr",
                
         }}
         className="responsive-grid">
          {/* Left column */}
          <div className="space-y-4">
            <LeftColumn role={role} />
          </div>

          {/* Center column */}
          <div>
            <div className="p-1 bg-white/90 rounded-2xl shadow-sm">
              <ActiveComponent />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <UpdatesCard updates={updates} />
          </div>
        </div>
      </div>
    </div>
  );
}
