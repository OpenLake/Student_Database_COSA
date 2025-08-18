import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Building,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AdminContext } from "../../App";
const EventList = () => {
  const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const username = isUserLoggedIn?.username || "";
  const userRole = isUserLoggedIn?.role || "STUDENT";
  // Fetch events from the new API endpoint
  useEffect(() => {
    const fetchEvents = async () => {
      if (!userRole) return;
      try {
        setLoading(true);
        setError(null);

        let url = `${API_BASE}/api/events/by-role/${userRole}`;
        if (userRole === "CLUB_COORDINATOR" && username) {
          url += `?username=${encodeURIComponent(username)}`;
        } else if (userRole === "CLUB_COORDINATOR" && !username) {
          throw new Error("Username is missing for Club Coordinator.");
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch events: ${response.status} ${response.statusText}`,
          );
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchEvents();
    }
  }, [userRole]);

  // Format date helper
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time helper
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      planned: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get room request status icon
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

  // Handle room request (placeholder)
  const handleRoomRequest = (eventId) => {
    alert(`Room request functionality for event ${eventId} coming soon!`);
  };

  // Check if room request button should be visible
  const canRequestRoom = () => {
    return [
      "CLUB_COORDINATOR",
      "GENSEC_SCITECH",
      "GENSEC_ACADEMIC",
      "GENSEC_CULTURAL",
      "GENSEC_SPORTS",
    ].includes(userRole);
  };

  // Render action buttons based on role
  const renderActionButtons = (event) => {
    switch (userRole) {
      case "STUDENT":
        return (
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Register
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </div>
        );
      case "CLUB_COORDINATOR":
        return (
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Edit Event
            </button>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              onClick={() => handleRoomRequest(event.event_id)}
            >
              Request Room
            </button>
          </div>
        );
      case "GENSEC_SCITECH":
      case "GENSEC_ACADEMIC":
      case "GENSEC_CULTURAL":
      case "GENSEC_SPORTS":
        return (
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Manage Event
            </button>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              onClick={() => handleRoomRequest(event.event_id)}
            >
              Request Room
            </button>
          </div>
        );
      case "PRESIDENT":
        return (
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Review Event
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Manage Requests
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Render role-specific information
  const renderRoleInfo = () => {
    switch (userRole) {
      case "STUDENT":
        return (
          <p className="text-gray-600 mb-6">
            Browse and register for upcoming events across all categories.
          </p>
        );
      case "CLUB_COORDINATOR":
        return (
          <p className="text-gray-600 mb-6">
            Manage your club's events. Room request functionality coming soon!
          </p>
        );
      case "GENSEC_SCITECH":
        return (
          <p className="text-gray-600 mb-6">
            Monitor and manage technical events. Guide clubs in your domain and
            approve room requests.
          </p>
        );
      case "GENSEC_ACADEMIC":
        return (
          <p className="text-gray-600 mb-6">
            Monitor and manage academic events. Guide clubs in your domain and
            approve room requests.
          </p>
        );
      case "GENSEC_CULTURAL":
        return (
          <p className="text-gray-600 mb-6">
            Monitor and manage cultural events. Guide clubs in your domain and
            approve room requests.
          </p>
        );
      case "GENSEC_SPORTS":
        return (
          <p className="text-gray-600 mb-6">
            Monitor and manage sports events. Guide clubs in your domain and
            approve room requests.
          </p>
        );
      case "PRESIDENT":
        return (
          <p className="text-gray-600 mb-6">
            Overview of all events and room requests across the institution.
            Review and approve as needed.
          </p>
        );
      default:
        return null;
    }
  };
  // Render room requests (for President and GenSecs)
  const renderRoomRequests = (event) => {
    if (
      ![
        "PRESIDENT",
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
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-sm text-gray-900 mb-2">
          Room Requests
        </h4>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-4">{renderRoleInfo()}</div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-600">
            There are no events to display for your role.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Event Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                  >
                    {event.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
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

                  {event.registration?.max_participants && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        Max: {event.registration.max_participants} participants
                      </span>
                    </div>
                  )}

                  {event.registration?.fees && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>₹{event.registration.fees}</span>
                    </div>
                  )}

                  {event.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="capitalize">{event.category}</span>
                    </div>
                  )}
                </div>

                {/* Room Requests (President and GenSecs) */}
                {renderRoomRequests(event)}

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {renderActionButtons(event)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
