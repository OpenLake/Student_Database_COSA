import { useState, useEffect } from "react";
import api from "../utils/api";

export const useEvents = (userRole, username) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestEvents, setLatestEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userRole) return;

      try {
        setLoading(true);
        setError(null);

        let url = `/api/events/by-role/${userRole}`;
        if (userRole === "CLUB_COORDINATOR" && username) {
          url += `?username=${encodeURIComponent(username)}`;
        } else if (userRole === "CLUB_COORDINATOR" && !username) {
          throw new Error("Username is missing for Club Coordinator.");
        }

        const response = await api.get(url);
        setEvents(response.data);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch events.";
        setError(message);
        console.error("Fetch error:", message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userRole, username]);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const response = await api.get("/api/events/latest");
        setLatestEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch updates:", error);
      }
    };

    fetchLatestUpdates();
  }, []);

  const updateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  return {
    events,
    loading,
    error,
    updateEvent,
    latestEvents,
  };
};
