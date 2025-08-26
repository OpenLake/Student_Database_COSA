// src/Components/GenSecDashboard.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Settings, LogOut, ChevronRight } from "lucide-react";
import { GENSEC_CONFIGS } from "../../config/gensecConfig";
import { logoutUser } from "../../services/auth";
import { AdminContext } from "../../context/AdminContext";

const GenSecDashboard = ({ role }) => {
  const config = GENSEC_CONFIGS[role];
  const [activeCategory, setActiveCategory] = useState("all");
  const { setIsUserLoggedIn, setUserRole } = useContext(AdminContext); //context access
  const navigate = useNavigate();

  if (!config)
    return (
      <div className="text-center text-red-500 p-4">Invalid GenSec role.</div>
    );

  const { title, displayName, theme, avatar, icon, categories, menuItems } =
    config;

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleLogout = async () => {
    try {
      await logoutUser(); // 🔓 server logout
      setIsUserLoggedIn(null); // clear frontend user
      setUserRole("STUDENT"); // reset role
      navigate("/login"); // go to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className={`bg-gradient-to-r ${theme} text-white shadow-lg`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {icon}
              <span className="ml-2 text-xl font-bold">{title}</span>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-1.5 pl-10 pr-4 rounded-lg bg-opacity-50 bg-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Search className="absolute top-1.5 left-3 h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full hover:bg-white hover:bg-purple-500">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-1 rounded-full hover:bg-white hover:bg-purple-500">
                <Settings className="h-6 w-6" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1.5 bg-white text-black rounded-lg"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm">Logout</span>
              </button>

              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
                {avatar}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            GenSec {displayName} Dashboard
          </h1>
          <p className="text-gray-600">
            Access and manage all your {displayName} services
          </p>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${theme} text-white shadow-md`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="transform hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 h-full">
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${item.color} text-white`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Access and manage {item.title.toLowerCase()}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                    <span>Open</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500 py-4">
          <p>© 2025 {title}. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default GenSecDashboard;
