import { useState, useEffect } from "react";
import api from "../utils/api";

export const useTopSkills = () => {
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSkills = async () => {
      try {
        const res = await api.get("/api/skills/top-skills");
        setTopSkills(res.data);
      } catch (error) {
        console.error("Error fetching top skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopSkills();
  }, []);

  return { topSkills, loading };
};
