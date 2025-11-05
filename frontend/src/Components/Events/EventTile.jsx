import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusColor,
} from "../../utils/eventHelpers";
import { useSidebar } from "../../hooks/useSidebar";

const EventTile = ({
  event,
  index,
  compact = false,
}) => {
  const { setSelected } = useSidebar();
  const [month, day] = formatDate(event.schedule?.start).split(" ");
  return (
    <div
      className={`bg-yellow-${((index % 2) + 1) * 100} rounded-lg p-1 hover:shadow-md transition-shadow duration-200`}
      onClick={() => setSelected("events")}
    >
      <div className="flex items-start gap-4">
        {/* Number badge */}
        <div
          className={`flex-shrink-0 ${compact ? "w-10 h-10 text-xl" : "w-15 h-15 text-3xl"} bg-white rounded-lg flex items-center justify-center font-bold `}
        >
          {index}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mt-1">
            <div className="flex items-center justify-start gap-2">
              <div className="truncate">
                <div
                  className={` font-bold text-gray-900 truncate ${compact ? "text-sm" : "text-lg mb-1"}`}
                >
                  {event.title}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {event.description || "Event Overview"}
                </p>
              </div>
              {!compact && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Form Link
                </span>
              )}
            </div>
            {!compact && (
              <div className="flex flex-col items-center justify-start gap-0 mr-3">
                <span
                  className={`text-gray-600  whitespace-nowrap ${compact ? "text-xs" : "text-base mb-1"}`}
                >
                  {month}
                </span>
                <span
                  className={`text-gray-900 font-bold whitespace-nowrap ${compact ? "text-sm" : "text-2xl mb-1"}`}
                >
                  {day}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTile;
