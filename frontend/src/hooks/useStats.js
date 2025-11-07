import { useEffect, useState } from "react";
import api from "../utils/api";
import { useSidebar } from "./useSidebar";

export const useStats = () => {
  const { role } = useSidebar();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/dashboard/stats");
      setStats(response.data);
      setError(null);
      console.log("Fetched Stats:", response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  // fetch automatically when role changes
  useEffect(() => {
    fetchStats();
  }, [role]);

  return { stats, loading, error, fetchStats };
};
