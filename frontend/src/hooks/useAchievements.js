import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

export const useAchievementForm = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    user_id: isUserLoggedIn._id,
    title: "",
    description: "",
    category: "",
    type: "",
    level: "",
    event_id: "",
    date_achieved: "",
    position: "",
    certificate_url: "",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/events/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      user_id: isUserLoggedIn._id,
      title: "",
      description: "",
      category: "",
      type: "",
      level: "",
      event_id: "",
      date_achieved: "",
      position: "",
      certificate_url: "",
    });
  };

  const submitAchievement = async () => {
    setLoading(true);
    try {
      await api.post(`/api/achievements/add`, formData);
      resetForm();
      return { success: true, message: "Achievement submitted successfully!" };
    } catch (error) {
      console.error("Error submitting achievement:", error);
      return { 
        success: false, 
        message: error.response?.data.message || error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    events,
    loading,
    updateFormData,
    resetForm,
    submitAchievement,
  };
};

export const useAchievements = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    const fetchMyAchievements = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/achievements/${isUserLoggedIn._id}`
        );
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError("Failed to fetch achievements");
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoggedIn?._id) {
      fetchMyAchievements();
    }
  }, [isUserLoggedIn]);

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement) => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      achievement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.type?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory = categoryFilter === "all" || 
      achievement.category === categoryFilter;

    // Filter by verification status
    const matchesVerification = verificationFilter === "all" ||
      (verificationFilter === "verified" ? achievement.verified : !achievement.verified);

    // Filter by level
    const matchesLevel = levelFilter === "all" || 
      achievement.level === levelFilter;

    return matchesSearch && matchesCategory && matchesVerification && matchesLevel;
  });

  // Get unique values for filter dropdowns
  const uniqueCategories = [
    ...new Set(achievements.map((a) => a.category).filter(Boolean))
  ].sort();
  
  const uniqueLevels = [
    ...new Set(achievements.map((a) => a.level).filter(Boolean))
  ].sort();

  return {
    achievements,
    filteredAchievements,
    loading,
    error,
    categoryFilter,
    setCategoryFilter,
    searchTerm,
    setSearchTerm,
    verificationFilter,
    setVerificationFilter,
    levelFilter,
    setLevelFilter,
    uniqueCategories,
    uniqueLevels,
  };
};
