import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/events/events`);
        const sorted = res.data.sort(
          (a, b) => new Date(b.schedule?.start) - new Date(a.schedule?.start),
        );
        setEvents(sorted);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Events</h1>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
