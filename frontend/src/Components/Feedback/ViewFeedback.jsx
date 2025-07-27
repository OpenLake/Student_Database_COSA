import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import classNames from "classnames";
import { AdminContext } from "../../App"; // adjust path as needed
import ExpandableText from "./ExpandableText";
const feedbackTypes = [
  "All",
  "Suggestion",
  "Complaint",
  "General Feedback",
  "Query",
  "Appreciation",
  "Report",
  "Other",
];

const statusFilters = ["All", "Resolved", "Not Resolved"];

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalFeedbackId, setModalFeedbackId] = useState(null);
  const [actionTaken, setActionTaken] = useState("");
  const [resolving, setResolving] = useState(false);

  const { isUserLoggedIn } = useContext(AdminContext);
  const isStudent = isUserLoggedIn?.role === "STUDENT";

  const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/feedback/view-feedback`);
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setFeedbacks(sorted);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleResolve = async () => {
    if (!actionTaken.trim()) return alert("Please enter actions taken.");
    setResolving(true);

    try {
      await axios.put(
        `${API_BASE}/api/feedback/mark-resolved/${modalFeedbackId}`,
        {
          actions_taken: actionTaken,
          resolved_by: isUserLoggedIn._id,
        },
      );
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb._id === modalFeedbackId
            ? { ...fb, is_resolved: true, actions_taken: actionTaken }
            : fb,
        ),
      );
      setShowModal(false);
      setActionTaken("");
    } catch (err) {
      console.error("Failed to mark as resolved:", err);
    } finally {
      setResolving(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesTab = activeTab === "All" || fb.type === activeTab;
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Resolved"
          ? fb.is_resolved
          : !fb.is_resolved;
    return matchesTab && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Feedbacks
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Monitor and manage user feedback across the platform
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {feedbacks.length}
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Feedbacks
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          {/* Status Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Filter by Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={classNames(
                    "px-4 py-2 text-sm font-medium border transition-all duration-200",
                    statusFilter === status
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {feedbackTypes.map((type) => (
                <button
                  key={type}
                  className={classNames(
                    "px-4 py-2 text-sm font-medium border transition-all duration-200",
                    activeTab === type
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                  )}
                  onClick={() => setActiveTab(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Loading feedbacks...
            </p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl text-gray-300 mb-4">📭</div>
            <p className="text-xl font-medium text-gray-500">
              No feedbacks found
            </p>
            <p className="text-gray-400 mt-2">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb._id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {fb.type}
                    </span>
                    {fb.is_resolved ? (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-50 text-green-800 border border-green-200">
                        ✓ Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                        ● Pending
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {new Date(fb.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Target Information */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <div className="text-sm font-semibold text-gray-900 mb-2">
                      Target Information
                    </div>
                    <div className="text-sm text-gray-700">
                      {fb.target_type === "User" &&
                        `${fb.target_data?.personal_info?.name} (${fb.target_data?.username})`}
                      {fb.target_type === "Event" &&
                        `${fb.target_data?.title} (${fb.target_data?.organizing_unit})`}
                      {fb.target_type === "Organization Unit" &&
                        `${fb.target_data?.name} (${fb.target_data?.parent})`}
                      {fb.target_type === "Position" &&
                        `${fb.target_data?.title} (${fb.target_data?.unit})`}
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-2">
                      Feedback
                    </div>
                    <ExpandableText text={fb.comments} />
                  </div>

                  {/* Rating */}
                  {fb.rating && (
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-2">
                        Rating
                      </div>
                      <div className="flex items-center">
                        <div className="text-lg font-medium text-gray-900 mr-2">
                          {fb.rating}
                        </div>
                        <div className="text-yellow-400">
                          {"★".repeat(fb.rating)}
                          {"☆".repeat(5 - fb.rating)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submitted By */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        Submitted By
                      </div>
                      {!fb.is_anonymous ? (
                        <div className="text-sm text-gray-600">
                          {fb.feedback_by?.personal_info?.name} (
                          {fb.feedback_by?.username})
                        </div>
                      ) : (
                        <div className="text-sm italic text-gray-500">
                          Anonymous User
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div>
                      {fb.is_resolved ? (
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-700 mb-1">
                            Actions Taken
                          </div>
                          <ExpandableText
                            text={fb.actions_taken || "No actions recorded"}
                            limit={250}
                          />
                        </div>
                      ) : isStudent ? (
                        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded">
                          Awaiting Resolution
                        </span>
                      ) : (
                        <button
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                          onClick={() => {
                            setModalFeedbackId(fb._id);
                            setShowModal(true);
                          }}
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mark Feedback as Resolved
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Please describe the actions taken to resolve this feedback.
                </p>
              </div>

              {/* Modal Body */}
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

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolve}
                    disabled={resolving}
                    className={classNames(
                      "px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded",
                      resolving
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-800",
                    )}
                  >
                    {resolving ? "Marking..." : "Mark as Resolved"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;
