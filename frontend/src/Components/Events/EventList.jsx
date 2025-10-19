import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEvents } from "../../hooks/useEvents";
import RoomRequestModal from "./RoomRequest";
import ManageRequestsModal from "./ManageRoomRequest";
import EventForm from "./EventForm";
import { AlertCircle, Calendar } from "lucide-react";
import EventTile from "./EventTile";
import EventCard from "./EventCard";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64 bg-[#FDFAE2]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};
const ErrorState = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
      <p className="text-red-700">Error loading events: {error}</p>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No events found
      </h3>
      <p className="text-gray-600 text-sm">
        There are no events to display for your role.
      </p>
    </div>
  );
};

const EventList = ({ addEvent, setAddEvent }) => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const username = isUserLoggedIn?.username || "";
  const userRole = isUserLoggedIn?.role || "STUDENT";

  const { events, loading, error, updateEvent } = useEvents(userRole, username);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventForManage, setSelectedEventForManage] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleOpenModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEventId(null);
    setIsModalOpen(false);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    !addEvent && (
      <>
        <div className="min-h-screen bg-white text-gray-800 font-[Inter]">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between">
              <div className="">
                <div className="text-lg font-bold tracking-tight text-gray-900">
                  Upcoming Events
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Stay updated with institute-wide events and club activities.
                </p>
              </div>
              {userRole !== "STUDENT" && (
                <div>
                  <button onClick={() => setAddEvent(true)}>+ Add Event</button>
                </div>
              )}
            </div>
            {/* Gray horizontal line separator */}
            <div className="w-full h-[2px] bg-gray-300 my-3"></div>

            {events.length === 0 ? (
              <EmptyState />
            ) : userRole === "STUDENT" ? (
              <div className="flex flex-col gap-2">
                {events.map((event, i) => (
                  <EventTile key={i} index={i + 1} event={event} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {events.map((event, i) => (
                  <EventCard
                    key={i}
                    event={event}
                    userRole={userRole}
                    onEdit={setEditingEvent}
                    onRequestRoom={handleOpenModal}
                    onManage={setSelectedEventForManage}
                  />
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
            onSubmit={updateEvent}
          />
        )}

        {selectedEventForManage && (
          <ManageRequestsModal
            eventId={selectedEventForManage._id}
            eventTitle={selectedEventForManage.title}
            requests={selectedEventForManage.room_requests}
            onClose={() => setSelectedEventForManage(null)}
            onUpdateRequest={updateEvent}
          />
        )}
      </>
    )
  );
};

export default EventList;
