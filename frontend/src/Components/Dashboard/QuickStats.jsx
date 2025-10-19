import React, { useEffect, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import api from "../../utils/api";

const QuickStats = () => {
  const { role } = useSidebar();
  const [stats, setStats] = useState({
    totalSkills: 0,
    totalFeedbacksGiven: 0,
    totalAchievements: 0,
    totalPORs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/users/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  console.log(stats);

  const isStudent =
    role && typeof role === "string" && role.startsWith("STUDENT");
  const isGensec =
    role && typeof role === "string" && role.startsWith("GENSEC");

  return (
    <div className="pt-6 pl-6 pr-2 pb-2">
      <div className="text-2xl font-bold mb-4">Quick Stats</div>
      <div className="grid grid-cols-4 gap-2">
        {isStudent && (
          <>
            <StatCard title="Skills" value={stats.totalSkills} />
            <StatCard title="Feedbacks" value={stats.totalFeedbacksGiven} />
            <StatCard title="Achievements" value={stats.totalAchievements} />
            <StatCard title="PORs" value={stats.totalPORs} />
          </>
        )}
        {isGensec && (
          <>
            <StatCard title="Events" value={stats.totalEvents || 0} />
            <StatCard
              title="Endorsements"
              value={stats.totalEndorsements || 0}
            />
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="p-4 rounded-xl text-black border">
    <p className="text-sm opacity-80">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default QuickStats;
