import React from "react";
import { useEvents } from "../../hooks/useEvents";
import EventTile from "../Events/EventTile";

// A small component to visually represent event status
const StatusIndicator = ({ status }) => {
  const statusStyles = {
    planned: "bg-blue-500",
    ongoing: "bg-green-500",
    completed: "bg-slate-500",
    cancelled: "bg-red-500",
  };
  const colorClass = statusStyles[status] || "bg-gray-400";

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
      <span className="capitalize text-xs">{status}</span>
    </div>
  );
};

const UpdatesCard = () => {
  const { latestEvents } = useEvents();
  // return (
  //   <div className="flex flex-col gap-2">
  //     {latestEvents.map((event, i) => (
  //       <EventTile key={i} index={i + 1} event={event} compact={true} />
  //     ))}
  //   </div>
  // );
  return (
    <div className="p-4 bg-white/90 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">
            Latest Updates
          </div>
          {/* <div className="text-gray-600 mt-2">
            Your feedback helps us improve our services and overall COSA.
          </div> */}
        </div>
      </div>

      {!latestEvents || latestEvents.length === 0 ? (
        <p className="text-sm text-slate-500">No recent latestEvents found.</p>
      ) : (
        <ul className="space-y-3 p-0 list-none">
          {latestEvents.map((event, i) => (
            <EventTile key={i} index={i + 1} event={event} compact={true} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpdatesCard;
