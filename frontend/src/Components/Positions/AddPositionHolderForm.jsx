import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Calendar, BarChart3, AlertCircle } from "lucide-react";
import api from "../../utils/api";
import { AdminContext } from "../../context/AdminContext";

// Initial empty state for resetting the form
const initialFormState = {
  user_id: "",
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
};

const GENSEC_CATEGORY_MAP = {
  GENSEC_SCITECH: "scitech",
  GENSEC_ACADEMIC: "academic",
  GENSEC_CULTURAL: "cultural",
  GENSEC_SPORTS: "sports",
};

const getUnitIdentifier = (unit) => {
  if (!unit) {
    return "";
  }
  if (typeof unit === "string") {
    return unit;
  }
  return unit._id || unit.unit_id || "";
};

const resolveUnitCategory = (unit, units) => {
  if (!unit) {
    return "";
  }
  if (typeof unit === "object" && unit.category) {
    return unit.category;
  }
  const unitId = getUnitIdentifier(unit);
  const match = units.find((item) => getUnitIdentifier(item) === unitId);
  return match?.category || "";
};

const resolveUnitName = (unit, units) => {
  if (!unit) {
    return "";
  }
  if (typeof unit === "object" && unit.name) {
    return unit.name;
  }
  const unitId = getUnitIdentifier(unit);
  const match = units.find((item) => getUnitIdentifier(item) === unitId);
  return match?.name || "";
};

const AddPositionHolderForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);

  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [units, setUnits] = useState([]);
  const [scopedPositions, setScopedPositions] = useState([]);
  const [appointingUsers, setAppointingUsers] = useState([]);

  const { isUserLoggedIn } = useContext(AdminContext);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [positionSearchTerm, setPositionSearchTerm] = useState("");
  const [appointedBySearchTerm, setAppointedBySearchTerm] = useState("");

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [isAppointedByDropdownOpen, setIsAppointedByDropdownOpen] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for closing dropdowns when clicking outside
  const userDropdownRef = useRef(null);
  const positionDropdownRef = useRef(null);
  const appointedByDropdownRef = useRef(null);

  useEffect(() => {
    if (!isUserLoggedIn) {
      setCurrentUserRole(null);
      setCurrentUserEmail("");
      return;
    }

    setCurrentUserRole(isUserLoggedIn.role || null);
    const email =
      isUserLoggedIn.personal_info?.email || isUserLoggedIn.username || "";
    setCurrentUserEmail(email);
  }, [isUserLoggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, positionsRes, unitsRes] = await Promise.all([
          api.get(`/api/events/users`),
          api.get(`/api/positions/get-all`),
          api.get(`/api/events/units`),
        ]);
        setUsers(usersRes.data);
        setAppointingUsers(usersRes.data);
        setPositions(positionsRes.data);
        setUnits(unitsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!positions.length) {
      setScopedPositions([]);
      return;
    }

    if (
      !currentUserRole ||
      currentUserRole === "PRESIDENT" ||
      currentUserRole === "STUDENT"
    ) {
      setScopedPositions(positions);
      return;
    }

    const targetCategory = GENSEC_CATEGORY_MAP[currentUserRole];
    if (targetCategory) {
      const filtered = positions.filter((position) => {
        const category = resolveUnitCategory(position.unit_id, units);
        return category && category.toLowerCase() === targetCategory;
      });
      setScopedPositions(filtered);
      return;
    }

    if (currentUserRole === "CLUB_COORDINATOR") {
      if (!currentUserEmail) {
        setScopedPositions([]);
        return;
      }

      const normalizedEmail = currentUserEmail.toLowerCase();
      const coordinatorUnit = units.find(
        (unit) => unit.contact_info?.email?.toLowerCase() === normalizedEmail,
      );

      if (!coordinatorUnit) {
        setScopedPositions([]);
        return;
      }

      const coordinatorUnitId = getUnitIdentifier(coordinatorUnit);
      const filtered = positions.filter(
        (position) => getUnitIdentifier(position.unit_id) === coordinatorUnitId,
      );
      setScopedPositions(filtered);
      return;
    }

    setScopedPositions(positions);
  }, [positions, units, currentUserRole, currentUserEmail]);

  useEffect(() => {
    if (!formData.position_id) {
      return;
    }
    const isStillAccessible = scopedPositions.some(
      (position) => position._id === formData.position_id,
    );
    if (!isStillAccessible) {
      setFormData((prev) => ({ ...prev, position_id: "" }));
    }
  }, [scopedPositions, formData.position_id]);

  // Effect to handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        positionDropdownRef.current &&
        !positionDropdownRef.current.contains(event.target)
      ) {
        setIsPositionDropdownOpen(false);
      }
      if (
        appointedByDropdownRef.current &&
        !appointedByDropdownRef.current.contains(event.target)
      ) {
        setIsAppointedByDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "terminated", label: "Terminated" },
  ];
  const currentYear = new Date().getFullYear();
  const tenureYearOptions = Array.from(
    { length: currentYear - 2015 },
    (_, i) => `${2016 + i}-${2017 + i}`,
  ).reverse();

  const filteredUsers = users.filter(
    (user) =>
      user.personal_info.name
        .toLowerCase()
        .includes(userSearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.user_id.toLowerCase().includes(userSearchTerm.toLowerCase()),
  );
  const filteredPositions = scopedPositions.filter((position) => {
    const searchTerm = positionSearchTerm.toLowerCase();
    const title = position.title || "";
    const titleMatch = title.toLowerCase().includes(searchTerm);
    const unitName = resolveUnitName(position.unit_id, units).toLowerCase();
    const unitMatch = unitName.includes(searchTerm);
    return titleMatch || unitMatch;
  });
  const filteredAppointingUsers = appointingUsers.filter(
    (user) =>
      user.personal_info.name
        .toLowerCase()
        .includes(appointedBySearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(appointedBySearchTerm.toLowerCase()),
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id) {
      newErrors.user_id = "User selection is required.";
    }
    if (!formData.position_id) {
      newErrors.position_id = "Position selection is required.";
    }
    if (!formData.tenure_year) {
      newErrors.tenure_year = "Tenure year is required.";
    }
    if (
      formData.appointment_details.appointment_date &&
      !formData.appointment_details.appointed_by
    ) {
      newErrors.appointed_by =
        "Appointed by is required when date is provided.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
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
          Number(formData.performance_metrics.events_organized) || 0,
        budget_utilized:
          Number(formData.performance_metrics.budget_utilized) || 0,
        feedback: formData.performance_metrics.feedback.trim() || undefined,
      },
    };

    try {
      await api.post(`/api/positions/add-position-holder`, cleanedData);
      alert("Position Holder created successfully!");
      setFormData(initialFormState); // Reset form
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create position holder.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedUser = users.find((user) => user._id === formData.user_id);
  const selectedPosition = scopedPositions.find(
    (position) => position._id === formData.position_id,
  );
  const selectedAppointedBy = appointingUsers.find(
    (user) => user._id === formData.appointment_details.appointed_by,
  );

  const inputStyles =
    "w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition";
  const labelStyles = "text-sm font-medium text-stone-600";
  const ErrorMessage = ({ message }) =>
    message ? (
      <div className="flex items-center mt-1 text-xs text-red-600">
        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
        {message}
      </div>
    ) : null;

  return (
    <div className="min-h-screen w-full bg-[#FDFAE2] flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-200 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">
            Add Position Holder
          </h2>
          <p className="text-stone-500 mt-1 text-sm">
            Assign users to organizational positions.
          </p>
        </div>

        {/* Section 1: Assignment Information */}
        <div className="pt-4 border-t border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={userDropdownRef} className="relative">
              <label className={labelStyles}>
                User <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={
                  selectedUser
                    ? `${selectedUser.personal_info.name} (${selectedUser.user_id})`
                    : userSearchTerm
                }
                onChange={(e) => {
                  setUserSearchTerm(e.target.value);
                  setIsUserDropdownOpen(true);
                  if (!e.target.value) {
                    handleInputChange("user_id", "");
                  }
                }}
                onFocus={() => setIsUserDropdownOpen(true)}
                placeholder="Search by name or ID"
                className={inputStyles}
              />
              {isUserDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          handleInputChange("user_id", user._id);
                          setUserSearchTerm("");
                          setIsUserDropdownOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-stone-100 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-stone-800">
                          {user.personal_info.name}
                        </div>
                        <div className="text-xs text-stone-500">
                          {user.username} • {user.user_id}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-stone-500">
                      No users found.
                    </div>
                  )}
                </div>
              )}
              <ErrorMessage message={errors.user_id} />
            </div>

            <div ref={positionDropdownRef} className="relative">
              <label className={labelStyles}>
                Position <span className="text-red-500">*</span>
              </label>
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
                placeholder="Search by title or unit"
                className={inputStyles}
              />
              {isPositionDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredPositions.length > 0 ? (
                    filteredPositions.map((pos) => (
                      <div
                        key={pos._id}
                        onClick={() => {
                          handleInputChange("position_id", pos._id);
                          setPositionSearchTerm("");
                          setIsPositionDropdownOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-stone-100 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-stone-800">
                          {pos.title}
                        </div>
                        <div className="text-xs text-stone-500">
                          {pos.unit_id.name}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-stone-500">
                      No positions found.
                    </div>
                  )}
                </div>
              )}
              <ErrorMessage message={errors.position_id} />
            </div>

            <div>
              <label className={labelStyles}>
                Tenure Year <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tenure_year}
                onChange={(e) =>
                  handleInputChange("tenure_year", e.target.value)
                }
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
        </div>

        {/* Section 2: Appointment Details */}
        <div className="pt-4 border-t border-stone-200">
          <h3 className="text-base font-semibold text-stone-700 mb-3">
            Appointment Details (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={appointedByDropdownRef} className="relative">
              <label className={labelStyles}>Appointed By</label>
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
                placeholder="Search for user"
                className={inputStyles}
              />
              {isAppointedByDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredAppointingUsers.length > 0 ? (
                    filteredAppointingUsers.map((user) => (
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
                        className="px-3 py-2 hover:bg-stone-100 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-stone-800">
                          {user.personal_info.name}
                        </div>
                        <div className="text-xs text-stone-500">
                          {user.username}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-stone-500">
                      No users found.
                    </div>
                  )}
                </div>
              )}
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
                    e.target.value,
                  )
                }
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Performance Metrics */}
        <div className="pt-4 border-t border-stone-200">
          <h3 className="text-base font-semibold text-stone-700 mb-3">
            Performance Metrics (Optional)
          </h3>
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
                    e.target.value,
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
                    e.target.value,
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
                    e.target.value,
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
