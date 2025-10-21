import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
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

const RoomRequestsList = ({ event, userRole }) => {
  const canViewRequests = [
    "PRESIDENT",
    "CLUB_COORDINATOR",
    "GENSEC_SCITECH",
    "GENSEC_ACADEMIC",
    "GENSEC_CULTURAL",
    "GENSEC_SPORTS",
  ].includes(userRole);

  if (!canViewRequests || !event.room_requests?.length) {
    return null;
  }

  return (
    <div className="mt-3 p-2 bg-[#f7f5dc] rounded-md border border-gray-200">
      <h4 className="font-semibold text-sm text-gray-900 mb-2">
        Room Requests
      </h4>
      <div className="space-y-1.5">
        {event.room_requests.map((request, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs text-gray-700"
          >
            <div className="flex items-center gap-1.5">
              {getRoomRequestStatusIcon(request.status)}
              <span>{request.room}</span>
              <span className="text-gray-500">
                {formatDate(request.date)} at {request.time}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
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

export default RoomRequestsList;
