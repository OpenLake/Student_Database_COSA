import React, { useState } from "react";
//import axios from "axios";
//import { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../App";

const FeedbackForm = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [feedback, setFeedback] = useState({
    type: "Suggestion",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!IsUserLoggedIn) {
    // alert("You need to log in to submit feedback.");
    //return;
    //}
    const response = await fetch("http://localhost:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...feedback, userId: "test123" }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-700 via-blue-600 to-green-800 p-6">
      <form className="bg-green-900 shadow-2xl rounded-xl p-8 w-full max-w-2xl flex flex-col gap-6 border border-green-400">
        {/* Exciting Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-lime-400 drop-shadow-lg">
            🌟 Share Your Feedback 🌟
          </h2>
          <p className="text-lime-300 text-lg font-medium mt-2">
            Your feedback helps us improve! Let us know your thoughts.
          </p>
        </div>

        {/* Feedback Type Dropdown */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-lime-300">Feedback Type</h3>
          <select
            className="w-full p-3 border border-lime-500 rounded-lg bg-green-800 text-lime-300 text-lg focus:outline-none focus:ring-4 focus:ring-lime-400"
            onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
          >
            <option>Suggestion</option>
            <option>Complaint</option>
            <option>Query</option>
          </select>
        </div>

        {/* Feedback Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-lime-300">Your Feedback</h3>
          <textarea
            className="w-full h-32 bg-green-800 p-4 border border-lime-500 rounded-lg text-lg text-lime-300 resize-none focus:outline-none focus:ring-4 focus:ring-lime-400"
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
            className="bg-lime-500 text-green-900 py-3 px-10 rounded-lg text-xl font-bold hover:bg-lime-600 transition duration-300 shadow-lg"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
