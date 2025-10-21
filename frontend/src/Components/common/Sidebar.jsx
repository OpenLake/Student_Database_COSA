import React from "react";
import Logout from "../Logout";
import logo from "../../assets/COSA.png";
import { useSidebar } from "../../hooks/useSidebar";
import { SidebarClose, SidebarOpen } from "lucide-react";

const Sidebar = () => {
  const {
    navItems,
    selected,
    setSelected,
    showLogout,
    setShowLogout,
    isCollapsed,
    setIsCollapsed,
  } = useSidebar();

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-black flex flex-col py-6 z-50 transition-all duration-300 ${
        isCollapsed ? "w-20 px-3" : "w-56 px-2"
      }`}
    >
      <div
        className={`flex items-center mb-8 ${isCollapsed ? "justify-center" : "justify-center gap-3"}`}
      >
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="font-semibold text-2xl text-white">CoSA</div>
        )}
      </div>

      {/* Collapse/Expand Button */}
      <div
        className={`flex items-center my-4 ${isCollapsed ? "justify-center" : "justify-end"}`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white cursor-pointer hover:text-gray-300 transition-colors"
        >
          {isCollapsed ? <SidebarOpen size={20} /> : <SidebarClose size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-3 bg-zinc-900 rounded-2xl px-2 overflow-visible py-4">
        {navItems.map(
          (item) =>
            item.label !== "Profile" && (
              <button
                key={item.key}
                onClick={() => setSelected(item.key)}
                className={`flex items-center gap-3 py-2 mx-1 transition-all duration-200 ${
                  isCollapsed ? "px-2 justify-center" : "px-4"
                } ${
                  selected === item.key
                    ? "bg-white text-black font-medium rounded-xl"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-[15px]">{item.label}</span>
                )}
              </button>
            )
        )}
      </nav>

      <div className="flex-1" />

      {/* Logout Section */}
      <div className="mt-6">
        {!showLogout ? (
          <button
            onClick={() => setShowLogout(true)}
            className={`flex items-center gap-3 py-3 w-full text-white hover:text-white/80 transition-all duration-200 ${
              isCollapsed ? "px-2 justify-center" : "px-4"
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!isCollapsed && <span className="text-[15px]">Logout</span>}
          </button>
        ) : (
          <div className={isCollapsed ? "hidden" : "block"}>
            <Logout />
            {/* <div className="text-white text-sm p-4">Logout Component Here</div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
