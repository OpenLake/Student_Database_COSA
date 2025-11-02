import { useContext, useState } from "react";
import { FeedbackCard } from "./FeedbackCard";
import { FilterSection } from "./FilterSection";
import { ResolutionModal } from "./ResolutionModel";
import { useFeedback } from "../../hooks/useFeedback";
import { AdminContext } from "../../context/AdminContext";

const ViewFeedback = ({ onSelectFeedback }) => {
  const {
    loading,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    filteredFeedbacks,
    markAsResolved,
  } = useFeedback();

  const { isUserLoggedIn } = useContext(AdminContext);
  const isStudent = isUserLoggedIn?.role === "STUDENT";

  const [showModal, setShowModal] = useState(false);
  const [modalFeedbackId, setModalFeedbackId] = useState(null);
  const [resolving, setResolving] = useState(false);

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

  const handleResolve = async (actionTaken) => {
    setResolving(true);
    const result = await markAsResolved(modalFeedbackId, actionTaken);
    setResolving(false);
    if (result.success) {
      setShowModal(false);
    }
  };

  return (
    <div className="bg-white px-6 py-2 w-full mx-auto rounded-lg">
      {/* Filters Section */}
      <div className="grid grid-cols-2 gap-6">
        <FilterSection
          label="Filter by Type"
          value={activeTab}
          onChange={setActiveTab}
          options={feedbackTypes}
        />
        <FilterSection
          label="Filter by Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusFilters}
        />
      </div>

      {/* Feedback Cards */}
      {loading ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading feedbacks...
          </p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="text-6xl text-gray-300 mb-4">📭</div>
          <p className="text-xl font-medium text-gray-500">
            No feedbacks found
          </p>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <div className="space-y-4 mt-4 border-2 border-black rounded-md">
          <div className="font-bold px-4 pt-2 text-xl">Recent Feedbacks</div>
          {filteredFeedbacks.map((fb, index) => (
            <div
              key={fb._id}
              onClick={() => onSelectFeedback(fb)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectFeedback(fb);
                }
              }}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
            >
              <FeedbackCard
                key={fb._id}
                index={index}
                feedback={fb}
                isStudent={isStudent}
                onResolve={(id) => {
                  setModalFeedbackId(id);
                  setShowModal(true);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <ResolutionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleResolve}
        loading={resolving}
      />
    </div>
  );
};

export default ViewFeedback;
