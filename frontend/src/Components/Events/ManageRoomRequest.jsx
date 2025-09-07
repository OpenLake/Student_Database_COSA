import React, { useState, useContext } from "react";
import { X as CloseIcon, ThumbsUp, ThumbsDown } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import api from "../../utils/api";
const ManageRequestsModal = ({
  eventId,
  eventTitle,
  requests,
  onClose,
  onUpdateRequest,
}) => {
  const [error, setError] = useState("");
  const [localRequests, setLocalRequests] = useState(requests || []);

  const pendingRequests = localRequests.filter(
    (req) => req.status === "Pending",
  );
  const reviewedRequests = localRequests.filter(
    (req) => req.status !== "Pending",
  );

  const { isUserLoggedIn } = useContext(AdminContext);
  const handleAction = async (requestId, status) => {
    setError("");
    try {
      const res = await api.patch(
        `/api/events/room-requests/${requestId}/status`,
        {
          status,
          reviewed_by: isUserLoggedIn ? isUserLoggedIn._id : null,
        },
      );

      const updatedEvent = res.data;

      // Update the local state to reflect the change immediately
      setLocalRequests(updatedEvent.room_requests);

      // Notify the parent EventList component of the change
      onUpdateRequest(updatedEvent);
    } catch (err) {
      const message =
        err.response?.data?.message || `Failed to ${status} request.`;
      setError(message);
      console.error("Error in handling action:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 m-4 flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Requests for: <span className="text-blue-600">{eventTitle}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <CloseIcon size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending requests for this event.
            </p>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-gray-50 p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="mb-3 sm:mb-0">
                    <p className="font-semibold text-gray-800">{req.room}</p>
                    <p className="text-xs text-gray-500">
                      On: {new Date(req.date).toLocaleDateString()} at{" "}
                      {req.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(req._id, "Approved")}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1 text-sm"
                    >
                      <ThumbsUp size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req._id, "Rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                    >
                      <ThumbsDown size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {reviewedRequests.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700">Reviewed</h3>
              {reviewedRequests.map((req) => (
                <div
                  key={req._id}
                  className={`bg-gray-50 p-3 rounded-lg border opacity-70 flex items-center justify-between ${req.status === "Approved" ? "border-green-200" : "border-red-200"}`}
                >
                  <p className="font-semibold text-gray-600">{req.room}</p>
                  <span
                    className={`font-bold text-sm ${req.status === "Approved" ? "text-green-600" : "text-red-600"}`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRequestsModal;
