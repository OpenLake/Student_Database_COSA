// Sidebar.jsx
import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sidebarConfig } from "../../config/sidebarConfig";
import { AdminContext } from "../../context/AdminContext";
import imgCOSA from "../../assets/COSA.png";
const Sidebar = ({ selected, setSelected }) => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const role = isUserLoggedIn?.role;
  const navigate = useNavigate();
  // GENSECs share one config
  const menuItems =
    role === "GENSEC_SCITECH" ||
    role === "GENSEC_ACADEMIC" ||
    role === "GENSEC_CULTURAL" ||
    role === "GENSEC_SPORTS"
      ? sidebarConfig.GENSEC_COMMON
      : sidebarConfig[role] || sidebarConfig.STUDENT;

  return (
    <div className="w-64 bg-[#0B1309] text-white flex flex-col h-screen p-4">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-10">
        <img src={imgCOSA} alt="CoSA" className="w-12 h-12 rounded-full" />
        <h2 className="text-xl font-bold">CoSA</h2>
      </div>

      {/* Menu Items */}
      <ul className="flex-1">
        {menuItems.map(({ key, label, icon: Icon }) => (
          <li
            key={key}
            onClick={() => setSelected(key)}
            className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition ${
              selected === key ? "bg-white text-black font-semibold" : "hover:bg-white/20"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button onClick={() => navigate("/logout")} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-600 transition-colors">
        <LogOut size={20} /> <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
