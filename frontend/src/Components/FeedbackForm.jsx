import React, { useState, useContext } from "react";
import { AdminContext } from "../App";
import "../App.css";
const FeedbackForm = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [feedback, setFeedback] = useState({
    type: "Suggestion",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!IsUserLoggedIn) {
    //   alert("You need to log in to submit feedback.");
    //   return;
    // }

    const response = await fetch("http://localhost:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...feedback, userId: "test123" }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <form
        className="bg-gray-800 shadow-2xl rounded-lg p-8 w-full max-w-2xl flex flex-col gap-6 border border-gray-700"
        onSubmit={handleSubmit}
      >
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-400 drop-shadow-lg">
            ✨ We Value Your Feedback ✨
          </h2>
          <p className="text-blue-300 text-lg font-medium mt-2">
            Help us improve by sharing your valuable feedback.
          </p>
        </div>

        {/* Feedback Type Dropdown */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-blue-300">Feedback Type</h3>
          <select
            className="w-full p-3 border border-blue-500 rounded-lg bg-gray-700 text-blue-300 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
            onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
          >
            <option>Suggestion</option>
            <option>Complaint</option>
            <option>Query</option>
          </select>
        </div>

        {/* Feedback Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-blue-300">Your Feedback</h3>
          <textarea
            className="w-full h-32 bg-gray-700 p-4 border border-blue-500 rounded-lg text-lg text-blue-300 resize-none focus:outline-none focus:ring-4 focus:ring-blue-400"
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
            className="bg-blue-500 text-gray-900 py-3 px-10 rounded-lg text-xl font-bold hover:bg-blue-600 transition duration-300 shadow-lg"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};
export default FeedbackForm;
