import { useState } from "react";
import { Trash, XCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function RejectModal({ isOpen, onClose, request, onReject }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    if (reason.trim().length < 10) {
      toast.error("Rejection reason must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(reason.trim());
      setReason("");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to reject request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen || !request) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="p-3 rounded-xl shadow-md shadow-gray-500">
            <Trash className="text-red-500" size={24} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center px-6 pb-2">
          <h2 className="!text-xl font-bold text-white">Reject Request?</h2>
        </div>

        {/* Message */}
        <div className="text-center px-6 pb-1">
          <p className="text-gray-300 text-md leading-relaxed">
            Rejecting this request will permanently mark it as rejected. This
            action cannot be undone.
          </p>
        </div>

        {/* Rejection Reason Box */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="mb-6">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={10}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none transition-all"
              placeholder="Enter rejection reason..."
            />
            {reason.length < 10 && (
              <p className="text-red-400 text-xs mt-2 ml-1">
                {10 - reason.length} more characters required
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-end px-3 !py-1 bg-gray-600 text-gray-200 !rounded-xl font-medium hover:bg-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Close
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                isSubmitting || !reason.trim() || reason.trim().length < 10
              }
              className="flex-end px-3 !py-1 bg-red-600 text-white !rounded-xl font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
