import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/feedback`,
        {
          withCredentials: true,
        },
      );
      setFeedbacks(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load feedbacks. Please try again later.");
      console.error(err);
      if (error.status === 401 || error.status === 403) {
        navigate("/login", { replace: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Suggestion":
        return "bg-blue-50 border-blue-200";
      case "Complaint":
        return "bg-red-50 border-red-200";
      case "Query":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeEmoji = (type) => {
    switch (type) {
      case "Suggestion":
        return "💡";
      case "Complaint":
        return "⚠️";
      case "Query":
        return "❓";
      default:
        return "📝";
    }
  };

  const filteredFeedbacks =
    filter === "All"
      ? feedbacks
      : feedbacks.filter((feedback) => feedback.type === filter);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Student Feedback
        </h2>
        <p className="text-gray-600">
          Browse through student suggestions, complaints, and queries
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 p-4 mb-6 rounded-lg shadow-sm text-center">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setFilter("All")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "All"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          All Feedback
        </button>
        <button
          onClick={() => setFilter("Suggestion")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "Suggestion"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          💡 Suggestions
        </button>
        <button
          onClick={() => setFilter("Complaint")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "Complaint"
              ? "bg-red-600 text-white"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          ⚠️ Complaints
        </button>
        <button
          onClick={() => setFilter("Query")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "Query"
              ? "bg-purple-600 text-white"
              : "bg-purple-50 text-purple-600 hover:bg-purple-100"
          }`}
        >
          ❓ Queries
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading feedback...</p>
          </div>
        </div>
      ) : (
        <div>
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-gray-50 p-10 text-center rounded-xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-gray-600 mb-4">
                No feedback available
              </p>
              <button
                onClick={fetchFeedback}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredFeedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className={`${getTypeColor(feedback.type)} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center bg-white h-8 w-8 rounded-full shadow-sm text-lg font-bold text-gray-700">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {getTypeEmoji(feedback.type)} {feedback.type}
                      </h3>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 bg-white rounded-lg p-4 shadow-inner">
                    <p className="text-gray-700 whitespace-pre-line">
                      {feedback.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
