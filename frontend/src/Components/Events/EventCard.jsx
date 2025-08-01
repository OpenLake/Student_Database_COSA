import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p className="text-gray-700">{event.description}</p>
      <Link
        to={`/events/${event._id}`}
        className="mt-3 inline-block text-indigo-600 hover:underline font-medium"
      >
        View More →
      </Link>
    </div>
  );
};

export default EventCard;
