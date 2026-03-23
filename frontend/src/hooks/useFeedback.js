import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const { isUserLoggedIn } = useContext(AdminContext);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/api/feedback/view-feedback`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      setFeedbacks(sorted);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedbacks
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesTab = activeTab === "All" || fb.type === activeTab;
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Resolved"
          ? fb.is_resolved
          : !fb.is_resolved;
    return matchesTab && matchesStatus;
  });

  // Mark as resolved
  const markAsResolved = async (feedbackId, actionTaken) => {
    try {
      await api.put(`/api/feedback/mark-resolved/${feedbackId}`, {
        actions_taken: actionTaken,
        resolved_by: isUserLoggedIn._id,
        resolved_at: new Date().toISOString(),
      });
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb._id === feedbackId
            ? { ...fb, is_resolved: true, actions_taken: actionTaken }
            : fb,
        ),
      );
      return { success: true };
    } catch (err) {
      console.error("Failed to mark as resolved:", err);
      return { success: false, error: err };
    }
  };

  return {
    feedbacks,
    loading,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    filteredFeedbacks,
    markAsResolved,
  };
};

export const useFeedbackForm = () => {
  const [targetOptions, setTargetOptions] = useState({
    users: [],
    events: [],
    organizational_units: [],
    positions: [],
  });
  const [filteredTargets, setFilteredTargets] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    target_type: "",
    target_id: "",
    rating: "",
    comments: "",
    is_anonymous: false,
  });
  const { isUserLoggedIn } = useContext(AdminContext);

  // Fetch target options
  useEffect(() => {
    api.get(`/api/feedback/get-targetid`).then((res) => {
      const { users, events, organizational_units, positions } = res.data;

      setTargetOptions({
        users: users.map((u) => ({
          label: `${u.name} - ${u.user_id}`,
          value: u._id,
          type: "User",
        })),
        events: events.map((e) => ({
          label: e.title,
          value: e._id,
          type: "Event",
        })),
        organizational_units: organizational_units.map((o) => ({
          label: o.name,
          value: o._id,
          type: "Club/Organization",
        })),
        positions: positions.map((p) => ({
          label: `${p.title} - ${p.unit}`,
          value: p._id,
          type: "POR",
        })),
      });
    });
  }, []);

  // Filter targets based on target_type
  useEffect(() => {
    const { target_type } = formData;
    if (!target_type) {
      const all = [
        ...targetOptions.users,
        ...targetOptions.events,
        ...targetOptions.organizational_units,
        ...targetOptions.positions,
      ];
      setFilteredTargets(all);
    } else {
      const typeMap = {
        User: targetOptions.users,
        Event: targetOptions.events,
        "Club/Organization": targetOptions.organizational_units,
        POR: targetOptions.positions,
      };
      setFilteredTargets(typeMap[target_type] || []);
    }
  }, [formData, targetOptions]);

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      type: "",
      target_type: "",
      target_id: "",
      rating: "",
      comments: "",
      is_anonymous: false,
    });
  };

  const submitFeedback = async () => {
    try {
      const payload = {
        ...formData,
        feedback_by: isUserLoggedIn._id,
      };
      if (!payload.rating) {
        delete payload.rating;
      }

      await api.post(`/api/feedback/add`, payload);
      toast.success("Feedback submitted successfully");
      resetForm();
      return { success: true };
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
      return { success: false, error: err };
    }
  };

  return {
    formData,
    filteredTargets,
    updateFormData,
    resetForm,
    submitFeedback,
  };
};
