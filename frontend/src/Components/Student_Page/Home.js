import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../../App";
import {
  User,
  Eye,
  MessageSquare,
  Calendar,
  LogOut,
  Plus,
  Award,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const { isUserLoggedIn } = useContext(AdminContext);
  const navigationItems = [
    { id: "cosa-view", label: "COSA View", icon: Eye, to: "/cosa" },
    {
      id: "feedback",
      label: "Give Feedback",
      icon: MessageSquare,
      to: "/feedback",
    },
    { id: "profile", label: "Profile Page", icon: User, to: "/profile" },
    { id: "events", label: "Events", icon: Calendar, to: "/events" },
    { id: "add-skill", label: "Add New Skill", icon: Plus, to: "/add-skill" },
    {
      id: "add-position",
      label: "Add Position",
      icon: Star,
      to: "/add-position",
    },
    {
      id: "add-achievement",
      label: "Add Achievements",
      icon: Award,
      to: "/add-achievement",
    },
  ];

  const statsCards = [
    {
      title: "Completed Courses",
      value: "12",
      icon: BookOpen,
      color: "bg-gray-900",
    },
    {
      title: "Active Projects",
      value: "3",
      icon: Target,
      color: "bg-gray-800",
    },
    {
      title: "Total Points",
      value: "2,450",
      icon: TrendingUp,
      color: "bg-gray-700",
    },
    { title: "Events Attended", value: "8", icon: Users, color: "bg-gray-600" },
  ];

  const recentActivities = [
    { activity: "Completed Web Development Course", time: "2 hours ago" },
    { activity: "Added new skill: React.js", time: "1 day ago" },
    { activity: "Attended Tech Conference 2024", time: "3 days ago" },
    { activity: "Updated profile information", time: "1 week ago" },
  ];

  const quickActions = [
    { label: "Add Achievement", icon: Award, to: "/adda-chievement" },
    { label: "New Position", icon: Star, to: "/add-position" },
    { label: "Give Feedback", icon: MessageSquare, to: "/feedback" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Student Portal
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`w-full flex items-center px-3 py-3 mb-2 text-left rounded-lg transition-all duration-200 group ${
                  activeSection === item.id
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">S</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {isUserLoggedIn.personal_info.name}!
            </h1>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Active Session
              </span>
              <span>
                {isUserLoggedIn.academic_info.branch} • Batch:{" "}
                {isUserLoggedIn.academic_info.batch_year} • Program:{" "}
                {isUserLoggedIn.academic_info.program}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Activities
                  </h2>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Menu className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {recentActivities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.activity}
                        </p>
                        <p className="text-sm text-gray-500">{item.time}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Latest Achievement */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        to={action.to}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">
                          {action.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Latest Achievement */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold">Latest Achievement</h3>
                </div>
                <h4 className="font-bold text-lg mb-2">
                  Web Development Certification
                </h4>
                <p className="text-gray-300 text-sm">
                  Completed with 95% score
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default StudentDashboard;
