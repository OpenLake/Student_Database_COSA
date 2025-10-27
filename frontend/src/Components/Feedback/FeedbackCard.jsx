import ExpandableText from "./ExpandableText";

export const FeedbackCard = ({ feedback, isStudent, onResolve, index }) => {
  return (
    <div className="bg-gray-200 rounded-lg px-2 hover:shadow-md transition-shadow duration-200 m-2">
      <div className="flex items-start gap-4">
        {/* Icon/Index */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-gray-900 mt-1">
            {feedback.comments?.length > 50
              ? feedback.comments.substring(0, 50) + "..."
              : feedback.comments}
          </div>

          <div className="flex items-center gap-3 text-xs mb-2">
            <span className="text-gray-600">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={
                  feedback.is_resolved ? "text-green-600" : "text-red-600"
                }
              >
                {feedback.is_resolved ? "Resolved" : "Not Resolved"}
              </span>
            </span>
            <span className="text-gray-600">
              <span className="font-medium">Type:</span>{" "}
              <span className="text-yellow-600">{feedback.type}</span>
            </span>
            <span className="text-gray-600">
              <span className="font-medium">Date:</span>{" "}
              {new Date(feedback.created_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
            <span className="text-gray-600">
              <span className="font-medium">Target:</span>{" "}
              <span className="text-green-600">
                {feedback.target_type === "User" && feedback.target_data
                   ? `${feedback.target_data.personal_info?.name} (${feedback.target_data.username})`  || feedback.target_data.username
                   : feedback.target_type === "Event" && feedback.target_data
                   ? `${feedback.target_data.title} (${feedback.target_data.organizing_unit})`
                   : feedback.target_type === "Club/Organization" && feedback.target_data
                   ? `${feedback.target_data.name} (${feedback.target_data.parent})`
                   : feedback.target_type === "POR" && feedback.target_data
                   ? `${feedback.target_data.title} (${feedback.target_data.unit})`
                   : "N/A"}
              </span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          {!feedback.is_resolved && !isStudent && (
            <button
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
              onClick={() => onResolve(feedback._id)}
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
