import React from "react";
import { Calendar, Clock, Edit2, MapPin, Trash2 } from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusColor,
} from "../../utils/eventHelpers";
import RoomRequestsList from "./RoomRequestsList";
import EventActions from "./EventActions";

const EventCard = ({ event, userRole, onEdit, onRequestRoom, onManage }) => {
  return (
    <div className="bg-[#FFFBF0] rounded-2xl hover:shadow-xl transition-all duration-200 flex flex-col p-6">
      <div className="text-2xl font-bold text-gray-900 truncate">
        {event.title}
      </div>

      <div className="flex items-center justify-between my-2">
        {/* Status badge */}
        <div
          className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
            event.status,
          )}`}
        >
          {event.status}
        </div>
      </div>

      <div className="space-y-3 mb-2 text-sm text-gray-700">
        {event.schedule?.start && (
          <div className="flex items-start">
            <Calendar className="w-4 h-4 text-gray-600 mr-2" />
            <div>
              <span className="font-semibold">Date : </span>
              <span>{formatDate(event.schedule.start)}</span>
            </div>
          </div>
        )}
        {event.schedule?.start && (
          <div className="flex items-start">
            <Clock className="w-4 h-4 text-gray-600 mr-2" />
            <div>
              <span className="font-semibold">Time : </span>
              <span>{formatTime(event.schedule.start)}</span>
            </div>
          </div>
        )}
        {event.schedule?.venue && (
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-600 mr-2" />
            <div>
              <span className="font-semibold">Location : </span>
              <span>{event.schedule.venue}</span>
            </div>
          </div>
        )}
      </div>

      <RoomRequestsList event={event} userRole={userRole} />

      <div className="mt-auto pt-4">
        <EventActions
          event={event}
          userRole={userRole}
          onEdit={onEdit}
          onRequestRoom={onRequestRoom}
          onManage={onManage}
        />
      </div>
    </div>
  );
};

export default EventCard;
