import { useContext, useState } from "react";
import FeedbackForm from "./FeedbackForm";
import { Eye, Plus } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import ViewFeedback from "./ViewFeedback";

const Feedback = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const [add, setAdd] = useState(false);
  const userRole = isUserLoggedIn?.role || "STUDENT";

  return (
    <div>
      <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Feedbacks
            </div>
            <div className="text-gray-600 mt-2">
              Your feedback helps us improve our services and overall COSA.
            </div>
          </div>
        </div>
        {userRole === "STUDENT" && (
          <button
            onClick={() => setAdd(!add)}
            className="flex items-center gap-2 text-black text-sm transition-colors"
          >
            {add ? (
              <div className="flex gap-2">
                <Eye className="w-6 h-6" /> <span>View All Feedbacks</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Plus className="w-6 h-6" />
                <span>Add Feedback</span>
              </div>
            )}
          </button>
        )}
      </div>
      {userRole === "STUDENT" ? (
        add ? (
          <FeedbackForm />
        ) : (
          <ViewFeedback />
        )
      ) : (
        <ViewFeedback />
      )}
    </div>
  );
};

export default Feedback;
