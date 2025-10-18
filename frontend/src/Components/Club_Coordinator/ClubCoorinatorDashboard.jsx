import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import EventForm from "../Events/EventForm";
import ViewFeedback from "../Feedback/ViewFeedback";
import AchievementsEndorsementTab from "../GenSec/AchievementsEndorsementTab";
import { CreateTenure, ViewTenure } from "../Positions/TenureRecords";
import EventList from "../Events/EventList";
import Logout from "../Logout";
import api from "../../utils/api";
import {
  Home,
  Users,
  UserPlus,
  Calendar,
  Plus,
  MessageSquare,
  Award,
  User,
  LogOut,
  TrendingUp,
  DollarSign,
  CheckSquare,
  FileText,
  Star,
} from "lucide-react";
import ViewPosition from "../Positions/ViewPosition";
import LoadingSpinner from '../common/LoadingScreen'
const ClubDashboard = () => {
  const [activeTab, setActiveTab] = useState("Feedback");
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isUserLoggedIn } = React.useContext(AdminContext);

  const navigate = useNavigate();

  const transformApiData = (apiData) => {
    const {
      unit,
      events,
      positions,
      positionHolders,
      achievements,
      feedbacks,
    } = apiData;

    // Calculate stats
    const activeEvents = events.length;
    const upcomingEvents = events.filter(
      (event) =>
        event.status === "planned" &&
        new Date(event.schedule.start) > new Date(),
    ).length;
    const totalMembers = positionHolders.filter(
      (ph) => ph.status === "active",
    ).length;
    const pendingAchievements = achievements.filter(
      (ach) => !ach.verified,
    ).length;

    // Transform recent events
    const recentEvents = events
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((event) => ({
        id: event._id,
        name: event.title,
        date: new Date(event.schedule.start).toLocaleDateString(),
        venue: event.schedule.venue || "TBD",
        status: event.status,
      }));

    // Transform pending endorsements (unverified achievements)
    const pendingEndorsements = achievements
      .filter((ach) => !ach.verified)
      .slice(0, 3)
      .map((ach) => ({
        id: ach._id,
        title: ach.title,
        recipient: ach.user_id?.personal_info?.name || "Unknown",
        type: ach.category,
      }));

    return {
      name: unit.name,
      description: unit.description || "No description available",
      unit: {
        name: unit.name,
        category: unit.category,
      },
      contact_info: {
        email: unit.contact_info?.email || "No email provided",
      },
      budget_info: {
        allocated_budget: unit.budget_info?.allocated_budget || 0,
        spent_amount: unit.budget_info?.spent_amount || 0,
      },
      stats: {
        total_members: totalMembers,
        active_events: activeEvents,
        upcoming_events: upcomingEvents,
        pending_reviews: pendingAchievements,
      },
      recent_events: recentEvents,
      pending_endorsements: pendingEndorsements,
      recent_feedback: feedbacks,
    };
  };

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const email = isUserLoggedIn?.username;
        if (!email) {
          return;
        }
        const res = await api.get(`/api/orgUnit/clubData/${email}`);
        // Transform the API data
        const transformedData = transformApiData(res.data);
        setClubData(transformedData);
      } catch (err) {
        console.error(err);
        const message =
          err.response?.data?.message || "Error fetching club data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchClubData();
  }, [isUserLoggedIn?.username]);

  const sidebarItems = [
    { name: "Dashboard", icon: Home, active: true },
    { name: "Positions", icon: Users },
    { name: "Add Position", icon: UserPlus },
    { name: "Events", icon: Calendar },
    { name: "Add Event", icon: Plus },
    { name: "Feedback", icon: MessageSquare },
    { name: "Achievements", icon: Award },
    { name: "Logout", icon: LogOut },
  ];

  const quickActions = [
    { name: "Add New Position", icon: UserPlus },
    { name: "Create Event", icon: Calendar },
    { name: "Review Achievements", icon: Award },
    { name: "Endorse Skills", icon: Star },
  ];

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getProgressPercentage = () => {
    if (!clubData?.budget_info?.allocated_budget) {
      return 0;
    }
    return (
      (clubData.budget_info.spent_amount /
        clubData.budget_info.allocated_budget) *
      100
    ).toFixed(1);
  };

  const renderStatsCard = (title, value, subtitle, icon, trend = null) => (
    <div className="bg-white rounded-md p-3 border border-gray-200 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium">{title}</p>
          <p className="text-lg font-semibold text-gray-900 mt-0.5">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-[11px] mt-0.5 leading-tight">
              {trend && (
                <span className="text-green-600 font-medium">+{trend}% </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-1.5 bg-gray-50 rounded-md">
          {React.createElement(icon, { size: 16, className: "text-gray-600" })}
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 w-full">
        {renderStatsCard(
          "Total Active Members",
          clubData.stats.total_members,
          "Total active member in current tenure",
          Users,
          clubData.stats.member_growth,
        )}
        {renderStatsCard(
          "Total Events",
          clubData.stats.active_events,
          `${clubData.stats.upcoming_events} upcoming this month`,
          Calendar,
        )}
        {renderStatsCard(
          "Budget Used",
          formatCurrency(clubData.budget_info.spent_amount),
          `${getProgressPercentage()}% of ${formatCurrency(clubData.budget_info.allocated_budget)}`,
          DollarSign,
        )}
        {renderStatsCard(
          "Pending Reviews",
          clubData.stats.pending_reviews,
          "Feedback & achievements",
          FileText,
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Recent Events */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Recent Events
              </h3>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Latest events and their status
            </p>
          </div>
          <div className="p-4 space-y-3">
            {clubData.recent_events.length > 0 ? (
              clubData.recent_events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {event.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {event.date} • {event.venue}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === "planned"
                        ? "bg-blue-100 text-blue-800"
                        : event.status === "ongoing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No recent events found
              </div>
            )}
            <button className="w-full mt-3 py-2 text-center text-gray-600 hover:text-gray-900 font-medium text-sm">
              View All Events
            </button>
          </div>
        </div>

        {/* Pending Endorsements */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Award size={16} className="text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Pending Endorsements
              </h3>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Achievements waiting for your approval
            </p>
          </div>
          <div className="p-4">
            {clubData.pending_endorsements.length > 0 ? (
              clubData.pending_endorsements.map((endorsement) => (
                <div
                  key={endorsement.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {endorsement.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {endorsement.recipient} • {endorsement.type}
                    </p>
                  </div>
                  <button className="bg-black text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-800">
                    Endorse
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No pending endorsements
              </div>
            )}
            <button className="w-full mt-3 py-2 text-center text-gray-600 hover:text-gray-900 font-medium text-sm">
              View All Achievements
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feedback */}
        {/* Recent Feedback */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <MessageSquare size={16} className="text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Recent Feedback
              </h3>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Latest feedback from students
            </p>
          </div>

          <div className="p-4 space-y-3">
            {clubData.recent_feedback.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No feedback yet.</p>
            ) : (
              clubData.recent_feedback.map((feedback) => (
                <div key={feedback._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {feedback.type}
                    </h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < feedback.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  {feedback.comments && (
                    <p className="text-xs text-gray-600 mb-1">
                      {feedback.comments}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    by{" "}
                    {feedback.is_anonymous
                      ? "Anonymous"
                      : feedback.feedback_by?.name || "Unknown"}
                  </p>
                </div>
              ))
            )}

            {clubData.recent_feedback.length > 2 && (
              <button
                onClick={() => navigate("/feedback")}
                className="w-full mt-3 py-2 text-center text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                View All Feedback
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">
              Quick Actions
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Common tasks for club management
            </p>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setActiveTab(action.name)}
              >
                <action.icon size={16} className="text-gray-600" />
                <span className="font-medium text-gray-900 text-sm">
                  {action.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Club Information */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Club Information
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Overview of {clubData.name}
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                Description
              </h4>
              <p className="text-gray-600 text-sm">{clubData.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                Contact
              </h4>
              <p className="text-gray-600 text-sm">
                {clubData.contact_info.email}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                Budget Status
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Allocated</span>
                  <span className="font-medium">
                    {formatCurrency(clubData.budget_info.allocated_budget)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-medium">
                    {formatCurrency(clubData.budget_info.spent_amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return renderDashboardContent();
      case "Positions":
        return <ViewTenure />;
      case "Add Position":
        return <CreateTenure />;
      case "Events":
        return <EventList />;
      case "Add Event":
        return <EventForm />;
      case "Feedback":
        return <ViewFeedback />;

      case "Achievements":
        return (
          <AchievementsEndorsementTab skillType={clubData.unit.category} />
        );
      case "Skills":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
            <p className="text-gray-600">
              Skills management component will be implemented here.
            </p>
          </div>
        );
      case "Logout":
        return <Logout />;
      default:
        return renderDashboardContent();
    }
  };

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

   if (!clubData) {
     return (
       <div className="flex h-screen bg-gray-50 items-center justify-center">
         <div className="text-center">
           <p className="text-gray-600 text-lg">No club data found</p>
         </div>
       </div>
     );
   }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
       <div className="w-80 bg-black text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-lg font-bold">Student Council</h3>
              <p className="text-gray-400 text-sm">{clubData.unit.name}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.name
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {clubData.unit.name} Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with your club.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                {clubData.unit.category} Club
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default ClubDashboard;
