import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/events" className="text-blue-600 hover:underline">
        &larr; Back to Events
      </Link>
      <h1 className="text-3xl font-bold my-4">{event.title}</h1>
      <p className="mb-4 text-gray-700">{event.description}</p>
      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <strong>Category:</strong> {event.category}
        </p>
        <p>
          <strong>Type:</strong> {event.type}
        </p>
        <p>
          <strong>Mode:</strong> {event.schedule?.mode}
        </p>
        <p>
          <strong>Venue:</strong> {event.schedule?.venue}
        </p>
        <p>
          <strong>Start:</strong>{" "}
          {new Date(event.schedule?.start).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {new Date(event.schedule?.end).toLocaleString()}
        </p>
        <p>
          <strong>Organizing Unit:</strong>{" "}
          {event.organizing_unit_id?.name || "N/A"}
        </p>
        <p>
          <strong>Organizers:</strong>{" "}
          {event.organizers
            ?.map((org) => org.personal_info.name || "User")
            .join(", ")}
        </p>
      </div>
    </div>
  );
};

export default EventDetail;
