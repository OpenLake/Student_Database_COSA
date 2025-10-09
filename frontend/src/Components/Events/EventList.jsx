"use client";

import { useState, useEffect, useContext } from "react";
import { Calendar, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import RoomRequestModal from "./RoomRequest";
import ManageRequestsModal from "./ManageRoomRequest";
import api from "../../utils/api";
import EventForm from "./EventForm";
import EventCard from "./EventCard";

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

  const [contactMap, setContactMap] = useState({});
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

  useEffect(() => {
    const fetchContacts = async () => {
      if (!isUserLoggedIn || events.length === 0) return;

      try {
        const roleAllowsEdit = [
          "CLUB_COORDINATOR",
          "GENSEC_SCITECH",
          "GENSEC_ACADEMIC",
          "GENSEC_CULTURAL",
          "GENSEC_SPORTS",
          "PRESIDENT",
        ].includes(userRole);

        if (!roleAllowsEdit) return;

        const results = await Promise.allSettled(
          events.map((e) => api.get(`/api/events/${e._id}/is-contact`)),
        );

        const map = {};
        results.forEach((res, idx) => {
          const id = events[idx]._id;
          map[id] =
            res.status === "fulfilled" ? !!res.value.data.isContact : false;
        });
        setContactMap(map);
      } catch (e) {
        console.warn("Failed to check contact flags for events.");
      }
    };
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoggedIn, events]);

  const handleOpenModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEventId(null);
    setIsModalOpen(false);
  };

  const handleRoomRequestSubmit = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev)),
    );
  };

  const handleManageUpdate = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev)),
    );
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

  const canRequestRoom = () =>
    [
      "CLUB_COORDINATOR",
      "GENSEC_SCITECH",
      "GENSEC_ACADEMIC",
      "GENSEC_CULTURAL",
      "GENSEC_SPORTS",
    ].includes(userRole);

  const getRequestState = (event) => {
    const reqs = event?.room_requests || [];
    if (reqs.some((r) => r.status === "Approved")) return "approved";
    if (reqs.some((r) => r.status === "Pending")) return "requested";
    return "none";
  };

  const canEditRole = [
    "CLUB_COORDINATOR",
    "GENSEC_SCITECH",
    "GENSEC_ACADEMIC",
    "GENSEC_CULTURAL",
    "GENSEC_SPORTS",
    "PRESIDENT",
  ].includes(userRole);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/api/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete event. You may not have permission.",
      );
    }
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
    <>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-stone-900 text-white">
              <Calendar className="h-4 w-4" />
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900">Events</h2>
          </div>
          {/* Add Event action left as-is for authorized users (open create form) */}
          {canEditRole && (
            <button
              type="button"
              onClick={() => setEditingEvent({})}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800"
            >
              + Add Event
            </button>
          )}
        </div>
        <div className="border-t border-stone-200 mb-6" />

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => {
              const requestState = getRequestState(event);
              return (
                <EventCard
                  key={event._id}
                  event={event}
                  userRole={userRole}
                  canRequestRoom={canRequestRoom()}
                  requestState={requestState}
                  onOpenRequestModal={handleOpenModal}
                  onEdit={(e) => setEditingEvent(e)}
                  onDelete={handleDelete}
                  onManageRequests={(e) => setSelectedEventForManage(e)}
                  canEdit={canEditRole}
                  canDelete={!!contactMap[event._id]}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* EventForm modal for create/edit */}
      {editingEvent !== null && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl p-4 relative my-8">
            <button
              className="absolute top-2 right-2 text-gray-700 font-bold"
              onClick={() => setEditingEvent(null)}
            >
              X
            </button>
            {/* If editingEvent is {}, render create form */}
            <EventForm
              event={editingEvent && editingEvent._id ? editingEvent : null}
              onClose={() => setEditingEvent(null)}
            />
          </div>
        </div>
      )}

      {/* Room request modal */}
      {isModalOpen && (
        <RoomRequestModal
          eventId={selectedEventId}
          onClose={handleCloseModal}
          onSubmit={handleRoomRequestSubmit}
        />
      )}

      {/* President manage requests modal */}
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
