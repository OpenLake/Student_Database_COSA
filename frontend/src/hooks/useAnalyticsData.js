import { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AdminContext } from "../context/AdminContext";

const getEndpointForRole = (role) => {
  if (!role) return null;

  if (role === "PRESIDENT") {
    return "/api/analytics/president";
  }
  if (role.startsWith("GENSEC")) {
    return "/api/analytics/gensec";
  }
  if (role === "CLUB_COORDINATOR") {
    return "/api/analytics/club-coordinator";
  }
  if (role === "STUDENT") {
    return "/api/analytics/student";
  }
  console.warn(`No analytics endpoint configured for role: ${role}`);
  return null;
};

export const useAnalyticsData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isUserLoggedIn } = useContext(AdminContext);
  const role = isUserLoggedIn?.role;

  useEffect(() => {
    if (!role) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }
    const url = getEndpointForRole(role);

    if (!url) {
      setError("No analytics endpoint for user role");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch president analytics data:", error);
        setError("Failed to load analytics data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);
  return { data, loading, error };
};
