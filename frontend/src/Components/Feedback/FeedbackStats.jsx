import React from "react";
import { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useFeedback } from "../../hooks/useFeedback";
import getCurrentTenureRange from "../../utils/getCurrentTenureRange";
const FeedbackStats = () => {
  const {
    loading,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    filteredFeedbacks,
    markAsResolved,
  } = useFeedback();
  const { startDate, endDate, tenureYearString } = getCurrentTenureRange();
  const tenureFeedback = filteredFeedbacks.filter((fb) => {
    const createdAt = new Date(fb.created_at);
    return createdAt >= startDate && createdAt <= endDate;
  });
  const { isUserLoggedIn } = useContext(AdminContext);
  const isStudent = isUserLoggedIn?.role === "STUDENT";

  return (
    <div className="p-1 flex justify-center">
      <div classname=" flex flex-col items-center justify-center">
        <p className="text-xl font-semibold justify-center">STATS</p>
        <p className="text-gray-700 mb-2">
          Total feedbacks:{" "}
          <span className="font-semibold text-blue-600">
            {tenureFeedback.length}
          </span>
        </p>

        <p className="text-gray-700 mb-2">
          Pending feedbacks:{" "}
          <span className="font-semibold text-yellow-600">
            {tenureFeedback.filter((fb) => !fb.is_resolved).length}
          </span>
        </p>

        <p className="text-gray-700 mb-2">
          Total resolved feedbacks:{" "}
          <span className="font-semibold text-green-600">
            {tenureFeedback.filter((fb) => fb.is_resolved).length}
          </span>
        </p>

        <p className="text-gray-700">
          Recent feedbacks:{" "}
          <span className="font-semibold text-purple-600">
            {
              tenureFeedback.filter((fb) => {
                const now = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                const createdAt = new Date(fb.created_at);
                return createdAt >= thirtyDaysAgo && createdAt <= now;
              }).length
            }
          </span>
        </p>
        <p className="text-gray-700">
          Average Rating:{" "}
          <span className="font-bold">
            {tenureFeedback.length > 0
              ? (
                  tenureFeedback.reduce(
                    (sum, fb) => sum + (fb.rating || 0),
                    0,
                  ) / tenureFeedback.length
                ).toFixed(1)
              : 0}
          </span>
        </p>
      </div>
    </div>
  );
};

export default FeedbackStats;
