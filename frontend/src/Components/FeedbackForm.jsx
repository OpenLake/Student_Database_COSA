import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    type: "Suggestion",
    description: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...feedback,
            userId: "67aa3c2e3f4feecbe809f9c6",
          }),
          credentials: "include",
        },
      );
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      if (err.status === 401 || err.status === 403) {
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <form
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl flex flex-col gap-6 border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-600 drop-shadow-sm">
            ✨ We Value Your Feedback ✨
          </h2>
          <p className="text-blue-500 text-lg font-medium mt-2">
            Help us improve by sharing your valuable feedback.
          </p>
        </div>

        {/* Feedback Type Dropdown */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-blue-600">Feedback Type</h3>
          <select
            className="w-full p-3 border border-blue-300 rounded-lg bg-gray-50 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
            onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
          >
            <option>Suggestion</option>
            <option>Complaint</option>
            <option>Query</option>
          </select>
        </div>

        {/* Feedback Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-blue-600">Your Feedback</h3>
          <textarea
            className="w-full h-32 bg-gray-50 p-4 border border-blue-300 rounded-lg text-lg text-gray-800 resize-none focus:outline-none focus:ring-4 focus:ring-blue-200"
            placeholder="Describe your feedback in detail..."
            onChange={(e) =>
              setFeedback({ ...feedback, description: e.target.value })
            }
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-10 rounded-lg text-xl font-bold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
