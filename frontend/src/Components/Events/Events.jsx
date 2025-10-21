import { Eye, Plus } from "lucide-react";
import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import EventForm from "./EventForm";
import EventList from "./EventList";

const Events = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const [addEvent, setAddEvent] = useState(false);

  return (
    <div>
      <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Upcoming Events
            </div>
            <div className="text-gray-600 mt-2">
              Stay updated with institute-wide events and club activities.
            </div>
          </div>
        </div>
        {userRole !== "STUDENT" && (
          <button
            onClick={() => setAddEvent(!addEvent)}
            className="flex items-center gap-2 text-black text-sm transition-colors"
          >
            {addEvent ? (
              <div className="flex gap-2">
                <Eye className="w-6 h-6" /> <span>View All Events</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Plus className="w-6 h-6" />
                <span>Add Event</span>
              </div>
            )}
          </button>
        )}
      </div>
      {userRole !== "STUDENT" ? (
        addEvent ? (
          <EventForm addEvent={addEvent} setAddEvent={setAddEvent} />
        ) : (
          <EventList addEvent={addEvent} setAddEvent={setAddEvent} />
        )
      ) : (
        <EventList addEvent={addEvent} setAddEvent={setAddEvent} />
      )}
    </div>
  );
};

export default Events;