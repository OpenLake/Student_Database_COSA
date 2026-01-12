import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/api.js";
export const useFetchAnnouncements = (filters = {}) => {
  const [announcements, setAnnouncements] = useState([]);
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/api/announcements/", { params: filters });
      setAnnouncements(res.data.announcements);
      console.log(res.data.announcements);
    } catch (error) {
      console.error(
        "Error fetching Announcements with selected filters...",
        error,
      );
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await api.delete(`/api/announcements/${id}`);
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [JSON.stringify(filters)]);
  return {
    announcements,
    refetch: fetchAnnouncements,
    deleteAnnouncement,
  };
};
export const useAnnouncementsForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "General",
    isPinned: false,
    targetIdentifier: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "General",
      isPinned: false,
      targetIdentifier: "",
    });
  };

  const createAnnouncement = async () => {
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        isPinned: formData.isPinned,
      };

      // Only send targetIdentifier if needed
      if (formData.type !== "General" && formData.targetIdentifier) {
        payload.targetIdentifier = formData.targetIdentifier;
      }

      await api.post("/api/announcements", payload);

      toast.success("Announcement created successfully");
      resetForm();

      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Failed to create announcement");
      return { success: false, error };
    }
  };

  const updateAnnouncement = async (id) => {
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        targetIdentifier: formData.targetIdentifier,
        isPinned: formData.isPinned,
      };
      await api.put(`/api/announcements/${id}`, payload);
      toast.success("Announcement updated successfully");
      resetForm();

      return { success: true };
    } catch (error) {
      console.error("Error in updating the announcement", error);
      toast.error("Failed to edit announcement");
      return { success: false, error };
    }
  };

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    createAnnouncement,
    updateAnnouncement,
  };
};
