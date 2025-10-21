export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const getStatusColor = (status) => {
  const colors = {
    planned: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const canRequestRoom = (userRole) => {
  return [
    "CLUB_COORDINATOR",
    "GENSEC_SCITECH",
    "GENSEC_ACADEMIC",
    "GENSEC_CULTURAL",
    "GENSEC_SPORTS",
  ].includes(userRole);
};
