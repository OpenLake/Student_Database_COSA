import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  PlusCircle,
  MessageSquare,
  DoorClosed,
  Award,
  Users,
  FileText,
  Bell,
  Search,
  Settings,
  ChevronRight,
  Layers,
  Grid,
  Home,
  LogOut,
  Book,
} from "lucide-react";

const GensecAcadDashboard = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const menuItems = [
    {
      title: "GenSec Acad Endorsement",
      path: "/gensecacad-endorse",
      icon: <Award className="w-5 h-5" />,
      category: "endorsement",
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Room Booking",
      path: "/roombooking",
      icon: <DoorClosed className="w-5 h-5" />,
      category: "booking",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "View Feedback",
      path: "/viewfeedback",
      icon: <MessageSquare className="w-5 h-5" />,
      category: "feedback",
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Events",
      path: "/events",
      icon: <Calendar className="w-5 h-5" />,
      category: "events",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Add Event",
      path: "/add-event",
      icon: <PlusCircle className="w-5 h-5" />,
      category: "events",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "COSA Create",
      path: "/cosa/create",
      icon: <FileText className="w-5 h-5" />,
      category: "cosa",
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "COSA View",
      path: "/cosa",
      icon: <Layers className="w-5 h-5" />,
      category: "cosa",
      color: "from-yellow-500 to-amber-600",
    },
  ];

  const categories = [
    { id: "all", name: "All Modules", icon: <Grid className="w-4 h-4" /> },
    {
      id: "admin",
      name: "Administration",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "endorsement",
      name: "Endorsements",
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: "booking",
      name: "Bookings",
      icon: <DoorClosed className="w-4 h-4" />,
    },
    {
      id: "feedback",
      name: "Feedback",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    { id: "events", name: "Events", icon: <Calendar className="w-4 h-4" /> },
    { id: "cosa", name: "COSA", icon: <FileText className="w-4 h-4" /> },
  ];

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Book className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Academic Portal</span>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-1.5 pl-10 pr-4 rounded-lg bg-green-500 bg-opacity-50 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Search className="absolute top-1.5 left-3 h-5 w-5 text-green-200" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-white hover:bg-green-500">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-1 rounded-full text-white hover:bg-green-500">
                <Settings className="h-6 w-6" />
              </button>
              <Link
                to="/login"
                className="flex items-center px-3 py-1.5 bg-green-800 hover:bg-green-900 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm">Logout</span>
              </Link>
              <div className="relative">
                <button className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center font-bold">
                  GA
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            GenSec Academic Dashboard
          </h1>
          <p className="text-gray-600">
            Access and manage all your Academic services
          </p>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 py-4">
          <p>© 2025 GenSec Academic Portal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default GensecAcadDashboard;
