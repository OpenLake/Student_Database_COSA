import React from 'react';

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

const UpdatesCard = ({ updates }) => {
  return (
    <div className="p-4 bg-white/90 rounded-2xl shadow-sm">
      <h3 className="text-base font-semibold mb-3">Latest Updates</h3>

      {!updates || updates.length === 0 ? (
        <p className="text-sm text-slate-500">No recent updates found.</p>
      ) : (
        <ul className="space-y-3 p-0 list-none">
          {updates.map((update) => (
            <li key={update.id} className="bg-white/70 p-2 rounded-xl shadow-sm">
              
              <div className="flex items-start justify-between">
                <p className="font-medium text-sm pr-2">{update.title}</p>
                <p className="text-xs text-slate-700 whitespace-nowrap">{update.date}</p>
              </div>
              
              <div className="flex items-center justify-between text-slate-600">
                <p className="text-xs">Venue: {update.venue}</p>
                <StatusIndicator status={update.status} />
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpdatesCard;