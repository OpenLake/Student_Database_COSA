import { useState } from "react";

export const ResolutionModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [actionTaken, setActionTaken] = useState("");

  const handleSubmit = () => {
    if (!actionTaken.trim()) {
      return alert("Please enter actions taken.");
    }
    onSubmit(actionTaken);
    setActionTaken("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Mark Feedback as Resolved
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Please describe the actions taken to resolve this feedback.
          </p>
        </div>

        <div className="px-6 py-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Actions Taken
          </label>
          <textarea
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            rows={4}
            placeholder="Describe the specific actions taken to address and resolve this feedback..."
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Marking..." : "Mark as Resolved"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
