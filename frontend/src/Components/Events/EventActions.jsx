import React from "react";
import { canRequestRoom } from "../../utils/eventHelpers";

const EventActions = ({
  userRole,
  event,
  registering,
  isRegistered,
  onRegisterClick,
  onManageClick,
  onRequestRoomClick,
}) => {
  switch (userRole) {
    case "STUDENT": {
      const alreadyRegistered = isRegistered(event);
      return (
        <div className="flex gap-2">
          <button
            disabled={alreadyRegistered || registering}
            onClick={() => !alreadyRegistered && onRegisterClick(event)}
            className={`px-4 py-2 rounded-md transition-colors ${
              alreadyRegistered
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {alreadyRegistered ? "Registered" : "Register"}
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            View Details
          </button>
        </div>
      );
    }

    case "CLUB_COORDINATOR":
    case "GENSEC_SCITECH":
    case "GENSEC_ACADEMIC":
    case "GENSEC_CULTURAL":
    case "GENSEC_SPORTS":
      return (
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Manage Event
          </button>
          {canRequestRoom(userRole) && (
            <button
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              onClick={() => onRequestRoomClick(event._id)}
            >
              Request Room
            </button>
          )}
        </div>
      );

    case "PRESIDENT":
      return (
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Review Event
          </button>
          <button
            onClick={() => onManageClick(event)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Manage Requests
          </button>
        </div>
      );

    default:
      return null;
  }
};

export default EventActions;
