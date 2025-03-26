import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/events`,
        { withCredentials: true },
      );
      setEvents(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error(err);
      if (err.status === 401 || err.status === 403) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Format date
    const dateOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };

    const sameDay = startDate.toDateString() === endDate.toDateString();

    if (sameDay) {
      return (
        <>
          <span className="font-medium">
            {startDate.toLocaleDateString(undefined, dateOptions)}
          </span>
          <span className="text-gray-600">
            {startDate.toLocaleTimeString(undefined, timeOptions)} -{" "}
            {endDate.toLocaleTimeString(undefined, timeOptions)}
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="font-medium">
            {startDate.toLocaleDateString(undefined, dateOptions)}
          </span>
          <span className="text-gray-600">
            {startDate.toLocaleTimeString(undefined, timeOptions)}
          </span>
          <span className="mx-1">to</span>
          <span className="font-medium">
            {endDate.toLocaleDateString(undefined, dateOptions)}
          </span>
          <span className="text-gray-600">
            {endDate.toLocaleTimeString(undefined, timeOptions)}
          </span>
        </>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold text-center">Scheduled Events</h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">No events scheduled</p>
            <p className="text-sm text-gray-400 mt-1">
              Create a new event to get started
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li
                key={event._id}
                className="py-4 hover:bg-gray-50 transition-colors rounded-md"
              >
                <div className="px-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    {event.title}
                  </h3>
                  <div className="mt-1 text-sm flex flex-wrap gap-x-1 text-gray-700">
                    {formatDateRange(event.startTime, event.endTime)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <button
            onClick={fetchEvents}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Refresh Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventList;
