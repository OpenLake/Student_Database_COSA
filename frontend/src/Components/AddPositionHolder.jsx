import React, { useState, useEffect } from "react";
import { UserCheck, Calendar, BarChart3 } from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

const AddPositionHolder = ({ onClose }) => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [formData, setFormData] = useState({
    user_id: isUserLoggedIn._id,
    position_id: "",
    tenure_year: "",
    appointment_details: {
      appointed_by: "",
      appointment_date: "",
    },
    performance_metrics: {
      events_organized: "",
      budget_utilized: "",
      feedback: "",
    },
    status: "active",
  });

  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [appointingUsers, setAppointingUsers] = useState([]);

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [positionSearchTerm, setPositionSearchTerm] = useState("");
  const [appointedBySearchTerm, setAppointedBySearchTerm] = useState("");

  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [isAppointedByDropdownOpen, setIsAppointedByDropdownOpen] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get(`/api/events/users`);
        setUsers(usersRes.data);
        setAppointingUsers(usersRes.data);

        const positionsRes = await api.get(`/api/positions/get-all`);
        setPositions(positionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "terminated", label: "Terminated" },
  ];

  const currentYear = new Date().getFullYear();
  const tenureYearOptions = [];
  for (let i = 2016; i <= currentYear + 1; i++) {
    tenureYearOptions.push(`${i}-${i + 1}`);
  }

  const filteredPositions = positions.filter(
    (position) =>
      position.title.toLowerCase().includes(positionSearchTerm.toLowerCase()) ||
      position.unit_id.name.toLowerCase().includes(positionSearchTerm.toLowerCase())
  );

  const filteredAppointingUsers = appointingUsers.filter(
    (user) =>
      user.personal_info.name.toLowerCase().includes(appointedBySearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(appointedBySearchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id) newErrors.user_id = "User selection is required";
    if (!formData.position_id) newErrors.position_id = "Position selection is required";
    if (!formData.tenure_year) newErrors.tenure_year = "Tenure year is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (formData.appointment_details.appointment_date && !formData.appointment_details.appointed_by) {
      newErrors.appointed_by = "Appointed by is required when appointment date is provided";
    }
    if (formData.performance_metrics.events_organized < 0) {
      newErrors.events_organized = "Events organized cannot be negative";
    }
    if (formData.performance_metrics.budget_utilized < 0) {
      newErrors.budget_utilized = "Budget utilized cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const cleanedData = {
          ...formData,
          appointment_details:
            formData.appointment_details.appointed_by || formData.appointment_details.appointment_date
              ? formData.appointment_details
              : undefined,
          performance_metrics: {
            ...formData.performance_metrics,
            events_organized: formData.performance_metrics.events_organized === "" ? 0 : parseInt(formData.performance_metrics.events_organized, 10),
            budget_utilized: formData.performance_metrics.budget_utilized === "" ? 0 : parseFloat(formData.performance_metrics.budget_utilized),
            feedback: formData.performance_metrics.feedback.trim() || undefined,
          },
        };
        const response = await api.post(`/api/positions/add-position-holder`, cleanedData);
        alert("Position created successfully!");
        onClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to create position.");
      }
    }
  };

  const selectedPosition = positions.find((p) => p._id === formData.position_id);
  const selectedAppointedBy = appointingUsers.find((u) => u._id === formData.appointment_details.appointed_by);

  return (
    <div className="bg-white max-h-[90vh] overflow-y-auto px-5 py-6 rounded-xl shadow-md border border-[#E4D8C3]">
      <div className="bg-white rounded-xl [#EADCCB]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EADCCB] bg-[#FAF6EF] flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-black">Add New Position</h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Assignment Information */}
          <SectionHeader icon={UserCheck} title="Assignment Information" />

          {/* Position */}
          <div className="space-y-4">
            <InputLabel text="Select Position" required />
            <SearchDropdown
              value={
                selectedPosition
                  ? `${selectedPosition.title} (${selectedPosition.unit_id.name})`
                  : positionSearchTerm
              }
              onChange={(e) => {
                setPositionSearchTerm(e.target.value);
                setIsPositionDropdownOpen(true);
                if (!e.target.value) handleInputChange("position_id", "");
              }}
              isOpen={isPositionDropdownOpen}
              setIsOpen={setIsPositionDropdownOpen}
              filteredItems={filteredPositions}
              onSelect={(position) => {
                handleInputChange("position_id", position._id);
                setPositionSearchTerm("");
                setIsPositionDropdownOpen(false);
              }}
              displayFn={(p) => `${p.title} — ${p.unit_id.name}`}
              error={errors.position_id}
            />

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Tenure Year"
                value={formData.tenure_year}
                options={tenureYearOptions}
                onChange={(e) => handleInputChange("tenure_year", e.target.value)}
                error={errors.tenure_year}
              />
              <SelectField
                label="Status"
                value={formData.status}
                options={statusOptions.map((s) => s.label)}
                values={statusOptions.map((s) => s.value)}
                onChange={(e) => handleInputChange("status", e.target.value)}
              />
            </div>
          </div>

          {/* Appointment Details */}
          <SectionHeader icon={Calendar} title="Appointment Details" subtitle="Optional appointment info" />

          <div className="grid grid-cols-2 gap-4">
            <SearchDropdown
              label="Appointed By"
              value={selectedAppointedBy ? selectedAppointedBy.personal_info.name : appointedBySearchTerm}
              onChange={(e) => {
                setAppointedBySearchTerm(e.target.value);
                setIsAppointedByDropdownOpen(true);
                if (!e.target.value) handleNestedChange("appointment_details", "appointed_by", "");
              }}
              isOpen={isAppointedByDropdownOpen}
              setIsOpen={setIsAppointedByDropdownOpen}
              filteredItems={filteredAppointingUsers}
              onSelect={(user) => {
                handleNestedChange("appointment_details", "appointed_by", user._id);
                setAppointedBySearchTerm("");
                setIsAppointedByDropdownOpen(false);
              }}
              displayFn={(u) => `${u.personal_info.name} (${u.username})`}
              error={errors.appointed_by}
            />
            <InputField
              label="Appointment Date"
              type="date"
              value={formData.appointment_details.appointment_date}
              onChange={(e) => handleNestedChange("appointment_details", "appointment_date", e.target.value)}
            />
          </div>

          {/* Performance Metrics */}
          <SectionHeader icon={BarChart3} title="Performance Metrics" subtitle="Track indicators and feedback" />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Events Organized"
              type="number"
              min="0"
              value={formData.performance_metrics.events_organized}
              onChange={(e) => handleNestedChange("performance_metrics", "events_organized", e.target.value)}
              error={errors.events_organized}
            />
            <InputField
              label="Budget Utilized (₹)"
              type="number"
              min="0"
              step="0.01"
              value={formData.performance_metrics.budget_utilized}
              onChange={(e) => handleNestedChange("performance_metrics", "budget_utilized", e.target.value)}
              error={errors.budget_utilized}
            />
          </div>

          <div>
            <InputLabel text="Performance Feedback" />
            <textarea
              value={formData.performance_metrics.feedback}
              onChange={(e) => handleNestedChange("performance_metrics", "feedback", e.target.value)}
              placeholder="Provide performance feedback..."
              rows={4}
              className="w-full px-3 py-2 border border-[#E4D8C3] rounded-lg bg-[#FDF9F3] text-black focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div className="pt-6 border-t border-[#EADCCB]">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-[#856A5D] focus:ring-2 focus:ring-black focus:ring-offset-2 outline-none transition-all"
            >
              Create Position Holder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-5 h-5 text-black mt-1" />
    <div>
      <h2 className="text-base font-semibold text-black">{title}</h2>
      {subtitle && <p className="text-sm text-black">{subtitle}</p>}
    </div>
  </div>
);

