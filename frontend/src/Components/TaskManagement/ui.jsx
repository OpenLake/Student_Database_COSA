// Priority card background + accent colors (soft tints)
export const PRIORITY_CARD_STYLE = {
  high: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    progress: "bg-rose-400",
    hover: "hover:border-rose-300",
    avatarBg: "bg-rose-400",
    viewBtn:
      "text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:shadow-md",
  },
  medium: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    progress: "bg-amber-400",
    hover: "hover:border-amber-300",
    avatarBg: "bg-amber-400",
    viewBtn:
      "text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:shadow-md",
  },
  low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    progress: "bg-emerald-400",
    hover: "hover:border-emerald-300",
    avatarBg: "bg-emerald-400",
    viewBtn:
      "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:shadow-md",
  },
};

export const STATUS_CONFIG = {
  pending: { label: "Pending", dot: "bg-stone-400", text: "text-stone-500" },
  "in-progress": {
    label: "In Progress",
    dot: "bg-amber-400",
    text: "text-amber-600",
  },
  "under-review": {
    label: "Under Review",
    dot: "bg-orange-400",
    text: "text-orange-600",
  },
  completed: {
    label: "Completed",
    dot: "bg-green-500",
    text: "text-green-600",
  },
};

export const AVATAR_COLORS = [
  "bg-violet-400",
  "bg-sky-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-indigo-400",
  "bg-pink-400",
];
