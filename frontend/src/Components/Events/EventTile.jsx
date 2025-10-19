import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusColor,
} from "../../utils/eventHelpers";

const EventTile = ({
  event,
  index,
  //   userRole,
  //   onEdit,
  //   onRequestRoom,
  //   onManage,
}) => {
  const [month, day] = formatDate(event.schedule?.start).split(" ");
  return (
    <div
      className={`bg-yellow-${((index % 2) + 1) * 100} rounded-lg p-1 hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-start gap-4">
        {/* Number badge */}
        <div className="flex-shrink-0 w-15 h-15 bg-white rounded-lg flex items-center justify-center font-bold text-3xl">
          {index}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mt-1">
            <div className="flex items-center justify-start gap-2">
              <div className="truncate">
                <div className="text-lg font-bold text-gray-900">
                  {event.title}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {event.description || "Event Overview"}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Form Link
              </span>
            </div>
            <div className="flex flex-col items-center justify-start gap-0 mr-3">
              <span className="text-gray-600 text-base whitespace-nowrap">
                {month}
              </span>
              <span className="text-gray-900 font-bold text-2xl whitespace-nowrap">
                {day}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTile;
