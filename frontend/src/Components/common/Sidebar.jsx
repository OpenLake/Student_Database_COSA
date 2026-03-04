import React, { useState } from "react";
import Logout from "../Auth/Logout";
import logo from "../../assets/COSA.png";
import { useSidebar } from "../../hooks/useSidebar";
import { SidebarClose, SidebarOpen, LogOut } from "lucide-react";

const Sidebar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const { navItems, selected, setSelected, isCollapsed, setIsCollapsed } = useSidebar();

  const visibleNavItems = navItems.slice(0, 14);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-black flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-52"
      }`}
      style={{ padding: "12px 8px" }}
    >
      {/* Header: Logo + Title + Collapse button in one row */}
      <div
        className={`flex items-center mb-2 px-1 ${
          isCollapsed ? "flex-col gap-2" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={logo} alt="CoSA Logo" className="w-full h-full object-cover" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-xl text-white tracking-wide">
              CoSA
            </span>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
        >
          {isCollapsed ? <SidebarOpen size={17} /> : <SidebarClose size={17} />}
        </button>
      </div>

      {/* Thin divider */}
      <div className="h-px bg-zinc-800 mx-1 mb-2" />

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col justify-center bg-zinc-900 rounded-2xl py-2 px-1.5 overflow-hidden gap-0.5">
        {visibleNavItems.map(
          (item) =>(
              <button
                key={item.key}
                onClick={() => setSelected(item.key)}
                className={`flex items-center gap-2.5 py-2 w-full transition-all duration-200 ${
                  isCollapsed ? "px-2 justify-center" : "px-3"
                } ${
                  selected === item.key
                    ? "bg-white text-black font-medium !rounded-2xl mb-1"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-600 !rounded-xl"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-[16px] whitespace-nowrap">{item.label}</span>
                )}
              </button>
            )
        )}
      </nav>

      {/* Thin divider */}
      <div className="h-px bg-zinc-800 mx-1 mt-2" />

      {/* Logout */}
      <div className="mt-2">
        <button
          onClick={() => setLoggingOut(true)}
          className={`flex items-center gap-2.5 py-2 w-full text-zinc-400 text-white rounded-xl ${
            isCollapsed ? "justify-center px-2" : "px-3"
          }`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-[16px]">Logout</span>}
          {loggingOut && <Logout />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;