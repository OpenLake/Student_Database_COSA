import React from "react";
import Logout from "../Logout";
import logo from "../../assets/COSA.png";
import { useSidebar } from "../../hooks/useSidebar";

const Sidebar = () => {
  // Get all sidebar state from context instead of props
  const { navItems, selected, setSelected, showLogout, setShowLogout } =
    useSidebar();

  return (
    <div className="fixed top-0 left-0 h-screen w-56 bg-black flex flex-col py-6 px-2 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="font-poppins font-semibold text-2xl text-white">
          CoSA
        </div>
      </div>

      {/* Collapse/Expand Button */}
      <button className="self-end mb-6 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white">
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
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1 bg-zinc-900 rounded-2xl p-3">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setSelected(item.key)}
            className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
              selected === item.key
                ? "bg-white text-black font-medium rounded-2xl"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[15px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="mt-6">
        {!showLogout ? (
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 px-4 py-3 w-full text-white hover:text-white/80 transition-all duration-200"
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
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-[15px]">Logout</span>
          </button>
        ) : (
          <Logout />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
