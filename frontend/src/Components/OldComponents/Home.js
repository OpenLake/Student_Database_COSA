import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import api from "../../utils/api";
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
  ScanSearch,
  Trophy,
} from "lucide-react";

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [latestAchievement, setLatestAchievement] = useState(null);

  const { isUserLoggedIn } = useContext(AdminContext);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/api/events/events`);
        const now = new Date();

        const upcomingEvents = res.data
          .filter(
            (event) =>
              event.schedule?.start && new Date(event.schedule.start) > now,
          )
          .sort(
            (a, b) => new Date(a.schedule.start) - new Date(b.schedule.start),
          ); // Sort ascending by date

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchLatestAchievement = async () => {
      try {
        const res = await api.get(`/api/achievements/${isUserLoggedIn._id}`);

        if (Array.isArray(res.data) && res.data.length > 0) {
          const sorted = res.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          );
          setLatestAchievement(sorted[0]); // most recently created achievement
        } else {
          setLatestAchievement(null);
        }
      } catch (err) {
        console.error("Error fetching latest achievement:", err);
        setLatestAchievement(null);
      }
    };

    if (isUserLoggedIn?._id) {
      fetchLatestAchievement();
    }
  }, [isUserLoggedIn?._id]);

  const navigationItems = [
    { id: "profile", label: "Profile Page", icon: User, to: "/profile" },
    { id: "cosa-view", label: "COSA View", icon: Eye, to: "/cosa" },
    {
      id: "feedback",
      label: "Give Feedback",
      icon: MessageSquare,
      to: "/feedback",
    },
    { id: "events", label: "Events", icon: Calendar, to: "/events" },
    { id: "add-skill", label: "Manage Skills", icon: Plus, to: "/skills" },
    {
      id: "manage-position",
      label: "Manage Positions (PORs)",
      icon: Star,
      to: "/manage-position",
    },
    {
      id: "add-achievement",
      label: "Add Achievements",
      icon: Award,
      to: "/add-achievement",
    },
    {
      id: "view-achievements",
      label: "View Achievements",
      icon: Trophy,
      to: "/view-achievements",
    },
    {
      id: "view-feedback",
      label: "View Feedback",
      icon: ScanSearch,
      to: "/viewfeedback",
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      to: "/logout",
    },
  ];

  const [counts, setCounts] = useState({
    skills: 0,
    achievements: 0,
    positions: 0,
    feedbacks: 0,
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [skillsRes, achievementsRes, positionsRes, feedbacksRes] =
          await Promise.all([
            api.get(`/api/skills/user-skills/${isUserLoggedIn._id}`),
            api.get(`/api/achievements/${isUserLoggedIn._id}`),
            api.get(`/api/positions/${isUserLoggedIn._id}`),
            api.get(`/api/feedback/${isUserLoggedIn._id}`),
          ]);

        setCounts({
          skills: skillsRes.data.length,
          achievements: achievementsRes.data.length,
          positions: positionsRes.data.length,
          feedbacks: feedbacksRes.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchAllStats();
  }, []);

  const statsCards = [
    {
      title: "Total Skills",
      value: counts.skills,
      icon: BookOpen,
      color: "bg-gray-900",
    },
    {
      title: "Achievements",
      value: counts.achievements,
      icon: Target,
      color: "bg-gray-800",
    },
    {
      title: "Position of Responsibility",
      value: counts.positions.toLocaleString(),
      icon: Users,
      color: "bg-gray-700",
    },
    {
      title: "Feedback Given",
      value: counts.feedbacks,
      icon: TrendingUp,
      color: "bg-gray-600",
    },
  ];

  const quickActions = [
    { label: "Add Achievement", icon: Award, to: "/add-achievement" },
    { label: "New Position", icon: Star, to: "/add-position" },
    { label: "Give Feedback", icon: MessageSquare, to: "/feedback" },
  ];

  if (!isUserLoggedIn?._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading student data...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out flex flex-col h-full`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Student Dashboard
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3 overflow-y-auto flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`w-full flex items-center px-3 py-3 mb-1/2 text-left rounded-lg transition-all duration-200 group ${
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
              <div className="relative">Student Dashboard</div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Logout */}
              <Link
                to="/logout"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">
                  Logout
                </span>
              </Link>

              {/* Profile */}
              <Link to="/profile">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <User className="text-white w-4 h-4" />
                </div>
              </Link>
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
                  className="bg-white rounded-xl p-6 gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h5 className="text-xs font-medium text-gray-600 mb-1">
                    {card.title}
                  </h5>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* upcoming events */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 gray-200 min-h-[525px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Upcoming Events
                  </h2>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Menu className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {events.length > 0 ? (
                    events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-700 mb-1">
                            {event.description}
                          </p>
                          <div className="text-xs text-gray-500 space-y-0.5">
                            <p>
                              <strong>Category:</strong> {event.category}
                            </p>
                            <p>
                              <strong>Organizing Unit:</strong>{" "}
                              {event.organizing_unit_id?.name || "N/A"}
                            </p>
                            <p>
                              <strong>Schedule:</strong>{" "}
                              {new Date(event.schedule?.start).toLocaleString()}{" "}
                              — {new Date(event.schedule?.end).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 mt-2" />
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full min-h-[200px]">
                      <p className="text-gray-500 text-[25px] text-center">
                        No upcoming events.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Latest Achievement */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 gray-200">
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
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-sm min-h-[150px]">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold">Latest Achievement</h3>
                </div>

                {latestAchievement ? (
                  <>
                    <h4 className="font-bold text-lg mb-2">
                      {latestAchievement.title}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {latestAchievement.description ||
                        "No description provided."}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Category: {latestAchievement.category} | Achieved on:{" "}
                      {new Date(
                        latestAchievement.date_achieved,
                      ).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400 text-center text-sm mt-6">
                    No achievements yet.
                  </p>
                )}
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
