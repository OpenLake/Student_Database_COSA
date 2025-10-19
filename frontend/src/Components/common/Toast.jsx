import { X } from "lucide-react";

export const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm ${
      type === "success"
        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
        : "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
    }`}
  >
    <span>{message}</span>
    <button
      onClick={onClose}
      className="ml-1 w-5 h-5 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);
