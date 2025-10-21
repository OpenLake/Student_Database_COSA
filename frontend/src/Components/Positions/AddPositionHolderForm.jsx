import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { usePositionHolderForm } from "../../hooks/usePositionHolders";
import { ErrorMessage } from "./PositionCard";

const AddPositionHolderForm = () => {
  const navigate = useNavigate();
  const { isUserLoggedIn } = useContext(AdminContext);

  const {
    formData,
    setFormData,
    users,
    positions,
    errors,
    isSubmitting,
    handleSubmit,
  } = usePositionHolderForm(isUserLoggedIn);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "terminated", label: "Terminated" },
  ];

  const currentYear = new Date().getFullYear();
  const tenureYearOptions = Array.from(
    { length: currentYear - 2015 },
    (_, i) => `${2016 + i}-${2017 + i}`
  ).reverse();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const inputStyles =
    "w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition";
  const labelStyles = "text-sm font-medium text-stone-600";

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full px-8 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
        {/* Section 1: Assignment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>
              User <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.user_id}
              onChange={(e) => handleInputChange("user_id", e.target.value)}
              className={inputStyles}
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.personal_info?.name} ({user.user_id})
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.user_id} />
          </div>

          <div>
            <label className={labelStyles}>
              Position <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.position_id}
              onChange={(e) => handleInputChange("position_id", e.target.value)}
              className={inputStyles}
            >
              <option value="">Select position</option>
              {positions.map((pos) => (
                <option key={pos._id} value={pos._id}>
                  {pos.title} ({pos.unit_id?.name})
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.position_id} />
          </div>

          <div>
            <label className={labelStyles}>
              Tenure Year <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tenure_year}
              onChange={(e) => handleInputChange("tenure_year", e.target.value)}
              className={inputStyles}
            >
              <option value="">Select year</option>
              {tenureYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.tenure_year} />
          </div>

          <div>
            <label className={labelStyles}>
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className={inputStyles}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Appointment Details */}
        <div className="pt-4 border-t border-stone-200">
          <div className="text-lg font-semibold text-stone-700 mb-3">
            Appointment Details (Optional)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Appointed By</label>
              <select
                value={formData.appointment_details.appointed_by}
                onChange={(e) =>
                  handleNestedChange(
                    "appointment_details",
                    "appointed_by",
                    e.target.value
                  )
                }
                className={inputStyles}
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.personal_info?.name}
                  </option>
                ))}
              </select>
              <ErrorMessage message={errors.appointed_by} />
            </div>
            <div>
              <label className={labelStyles}>Appointment Date</label>
              <input
                type="date"
                value={formData.appointment_details.appointment_date}
                onChange={(e) =>
                  handleNestedChange(
                    "appointment_details",
                    "appointment_date",
                    e.target.value
                  )
                }
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Performance Metrics */}
        <div className="pt-4 border-t border-stone-200">
          <div className="text-lg font-semibold text-stone-700 mb-3">
            Performance Metrics (Optional)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Events Organized</label>
              <input
                type="number"
                min="0"
                value={formData.performance_metrics.events_organized}
                onChange={(e) =>
                  handleNestedChange(
                    "performance_metrics",
                    "events_organized",
                    e.target.value
                  )
                }
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>Budget Utilized (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.performance_metrics.budget_utilized}
                onChange={(e) =>
                  handleNestedChange(
                    "performance_metrics",
                    "budget_utilized",
                    e.target.value
                  )
                }
                className={inputStyles}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyles}>Performance Feedback</label>
              <textarea
                value={formData.performance_metrics.feedback}
                onChange={(e) =>
                  handleNestedChange(
                    "performance_metrics",
                    "feedback",
                    e.target.value
                  )
                }
                placeholder="Provide feedback or notes..."
                rows={3}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-5 flex flex-col sm:flex-row gap-4 border-t border-stone-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-stone-800 text-white py-2.5 px-4 rounded-lg hover:bg-stone-700 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:bg-stone-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Create Position Holder"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPositionHolderForm;