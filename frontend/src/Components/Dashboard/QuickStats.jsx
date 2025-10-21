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
      <div className="pt-6 pl-6 pr-2 pb-2">
        <div className="text-2xl font-bold mb-4">Quick Stats</div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border animate-pulse bg-gray-100"
            >
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-6 pl-6 pr-2 pb-2">
        <div className="text-2xl font-bold mb-4">Quick Stats</div>
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const renderStats = () => {
    if (!stats) return null;

    switch (role) {
      case "STUDENT":
        return (
          <>
            <StatCard title="Skills" value={stats.totalSkills || 0} />
            <StatCard
              title="Feedbacks"
              value={stats.totalFeedbacksGiven || 0}
            />
            <StatCard
              title="Achievements"
              value={stats.totalAchievements || 0}
            />
            <StatCard title="PORs" value={stats.totalPORs || 0} />
          </>
        );

      case "GENSEC_SCITECH":
      case "GENSEC_ACADEMIC":
      case "GENSEC_CULTURAL":
      case "GENSEC_SPORTS":
        return (
          <>
            <StatCard
              title="Budget Used"
              value={`₹${(stats.budget?.used || 0).toLocaleString()}`}
              subtitle={`of ₹${(stats.budget?.total || 0).toLocaleString()}`}
            />
            <StatCard title="Child Clubs" value={stats.parentOfClubs || 0} />
            <StatCard
              title="Pending Skills"
              value={stats.pendingSkillsEndorsement || 0}
              subtitle="to endorse"
            />
            <StatCard
              title="Pending User Skills"
              value={stats.pendingUserSkillsEndorsement || 0}
              subtitle="to endorse"
            />
          </>
        );

      case "CLUB_COORDINATOR":
        return (
          <>
            <StatCard
              title="Budget Used"
              value={`₹${(stats.budget?.used || 0).toLocaleString()}`}
              subtitle={`of ₹${(stats.budget?.total || 0).toLocaleString()}`}
            />
            <StatCard title="Total Events" value={stats.totalEvents || 0} />
            <StatCard
              title="Active Members"
              value={stats.totalActiveMembers || 0}
            />
            <StatCard
              title="Pending Reviews"
              value={stats.pendingReviews || 0}
              subtitle="achievements"
            />
          </>
        );

      case "PRESIDENT":
        return (
          <>
            <StatCard
              title="Total Budget"
              value={`₹${(stats.budget?.total || 0).toLocaleString()}`}
            />
            <StatCard
              title="Budget Used"
              value={`₹${(stats.budget?.used || 0).toLocaleString()}`}
            />
            <StatCard
              title="Room Requests"
              value={stats.pendingRoomRequests || 0}
              subtitle="pending"
            />
            <StatCard
              title="Org Units"
              value={stats.totalOrgUnits || 0}
              subtitle="total"
            />
          </>
        );

      default:
        return (
          <div className="col-span-4 p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-center">
            No statistics available for this role
          </div>
        );
    }
  };

  return (
    <div className="pt-6 pl-6 pr-2 pb-2">
      <div className="text-2xl font-bold mb-4">Quick Stats</div>
      <div className="grid grid-cols-4 gap-2">{renderStats()}</div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle }) => (
  <div className="p-4 rounded-xl text-black border bg-white hover:shadow-md transition-shadow">
    <p className="text-sm opacity-80 mb-1">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
    {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
  </div>
);

export default QuickStats;
