import React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  XCircleIcon,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusColor,
  canRequestRoom,
} from "../../utils/eventHelpers";
import { InfoCard } from "../common/InfoCard";

const EventCard = ({ event, userRole, onEdit, onRequestRoom, onManage }) => {
  // Prepare description items
  const descriptionItems = [];

  if (event.schedule?.start) {
    descriptionItems.push({
      key: "Date",
      value: formatDate(event.schedule.start),
      icon: Calendar,
    });
  }

  if (event.schedule?.start) {
    descriptionItems.push({
      key: "Time",
      value: formatTime(event.schedule.start),
      icon: Clock,
    });
  }

  if (event.schedule?.venue) {
    descriptionItems.push({
      key: "Location",
      value: event.schedule.venue,
      icon: MapPin,
    });
  }

  // Add room requests to description if user can view them
  const canViewRequests = [
    "PRESIDENT",
    "CLUB_COORDINATOR",
    "GENSEC_SCITECH",
    "GENSEC_ACADEMIC",
    "GENSEC_CULTURAL",
    "GENSEC_SPORTS",
  ].includes(userRole);

  if (canViewRequests && event.room_requests?.length > 0) {
    event.room_requests.forEach((request) => {
      descriptionItems.push({
        key: `${request.room} (${request.status.slice(0, 3)})`,
        value: `${formatDate(request.date)} at ${request.time}`,
        icon: request.status === "Approved" ? CheckCircle2 : XCircleIcon,
      });
    });
  }

  // Determine action button
  let actionConfig = null;

  if (
    userRole === "STUDENT" ||
    (canRequestRoom(userRole) && userRole !== "PRESIDENT")
  ) {
    actionConfig = {
      onAction: onRequestRoom,
      onActionText: "+ Request",
      onActionColor: "bg-[#BDF5FF] font-bold",
      onActionDisabled: false,
      onActionProps: event._id,
    };
  } else if (userRole === "PRESIDENT") {
    actionConfig = {
      onAction: onManage,
      onActionText: "Manage Requests",
      onActionColor: "bg-green-600 text-white",
      onActionDisabled: false,
      onActionProps: event,
    };
  }

  return (
    <InfoCard
      title={event.title}
      subtitle=""
      badgeText={event.status}
      badgeColor={getStatusColor(event.status)}
      descriptionItems={descriptionItems}
      onEdit={onEdit}
      onDelete={() => {}}
      onActionProps={actionConfig?.onActionProps}
      {...actionConfig}
      // bgColor="bg-[#FFFBF0]"
    />
  );
};

export default EventCard;
