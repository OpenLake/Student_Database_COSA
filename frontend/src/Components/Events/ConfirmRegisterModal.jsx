import React from "react";

const ConfirmRegisterModal = ({ event, onConfirm, onCancel, disabled }) => (
  <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6 text-center">
      <h3 className="text-lg font-semibold mb-3">Confirm Registration</h3>
      <p className="text-gray-700 mb-6">
        Are you sure you want to register for <b>{event.title}</b>?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(event._id)}
          disabled={disabled}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmRegisterModal;
