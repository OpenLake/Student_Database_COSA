import React, { useState } from "react";
import { Star, Send, AlertCircle } from "lucide-react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    target_id: "",
    target_type: "",
    rating: 0,
    comments: "",
    is_anonymous: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const feedbackTypes = [
    "Suggestion",
    "Complaint",
    "General Feedback",
    "Query",
    "Appreciation",
    "Report",
    "Other",
  ];

  const targetTypes = ["User", "Event", "Club/Organization", "System"];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Feedback type is required";
    }

    if (!formData.target_id.trim()) {
      newErrors.target_id = "Target ID is required";
    }

    if (!formData.target_type) {
      newErrors.target_type = "Target type is required";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Rating is required";
    }

    if (!formData.comments.trim()) {
      newErrors.comments = "Comments are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the data to your backend
      console.log("Feedback submitted:", formData);

      // Reset form after successful submission
      setFormData({
        type: "",
        target_id: "",
        target_type: "",
        rating: 0,
        comments: "",
        is_anonymous: false,
      });

      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-2 border-black rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Student Feedback Form
            </h1>
            <p className="text-gray-600">
              Your feedback helps us improve our services and quality of
              education
            </p>
            <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
          </div>

          <div className="space-y-6">
            {/* Feedback Type and Target Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Feedback Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${errors.type ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-black`}
                >
                  <option value="">Select feedback type</option>
                  {feedbackTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.type}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="target_type"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Target Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="target_type"
                  name="target_type"
                  value={formData.target_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${errors.target_type ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-black`}
                >
                  <option value="">Select target type</option>
                  {targetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.target_type && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.target_type}
                  </div>
                )}
              </div>
            </div>

            {/* Target ID */}
            <div>
              <label
                htmlFor="target_id"
                className="block text-sm font-semibold text-black mb-2"
              >
                Target ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="target_id"
                name="target_id"
                value={formData.target_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${errors.target_id ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-black placeholder-gray-500`}
                placeholder="Enter target object ID"
              />
              {errors.target_id && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.target_id}
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Rating <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-colors duration-150"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || formData.rating)
                          ? "fill-black text-black"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating > 0
                    ? `${formData.rating} out of 5`
                    : "No rating selected"}
                </span>
              </div>
              {errors.rating && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rating}
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-semibold text-black mb-2"
              >
                Comments <span className="text-red-600">*</span>
              </label>
              <textarea
                id="comments"
                name="comments"
                rows={5}
                value={formData.comments}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${errors.comments ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-black placeholder-gray-500 resize-vertical`}
                placeholder="Please provide detailed feedback or comments..."
              />
              {errors.comments && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.comments}
                </div>
              )}
            </div>

            {/* Anonymous Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_anonymous"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleInputChange}
                className="w-5 h-5 border-2 border-black rounded focus:ring-2 focus:ring-gray-400 text-black bg-white"
              />
              <label
                htmlFor="is_anonymous"
                className="ml-3 text-sm font-medium text-black"
              >
                Submit feedback anonymously
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center px-8 py-4 border-2 border-black text-white font-semibold rounded-md transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-white hover:text-black"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
