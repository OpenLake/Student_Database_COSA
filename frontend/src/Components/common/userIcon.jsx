import React, { useState, useRef, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";

const UserIcon = () => {
  const { setSelected } = useSidebar();
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading profile...
      </div>
    );
  }

  let details = "";
  if (profile.academic_info) {
    details = `${profile.academic_info.batch_year} | ${profile.academic_info.program} | ${profile.user_id}`;
  } else {
    details = profile.personal_info?.email || "No academic info available";
  }

  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    if (action === "profile") {
      setSelected("profile");
    }
    // Add your navigation/action logic here
    console.log(`Action: ${action}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg p-2 transition-colors"
      >
        <div className="text-right">
          <div className="text-base font-semibold text-black">
            {profile?.personal_info?.name || "Profile Name"}
          </div>
          <div className="text-xs text-black/60">
            {details || "Profile Details"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
            {profile?.personal_info?.profilePic ? (
              <img
                src={profile?.personal_info.profilePic}
                alt={profile?.personal_info.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-400 text-white font-semibold text-sm">
                {profile?.personal_info?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-black/60 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleMenuItemClick("profile")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => handleMenuItemClick("settings")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserIcon;
