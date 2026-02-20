import { useState } from "react";
import {
  CalendarRange,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  User,
  PrinterCheck,
} from "lucide-react";
import { useRequest } from "../../context/RequestContext";
import { toast } from "react-toastify";
//import toast from "react-hot-toast";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import RejectModal from "./RejectModal";

export default function Card({ req, statusColor }) {
  const [status, setStatus] = useState("Pending");
  const { setApproved, setRejected, setTotal, setPending } = useRequest();

  const isActionDisabled = status !== "Pending";

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Handle button clicks
  function handleButtonClick(action) {
    if (isActionDisabled && action !== "view") {
      return;
    }

    switch (action) {
      case "view":
        setShowViewModal(true);
        return;
      case "edit":
        setShowEditModal(true);
        return;
      case "approve":
        handleApprove();
        return;
      case "reject":
        setShowRejectModal(true);
        return;
    }
  }

  function handleApprove() {
    setStatus("Approved");
    setPending((pending) => pending - 1);
    setApproved((approved) => approved + 1);
    setTotal((total) => total + (req.count || 0));
    toast.success("Request approved successfully");
  }

  async function handleReject(reason) {
    setStatus("Rejected");
    setPending((pending) => pending - 1);
    setRejected((rejected) => rejected + 1);
    toast.success("Request rejected successfully");
    // Here you would typically make an API call to save the rejection reason
    console.log("Rejection reason:", reason);
  }

  async function handleSave(updatedRequest) {
    // Here you would typically make an API call to update the request
    // For now, we'll just update local state
    Object.assign(req, updatedRequest);
    toast.success("Request updated successfully");
  }

  return (
    <div
      key={req.id}
      className="relative bg-[#FDFAE2] rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200"
    >
      {/* Status Badge */}
      <div
        className={`absolute top-5 right-5 px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm
                ${statusColor(status)}`}
      >
        {status}
      </div>

      {/* First Line: Priority | OrgName | Event Name */}
      <div className="mb-4 pr-24">
        <span className="text-gray-900 font-semibold text-lg">
          [{req.priority}] {req.organization} | {req.event}
        </span>
      </div>

      {/* Second Line: Students Count | Submitted Date | Requested by */}
      <div className="flex items-center gap-3 mb-5 text-sm text-gray-600">
        <CalendarRange size={18} className="text-gray-500" />
        <span className="px-2.5 py-1 rounded-md font-medium bg-gray-50 border border-gray-200">
          Submitted: {req.submitted}
        </span>

        <PrinterCheck size={20} className="text-gray-500" />
        <span className="px-2.5 py-1 rounded-md font-medium bg-gray-50 border border-gray-200">
          Eligible Students:{" "}
          <span className="font-semibold text-gray-800">{req.count}</span>
        </span>

        <User size={20} className="text-gray-500" />
        <span className="px-2 py-1 rounded-md font-medium bg-gray-50 border border-gray-200">
          Requested by: {req.requestedBy}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 flex-wrap pt-2 border-gray-100">
        <button
          onClick={() => handleButtonClick("view")}
          className="px-4 py-2 bg-blue-50 border-none text-blue-700 !rounded-lg font-medium hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow"
        >
          <Eye size={16} />
          View
        </button>

        <button
          onClick={() => handleButtonClick("edit")}
          disabled={isActionDisabled}
          className={`px-4 py-2 !rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow ${
            isActionDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-800"
          }`}
        >
          <Edit2 size={16} />
          Edit
        </button>

        <button
          onClick={() => handleButtonClick("approve")}
          disabled={isActionDisabled}
          className={`px-4 py-2 !rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow ${
            isActionDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
          }`}
        >
          <CheckCircle2 size={16} />
          Approve
        </button>

        <button
          onClick={() => handleButtonClick("reject")}
          disabled={isActionDisabled}
          className={`px-4 py-2 !rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow ${
            isActionDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500"
          }`}
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>

      {/* Modals */}
      <ViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        request={{ ...req, status }}
        statusColor={statusColor}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        request={req}
        onSave={handleSave}
      />

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        request={req}
        onReject={handleReject}
      />
    </div>
  );
}
