import React, { useEffect, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import api from "../../utils/api";

const QuickStats = () => {
  const { role } = useSidebar();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/dashboard/stats");
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [role]);

  if (loading) {
    return (
      <div className="pt-4 pl-6 pr-2 pb-2">
        <div className="text-xl font-bold mb-3">Quick Stats</div>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 animate-pulse"
            >
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 pl-6 pr-2 pb-2">
        <div className="text-xl font-bold mb-3">Quick Stats</div>
        <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const colors = ["#BDF5FF", "#FFEECA", "#C0FFBD", "#FFB4B4"];

  const getColorStyle = (index) => {
    const color = colors[index % colors.length];
    return {
      color: color,
      borderColor: adjustColor(color, -15),
    };
  };

  const adjustColor = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const renderStats = () => {
    if (!stats) return null;

    let statItems = [];

    switch (role) {
      case "STUDENT":
        statItems = [
          { label: "Skills", value: stats.totalSkills || 0 },
          { label: "Feedbacks", value: stats.totalFeedbacksGiven || 0 },
          { label: "Achievements", value: stats.totalAchievements || 0 },
          { label: "PORs", value: stats.totalPORs || 0 },
        ];
        break;

      case "GENSEC_SCITECH":
      case "GENSEC_ACADEMIC":
      case "GENSEC_CULTURAL":
      case "GENSEC_SPORTS":
        statItems = [
          {
            label: "Budget Used",
            value: `₹${(stats.budget?.used || 0).toLocaleString()}`,
            subtitle: `of ₹${(stats.budget?.total || 0).toLocaleString()}`,
          },
          { label: "Child Clubs", value: stats.parentOfClubs || 0 },
          {
            label: "Pending Skills",
            value: stats.pendingSkillsEndorsement || 0,
            subtitle: "to endorse",
          },
          {
            label: "Pending User Skills",
            value: stats.pendingUserSkillsEndorsement || 0,
            subtitle: "to endorse",
          },
        ];
        break;

      case "CLUB_COORDINATOR":
        statItems = [
          {
            label: "Budget Used",
            value: `₹${(stats.budget?.used || 0).toLocaleString()}`,
            subtitle: `of ₹${(stats.budget?.total || 0).toLocaleString()}`,
          },
          { label: "Total Events", value: stats.totalEvents || 0 },
          { label: "Active Members", value: stats.totalActiveMembers || 0 },
          {
            label: "Pending Reviews",
            value: stats.pendingReviews || 0,
            subtitle: "achievements",
          },
        ];
        break;

      case "PRESIDENT":
        statItems = [
          {
            label: "Total Budget",
            value: `₹${(stats.budget?.total || 0).toLocaleString()}`,
          },
          {
            label: "Budget Used",
            value: `₹${(stats.budget?.used || 0).toLocaleString()}`,
          },
          {
            label: "Room Requests",
            value: stats.pendingRoomRequests || 0,
            subtitle: "pending",
          },
          {
            label: "Clubs",
            value: stats.totalOrgUnits || 0,
            subtitle: "total",
          },
        ];
        break;

      default:
        return (
          <div className="px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-center text-sm">
            No statistics available for this role
          </div>
        );
    }

    return (
      <div className="bg-white rounded-lg overflow-hidden">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 hover:opacity-90 transition-opacity overflow-hidden"
            style={getColorStyle(index)}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {item.label}
              {item.subtitle && (
                <span className="text-xs text-gray-600 ml-2">({item.subtitle})</span>
              )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-2 pl-6 pr-2 pb-1 overflow-hidden">
      <div className="text-xl font-bold mb-1">Quick Stats</div>
      {renderStats()}
    </div>
  );
};

export default QuickStats;
