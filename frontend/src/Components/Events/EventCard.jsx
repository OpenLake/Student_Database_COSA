"use client";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Award,
  Pencil,
  Trash2,
  Inbox,
  Check,
} from "lucide-react";

const statusLabelMap = {
  planned: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClassMap = {
  planned: "bg-blue-100 text-blue-800",
  ongoing: "bg-emerald-100 text-emerald-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const EventCard = ({
  event,
  userRole,
  canRequestRoom,
  requestState,
  onOpenRequestModal,
  onEdit,
  onDelete,
  onManageRequests,
  canEdit,
  canDelete,
}) => {
  const title = event?.title || "Untitled Event";
  const status = event?.status || "planned";
  const statusLabel = statusLabelMap[status] || status;
  const statusClasses = statusClassMap[status] || "bg-gray-100 text-gray-800";

  const startDate = event?.schedule?.start
    ? new Date(event.schedule.start)
    : null;
  const dateStr = startDate
    ? startDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "TBD";
  const timeStr = startDate
    ? startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBD";
  const venue = event?.schedule?.venue || "TBD";

  const eventHead =
    event?.organizers?.[0]?.personal_info?.name ||
    event?.organizing_unit_id?.name ||
    "N/A";
  const guestOfHonour = event?.guest_of_honour || "N/A";

  // Main action button (bottom)
  let actionEl = null;
  if (canRequestRoom) {
    if (requestState === "approved") {
      actionEl = (
        <div className="w-full bg-emerald-100 text-emerald-800 font-semibold rounded-lg py-3 text-center flex items-center justify-center gap-2">
          <span>Approved</span>
          <Check className="h-4 w-4" />
        </div>
      );
    } else if (requestState === "requested") {
      actionEl = (
        <div className="w-full bg-amber-100 text-amber-800 font-semibold rounded-lg py-3 text-center">
          Requested
        </div>
      );
    } else {
      actionEl = (
        <button
          type="button"
          onClick={() => onOpenRequestModal?.(event._id)}
          className="w-full bg-sky-200 hover:bg-sky-300 text-sky-900 font-semibold rounded-lg py-3 transition-colors"
        >
          + Request
        </button>
      );
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-[#FFF7DB] shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
      {/* Header: Title + Status + Small Icons */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-xl font-extrabold text-stone-900 leading-tight">
            {title}
          </h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-2 ${statusClasses}`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {userRole === "PRESIDENT" && (
            <button
              type="button"
              title="Manage Requests"
              onClick={() => onManageRequests?.(event)}
              className="p-2 rounded-md bg-white/70 hover:bg-white text-stone-700 border border-stone-200"
            >
              <Inbox className="h-4 w-4" />
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              title="Edit Event"
              onClick={() => onEdit?.(event)}
              className="p-2 rounded-md bg-white/70 hover:bg-white text-stone-700 border border-stone-200"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              title="Delete Event"
              onClick={() => onDelete?.(event._id)}
              className="p-2 rounded-md bg-white/70 hover:bg-white text-red-600 border border-stone-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-2 text-sm text-stone-700">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 mt-0.5 text-stone-500" />
          <span>
            <span className="font-semibold">Event Head:</span>{" "}
            <span className="text-stone-800">{eventHead}</span>
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Award className="h-4 w-4 mt-0.5 text-stone-500" />
          <span>
            <span className="font-semibold">Guest of Honour:</span>{" "}
            <span className="text-stone-800">{guestOfHonour}</span>
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 mt-0.5 text-stone-500" />
          <span>
            <span className="font-semibold">Date:</span>{" "}
            <span className="text-stone-800">{dateStr}</span>
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 mt-0.5 text-stone-500" />
          <span>
            <span className="font-semibold">Time:</span>{" "}
            <span className="text-stone-800">{timeStr}</span>
          </span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-stone-500" />
          <span>
            <span className="font-semibold">Location:</span>{" "}
            <span className="text-stone-800">{venue}</span>
          </span>
        </div>
      </div>

      {/* Bottom action */}
      {actionEl && <div className="mt-4">{actionEl}</div>}
    </div>
  );
};

export default EventCard;
