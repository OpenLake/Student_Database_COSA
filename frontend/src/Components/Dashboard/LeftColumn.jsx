import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { DashboardCardsConfig } from "../../config/leftColumnDashboard"; 

const LeftColumn = ({ role }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/dashboard/stats");
        console.log(response.data);
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Could not load stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [role]);

  if (loading) {
    return <div className="space-y-4"> {/* Skeleton Loaders Go Here */} </div>;
  }

  if (error || !stats) {
    return <div className="p-4 bg-white/90 rounded-2xl shadow-sm text-red-500">{error}</div>;
  }
  
  // Determine which card configuration to use
  const cardConfigKey = role.startsWith("GENSEC") ? "GENSEC" : role;
  const cardsToRender = DashboardCardsConfig[cardConfigKey] || [];

  return (
    <div className="space-y-4">
      {cardsToRender.length > 0 ? (
        cardsToRender.map(({ Component, props: propMappers }, index) => {
          // Create the props for the component by running the mapping functions
          const componentProps = Object.keys(propMappers).reduce((acc, key) => {
            acc[key] = propMappers[key](stats);
            return acc;
          }, {});

          return <Component key={index} {...componentProps} />;
        })
      ) : (
        <div>No stats available for this role.</div>
      )}
    </div>
  );
};

export default LeftColumn;