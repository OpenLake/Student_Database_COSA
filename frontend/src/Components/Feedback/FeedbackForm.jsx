// Updated FeedbackForm with toast notifications
import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { AdminContext } from "../../App";
import toast, { Toaster } from "react-hot-toast";

const feedbackTypes = [
  "Suggestion",
  "Complaint",
  "General Feedback",
  "Query",
  "Appreciation",
  "Report",
  "Other",
];

const targetTypes = ["User", "Event", "Club/Organization", "POR"];
const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const FeedbackForm = () => {
  const [targetOptions, setTargetOptions] = useState({
    users: [],
    events: [],
    organizational_units: [],
    positions: [],
  });

  const [filteredTargets, setFilteredTargets] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    target_type: "",
    target_id: "",
    rating: "",
    comments: "",
    is_anonymous: false,
  });

  const { isUserLoggedIn } = useContext(AdminContext);

  useEffect(() => {
    axios.get(`${API_BASE}/api/feedback/get-targetid`).then((res) => {
      const { users, events, organizational_units, positions } = res.data;

      setTargetOptions({
        users: users.map((u) => ({
          label: `${u.name} - ${u.user_id}`,
          value: u._id,
          type: "User",
        })),
        events: events.map((e) => ({
          label: e.title,
          value: e._id,
          type: "Event",
        })),
        organizational_units: organizational_units.map((o) => ({
          label: o.name,
          value: o._id,
          type: "Club/Organization",
        })),
        positions: positions.map((p) => ({
          label: `${p.title} - ${p.unit}`,
          value: p._id,
          type: "POR",
        })),
      });
    });
  }, []);

  useEffect(() => {
    const { target_type } = formData;
    if (!target_type) {
      const all = [
        ...targetOptions.users,
        ...targetOptions.events,
        ...targetOptions.organizational_units,
        ...targetOptions.positions,
      ];
      setFilteredTargets(all);
    } else {
      const typeMap = {
        User: targetOptions.users,
        Event: targetOptions.events,
        "Club/Organization": targetOptions.organizational_units,
        POR: targetOptions.positions,
      };
      setFilteredTargets(typeMap[target_type] || []);
    }
  }, [formData.target_type, targetOptions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTargetChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      target_id: selectedOption?.value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        feedback_by: isUserLoggedIn._id,
      };
      if (!payload.rating) delete payload.rating;

      await axios.post(`${API_BASE}/api/feedback/add`, payload);
      toast.success("Feedback submitted successfully");
      setFormData({
        type: "",
        target_type: "",
        target_id: "",
        rating: "",
        comments: "",
        is_anonymous: false,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
    }
  };

  const StarRating = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-3xl transition-all"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star)}
          >
            <span
              className={`${
                star <= (hoverRating || rating) ? "text-black" : "text-gray-300"
              }`}
            >
              ★
            </span>
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating ? `${rating} out of 5` : "No rating selected"}
        </span>
      </div>
    );
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      border: "2px solid black",
      borderRadius: "6px",
      minHeight: "48px",
      boxShadow: "none",
      "&:hover": { borderColor: "black" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
      fontSize: "15px",
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "15px",
      color: "black",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f9fafb" : "#fff",
      color: "#111827",
      fontSize: "15px",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      border: "1px solid #ccc",
      borderRadius: "6px",
    }),
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-xl mx-auto border border-black rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black">
            Student Feedback Form
          </h2>
          <p className="text-gray-600 mt-2">
            Your feedback helps us improve our services and overall COSA.
          </p>
          <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Feedback Type <span className="text-red-600">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
                required
              >
                <option value="">Select feedback type</option>
                {feedbackTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Target Type <span className="text-red-600">*</span>
              </label>
              <select
                name="target_type"
                value={formData.target_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
                required
              >
                <option value="">Select target type</option>
                {targetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Target ID <span className="text-red-600">*</span>
            </label>
            <Select
              options={filteredTargets}
              onChange={handleTargetChange}
              isClearable
              placeholder="Select target"
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Rating <span className="text-red-600">*</span>
            </label>
            <StarRating
              rating={parseInt(formData.rating) || 0}
              onRatingChange={(rating) =>
                setFormData((prev) => ({
                  ...prev,
                  rating: rating.toString(),
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Comments <span className="text-red-600">*</span>
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={4}
              placeholder="Please provide detailed feedback or comments..."
              className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none resize-none"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_anonymous"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-black rounded text-black focus:ring-0"
            />
            <label htmlFor="is_anonymous" className="ml-3 text-sm text-black">
              Submit feedback anonymously
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-white hover:text-black border-2 border-black transition-all duration-200"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
