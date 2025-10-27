import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { StarRating } from "./StarRating";
import { useFeedbackForm } from "../../hooks/useFeedback";

const FeedbackForm = () => {
  const { formData, filteredTargets, updateFormData, submitFeedback } =
    useFeedbackForm();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData({ [name]: type === "checkbox" ? checked : value });

    if (name === "target_type") {
      updateFormData({ target_id: "" }); // Reset target_id when target_type changes
    }
  };

  const handleTargetChange = (selectedOption) => {
    updateFormData({ target_id: selectedOption?.value || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitFeedback();
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      border: "2px solid black",
      borderRadius: "6px",
      minHeight: "48px",
      boxShadow: "none",
      "&:hover": { borderColor: "black" },
    }),
    placeholder: (base) => ({ ...base, color: "#6b7280", fontSize: "15px" }),
    singleValue: (base) => ({ ...base, fontSize: "15px", color: "black" }),
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
    <div className="bg-white px-8 py-2">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-3xl mx-auto rounded-lg">
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

          <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
            <div className="col-span-3">
              <label className="block text-sm font-medium text-black mb-1">
                Target ID <span className="text-red-600">*</span>
              </label>
              <Select
                options={filteredTargets}
                value={
                 filteredTargets.find((option) => option.value === formData.target_id) || null
                  }
                onChange={handleTargetChange}
                isClearable
                placeholder="Select target"
                styles={customSelectStyles}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black mb-1">
                Rating <span className="text-red-600">*</span>
              </label>
              <StarRating
                rating={parseInt(formData.rating) || 0}
                onRatingChange={(rating) =>
                  updateFormData({ rating: rating.toString() })
                }
              />
            </div>
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
