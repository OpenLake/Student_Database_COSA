import React, { useState, useEffect } from "react";
import { UserCheck, Calendar, BarChart3, Settings } from "lucide-react";
import axios from "axios";
import { AdminContext } from "../App";
const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
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

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [isAppointedByDropdownOpen, setIsAppointedByDropdownOpen] =
    useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersRes = await axios.get(`${API_BASE}/api/events/users`);
        setUsers(usersRes.data);
        setAppointingUsers(usersRes.data);

        // Fetch all positions
        const positionsRes = await axios.get(
          `${API_BASE}/api/positions/get-all`,
        );
        setPositions(positionsRes.data);
        console.log("Positions:", positionsRes.data);
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

  // Generate tenure year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const tenureYearOptions = [];
  for (let i = 2016; i <= currentYear + 1; i++) {
    tenureYearOptions.push(`${i}-${i + 1}`);
  }

  // Filter functions
  const filteredUsers = users.filter(
    (user) =>
      user.personal_info.name
        .toLowerCase()
        .includes(userSearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.user_id.toLowerCase().includes(userSearchTerm.toLowerCase()),
  );

  const filteredPositions = positions.filter(
    (position) =>
      position.title.toLowerCase().includes(positionSearchTerm.toLowerCase()) ||
      position.unit_id.name
        .toLowerCase()
        .includes(positionSearchTerm.toLowerCase()),
  );

  const filteredAppointingUsers = appointingUsers.filter(
    (user) =>
      user.personal_info.name
        .toLowerCase()
        .includes(appointedBySearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(appointedBySearchTerm.toLowerCase()),
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id) newErrors.user_id = "User selection is required";
    if (!formData.position_id)
      newErrors.position_id = "Position selection is required";
    if (!formData.tenure_year)
      newErrors.tenure_year = "Tenure year is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (
      formData.appointment_details.appointment_date &&
      !formData.appointment_details.appointed_by
    ) {
      newErrors.appointed_by =
        "Appointed by is required when appointment date is provided";
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      console.log("Form data:", formData);
      const cleanedData = {
        ...formData,
        appointment_details:
          formData.appointment_details.appointed_by ||
          formData.appointment_details.appointment_date
            ? formData.appointment_details
            : undefined,
        performance_metrics: {
          ...formData.performance_metrics,
          events_organized:
            formData.performance_metrics.events_organized === ""
              ? 0
              : parseInt(formData.performance_metrics.events_organized, 10),
          budget_utilized:
            formData.performance_metrics.budget_utilized === ""
              ? 0
              : parseFloat(formData.performance_metrics.budget_utilized),
          feedback: formData.performance_metrics.feedback.trim() || undefined,
        },
      };
      console.log("Cleaned data:", cleanedData);
      try {
        const response = await axios.post(
          `${API_BASE}/api/positions/add-position-holder`,
          cleanedData,
        );
        console.log("Position Holder form submitted:", response.data);
        alert("Position created successfully!");
        onClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to create position.");
      }
    }
  };

  // Helper functions to get selected items
  const selectedUser = users.find((user) => user._id === formData.user_id);
  const selectedPosition = positions.find(
    (position) => position._id === formData.position_id,
  );
  const selectedAppointedBy = appointingUsers.find(
    (user) => user._id === formData.appointment_details.appointed_by,
  );

  return (
    <div className="bg-white max-h-[90vh] overflow-y-auto px-4 py-4 rounded-lg">
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Add New Position
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Assignment Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-green-500" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Assignment Information
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Position Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Position <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        selectedPosition
                          ? `${selectedPosition.title} (${selectedPosition.unit_id.name})`
                          : positionSearchTerm
                      }
                      onChange={(e) => {
                        setPositionSearchTerm(e.target.value);
                        setIsPositionDropdownOpen(true);
                        if (!e.target.value) {
                          handleInputChange("position_id", "");
                        }
                      }}
                      onFocus={() => setIsPositionDropdownOpen(true)}
                      placeholder="Search for position by title or department"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                        errors.position_id
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {isPositionDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredPositions.map((position) => (
                          <div
                            key={position._id}
                            onClick={() => {
                              handleInputChange("position_id", position._id);
                              setPositionSearchTerm("");
                              setIsPositionDropdownOpen(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="font-medium">{position.title}</div>
                            <div className="text-sm text-gray-600">
                              {position.unit_id.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.position_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.position_id}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenure Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tenure_year}
                    onChange={(e) =>
                      handleInputChange("tenure_year", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                      errors.tenure_year ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select tenure year</option>
                    {tenureYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.tenure_year && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tenure_year}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Appointment Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    Optional appointment information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointed By
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        selectedAppointedBy
                          ? selectedAppointedBy.personal_info.name
                          : appointedBySearchTerm
                      }
                      onChange={(e) => {
                        setAppointedBySearchTerm(e.target.value);
                        setIsAppointedByDropdownOpen(true);
                        if (!e.target.value) {
                          handleNestedChange(
                            "appointment_details",
                            "appointed_by",
                            "",
                          );
                        }
                      }}
                      onFocus={() => setIsAppointedByDropdownOpen(true)}
                      placeholder="Search for appointing authority"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                        errors.appointed_by
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {isAppointedByDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredAppointingUsers.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => {
                              handleNestedChange(
                                "appointment_details",
                                "appointed_by",
                                user._id,
                              );
                              setAppointedBySearchTerm("");
                              setIsAppointedByDropdownOpen(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="font-medium">
                              {user.personal_info.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {user.username}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.appointed_by && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.appointed_by}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={formData.appointment_details.appointment_date}
                    onChange={(e) =>
                      handleNestedChange(
                        "appointment_details",
                        "appointment_date",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Performance Metrics
                  </h2>
                  <p className="text-sm text-gray-600">
                    Track performance indicators and feedback
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Events Organized
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.performance_metrics.events_organized}
                    onChange={(e) =>
                      handleNestedChange(
                        "performance_metrics",
                        "events_organized",
                        e.target.value,
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                      errors.events_organized
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.events_organized && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.events_organized}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Utilized (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.performance_metrics.budget_utilized}
                    onChange={(e) =>
                      handleNestedChange(
                        "performance_metrics",
                        "budget_utilized",
                        e.target.value,
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                      errors.budget_utilized
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.budget_utilized && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.budget_utilized}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Feedback
                </label>
                <textarea
                  value={formData.performance_metrics.feedback}
                  onChange={(e) =>
                    handleNestedChange(
                      "performance_metrics",
                      "feedback",
                      e.target.value,
                    )
                  }
                  placeholder="Provide performance feedback or notes..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-vertical"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none transition-colors"
              >
                Create Position Holder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPositionHolder;
