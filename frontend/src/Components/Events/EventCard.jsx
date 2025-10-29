import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusColor,
} from "../../utils/eventHelpers";
import EventRoomRequests from "./EventRoomRequests";
import EventActions from "./EventActions";

const EventCard = ({
  event,
  userRole,
  registering,
  isRegistered,
  onRegisterClick,
  onManageClick,
  onRequestRoomClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              event.status,
            )}`}
          >
            {event.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        <div className="space-y-2 mb-4">
          {event.schedule?.start && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(event.schedule.start)}</span>
            </div>
          )}
          {event.schedule?.start && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatTime(event.schedule.start)}</span>
            </div>
          )}
          {event.schedule?.venue && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.schedule.venue}</span>
            </div>
          )}
        </div>

        <EventRoomRequests event={event} userRole={userRole} />
      </div>

      <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50">
        <EventActions
          userRole={userRole}
          event={event}
          registering={registering}
          isRegistered={isRegistered}
          onRegisterClick={onRegisterClick}
          onManageClick={onManageClick}
          onRequestRoomClick={onRequestRoomClick}
        />
      </div>
    </div>
  );
};

export default EventCard;
