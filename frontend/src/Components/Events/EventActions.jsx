import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { canRequestRoom } from "../../utils/eventHelpers";

const EventActions = ({ event, userRole, onEdit, onRequestRoom, onManage }) => {
  if (userRole === "STUDENT") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-end gap-2">
          <button className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Edit2 className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2.5 bg-[#FFB6C1] rounded-lg hover:bg-[#FF9BA8] transition-colors">
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
        <button className="w-full py-3 bg-[#ADD8E6] text-gray-900 text-base font-medium rounded-lg hover:bg-[#9AC8D6] transition-colors">
          + Request
        </button>
      </div>
    );
  }

  if (
    [
      "CLUB_COORDINATOR",
      "GENSEC_SCITECH",
      "GENSEC_ACADEMIC",
      "GENSEC_CULTURAL",
      "GENSEC_SPORTS",
      "PRESIDENT",
    ].includes(userRole)
  ) {
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="mx-1 w-full rounded-2xl">
          {userRole !== "PRESIDENT" && canRequestRoom(userRole) && (
            <button
              className="w-full py-2 bg-[#ADD8E6] text-gray-900 text-base font-medium rounded-2xl hover:bg-[#9AC8D6] transition-colors"
              onClick={() => onRequestRoom(event._id)}
            >
              + Request Room
            </button>
          )}

          {userRole === "PRESIDENT" && (
            <button
              onClick={() => onManage(event)}
              className="w-full py-2 bg-green-600 text-white text-base font-medium rounded-2xl hover:bg-green-700 transition-colors"
            >
              Manage Requests
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit2 className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2.5 bg-[#FFB6C1] rounded-lg hover:bg-[#FF9BA8] transition-colors">
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default EventActions;