const InputLabel = ({ text, required }) => (
  <label className="block text-sm font-medium text-black mb-1">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

const InputField = ({ label, error, ...props }) => (
  <div>
    {label && <InputLabel text={label} />}
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg bg-[#FDF9F3] text-black focus:ring-2 focus:ring-black outline-none ${
        error ? "border-red-300" : "border-[#E4D8C3]"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, options, values, value, onChange, error }) => (
  <div>
    {label && <InputLabel text={label} required />}
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg bg-[#FDF9F3] text-black focus:ring-2 focus:ring-black outline-none ${
        error ? "border-red-300" : "border-[#E4D8C3]"
      }`}
    >
      <option value="">Select...</option>
      {options.map((opt, idx) => (
        <option key={idx} value={values ? values[idx] : opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SearchDropdown = ({
  label,
  value,
  onChange,
  isOpen,
  setIsOpen,
  filteredItems,
  onSelect,
  displayFn,
  error,
}) => (
  <div className="relative">
    {label && <InputLabel text={label} />}
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={() => setIsOpen(true)}
      placeholder="Search..."
      className={`w-full px-3 py-2 border rounded-lg bg-[#FDF9F3] text-black focus:ring-2 focus:ring-black outline-none ${
        error ? "border-red-300" : "border-[#E4D8C3]"
      }`}
    />
    {isOpen && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-[#E4D8C3] rounded-lg shadow-lg max-h-40 overflow-y-auto">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => onSelect(item)}
            className="px-3 py-2 hover:bg-[#FAF6EF] cursor-pointer text-black"
          >
            {displayFn(item)}
          </div>
        ))}
      </div>
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AddPositionHolder;
