import React from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "../../utils/eventHelpers";

const getRoomRequestStatusIcon = (status) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "Rejected":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
  }
};

const EventRoomRequests = ({ event, userRole }) => {
  if (
    ![
      "PRESIDENT",
      "CLUB_COORDINATOR",
      "GENSEC_SCITECH",
      "GENSEC_ACADEMIC",
      "GENSEC_CULTURAL",
      "GENSEC_SPORTS",
    ].includes(userRole) ||
    !event?.room_requests?.length
  ) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-sm text-gray-900 mb-2">Room Requests</h4>
      <div className="space-y-2">
        {event.room_requests.map((request, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              {getRoomRequestStatusIcon(request.status)}
              <span>{request.room}</span>
              <span className="text-gray-500">
                {formatDate(request.date)} at {request.time}
              </span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                request.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : request.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {request.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRoomRequests;
