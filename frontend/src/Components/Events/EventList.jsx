import React, { useState, useContext } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "../../context/AdminContext";
import RoomRequestModal from "./RoomRequest";
import ManageRequestsModal from "./ManageRoomRequest";
import ConfirmRegisterModal from "./ConfirmRegisterModal";
import EventCard from "./EventCard";
import { useEvents } from "../../hooks/useEvents";
import { useEventRegistration } from "../../hooks/useEventRegistration";

const EventList = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const username = isUserLoggedIn?.username || "";
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const userId = isUserLoggedIn?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventForManage, setSelectedEventForManage] = useState(null);

  // events via hook
  const { events, setEvents, loading, error } = useEvents(userRole, username);

  // Registration
  const { registering, isRegistered, registerForEvent } = useEventRegistration({
    userId,
  });
  const [selectedEventForRegister, setSelectedEventForRegister] =
    useState(null);

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
        event._id === updatedEvent._id ? updatedEvent : event,
      ),
    );
  };

  const handleManageUpdate = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event,
      ),
    );
  };

  const handleConfirmRegister = async (eventId) => {
    await registerForEvent(eventId, setEvents);
    setSelectedEventForRegister(null);
  };

  const onRegisterClick = (event) => setSelectedEventForRegister(event);
  const onManageClick = (event) => setSelectedEventForManage(event);
  const onRequestRoomClick = (eventId) => handleOpenModal(eventId);

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
      {/* ✅ ToastContainer for react-toastify */}
      <ToastContainer />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-4">
          <p>Events at IIT Bhilai</p>
        </div>

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
              <EventCard
                key={event._id}
                event={event}
                userRole={userRole}
                registering={registering}
                isRegistered={isRegistered}
                onRegisterClick={onRegisterClick}
                onManageClick={onManageClick}
                onRequestRoomClick={onRequestRoomClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
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

      {/* ✅ Register confirmation modal with blur background */}
      {selectedEventForRegister && (
        <ConfirmRegisterModal
          event={selectedEventForRegister}
          onConfirm={handleConfirmRegister}
          onCancel={() => setSelectedEventForRegister(null)}
          disabled={registering}
        />
      )}
    </>
  );
};

export default EventList;
