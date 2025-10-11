import React, { useState, useEffect, useContext } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import RoomRequestModal from "./RoomRequest";
import ManageRequestsModal from "./ManageRoomRequest";
import api from "../../utils/api";
import EventForm from "./EventForm";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isUserLoggedIn } = useContext(AdminContext);
  const username = isUserLoggedIn?.username || "";
  const userRole = isUserLoggedIn?.role || "STUDENT";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventForManage, setSelectedEventForManage] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userRole) return;

      try {
        setLoading(true);
        setError(null);

        let url = `/api/events/by-role/${userRole}`;
        if (userRole === "CLUB_COORDINATOR" && username) {
          url += `?username=${encodeURIComponent(username)}`;
        } else if (userRole === "CLUB_COORDINATOR" && !username) {
          throw new Error("Username is missing for Club Coordinator.");
        }

        const response = await api.get(url);
        setEvents(response.data);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch events.";
        setError(message);
        console.error("Fetch error:", message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userRole, username]);

  const handleOpenModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEventId(null);
    setIsModalOpen(false);
  };

  const handleRoomRequestSubmit = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  const handleManageUpdate = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status) => {
    const colors = {
      planned: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

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

  const canRequestRoom = () => {
    return [
      "CLUB_COORDINATOR",
      "GENSEC_SCITECH",
      "GENSEC_ACADEMIC",
      "GENSEC_CULTURAL",
      "GENSEC_SPORTS",
    ].includes(userRole);
  };

  const renderActionButtons = (event) => {
    switch (userRole) {
      case "STUDENT":
        return (
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              Register
            </button>
            <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </div>
        );

      case "CLUB_COORDINATOR":
      case "GENSEC_SCITECH":
      case "GENSEC_ACADEMIC":
      case "GENSEC_CULTURAL":
      case "GENSEC_SPORTS":
      case "PRESIDENT":
        return (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEditingEvent(event)}
              className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 transition-colors"
            >
              Edit
            </button>

            {userRole !== "PRESIDENT" && canRequestRoom() && (
              <button
                className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
                onClick={() => handleOpenModal(event._id)}
              >
                Request Room
              </button>
            )}

            {userRole === "PRESIDENT" && (
              <>
                <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                  Review Event
                </button>
                <button
                  onClick={() => setSelectedEventForManage(event)}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  Manage Requests
                </button>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderRoomRequests = (event) => {
    if (
      ![
        "PRESIDENT",
        "CLUB_COORDINATOR",
        "GENSEC_SCITECH",
        "GENSEC_ACADEMIC",
        "GENSEC_CULTURAL",
        "GENSEC_SPORTS",
      ].includes(userRole) ||
      !event.room_requests?.length
    ) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#FDFAE2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <p className="text-red-700">Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#FDFAE2] text-gray-800 font-[Inter]">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Events at IIT Bhilai
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Stay updated with institute-wide events and club activities.
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 text-sm">
                There are no events to display for your role.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 flex flex-col p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {event.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 mb-3 text-sm text-gray-700">
                    {event.schedule?.start && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-500" />
                        <span>{formatDate(event.schedule.start)}</span>
                      </div>
                    )}
                    {event.schedule?.start && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                        <span>{formatTime(event.schedule.start)}</span>
                      </div>
                    )}
                    {event.schedule?.venue && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
                        <span>{event.schedule.venue}</span>
                      </div>
                    )}
                  </div>

                  {renderRoomRequests(event)}

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    {renderActionButtons(event)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EventForm Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl p-4 relative my-8 shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 font-bold"
              onClick={() => setEditingEvent(null)}
            >
              X
            </button>
            <EventForm
              event={editingEvent}
              onClose={() => setEditingEvent(null)}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <RoomRequestModal
          eventId={selectedEventId}
          onClose={handleCloseModal}
          onSubmit={handleRoomRequestSubmit}
        />
      )}
      {selectedEventForManage && (
        <ManageRequestsModal
          eventId={selectedEventForManage._id}
          eventTitle={selectedEventForManage.title}
          requests={selectedEventForManage.room_requests}
          onClose={() => setSelectedEventForManage(null)}
          onUpdateRequest={handleManageUpdate}
        />
      )}
    </>
  );
};

export default EventList;
