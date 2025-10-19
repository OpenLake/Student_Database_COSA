export const getVerificationBadgeColor = (verified) => {
  return verified
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
};

export const getLevelBadgeColor = (level) => {
  switch (level?.toLowerCase()) {
    case "international":
      return "bg-purple-100 text-purple-800";
    case "national":
      return "bg-blue-100 text-blue-800";
    case "state":
      return "bg-indigo-100 text-indigo-800";
    case "district":
      return "bg-green-100 text-green-800";
    case "college":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};