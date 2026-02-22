import { useFeedback } from "../../hooks/useFeedback";
import getCurrentTenureRange from "../../utils/getCurrentTenureRange";
const FeedbackStats = () => {
  const { filteredFeedbacks } = useFeedback();
  const { startDate, endDate } = getCurrentTenureRange();
  const tenureFeedback = filteredFeedbacks.filter((fb) => {
    const createdAt = new Date(fb.created_at);
    return createdAt >= startDate && createdAt <= endDate;
  });


  return (
    <div className="p-2 flex flex-col items-center justify-center">
      <p className="text-xl font-semibold justify-center">Feedback Stats</p>
      <p className="text-gray-800 mb-2 ">
        Total feedbacks:{" "}
        <span className="font-semibold text-blue-600">
          {tenureFeedback.length}
        </span>
      </p>

      <p className="text-gray-800 mb-2">
        Pending feedbacks:{" "}
        <span className="font-semibold text-yellow-600">
          {tenureFeedback.filter((fb) => !fb.is_resolved).length}
        </span>
      </p>

      <p className="text-gray-800 mb-2 ">
        Total resolved feedbacks:{" "}
        <span className="font-semibold text-green-600">
          {tenureFeedback.filter((fb) => fb.is_resolved).length}
        </span>
      </p>

      <p className="text-gray-800 mb-2">
        Recent feedbacks:{" "}
        <span className="font-semibold text-purple-600">
          {
            tenureFeedback.filter((fb) => {
              const now = new Date();
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(now.getDate() - 30);
              // Clamp to tenure start boundary
              const effectiveStart =
                thirtyDaysAgo < startDate ? startDate : thirtyDaysAgo;
              const createdAt = new Date(fb.created_at);
              return createdAt >= effectiveStart && createdAt <= now;
            }).length
          }
        </span>
      </p>
      <p className="text-gray-800 mb-2">
        Average Rating:{" "}
        <span className="font-bold">
          {tenureFeedback.filter((fb) => fb.rating).length > 0
            ? (
                tenureFeedback.reduce(
                  (sum, fb) => (fb.rating ? sum + fb.rating : sum),
                  0,
                ) / tenureFeedback.filter((fb) => fb.rating).length
              ).toFixed(1)
            : 0}
        </span>
      </p>
    </div>
  );
};

export default FeedbackStats;
