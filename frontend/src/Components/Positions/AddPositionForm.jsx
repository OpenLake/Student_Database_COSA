import React, { useState, useEffect } from "react";
import { Plus, X, FileText, Users, BookOpen } from "lucide-react";
import api from "../../utils/api";
const AddPositionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    unit_id: "",
    position_type: "",
    custom_position_type: "",
    responsibilities: [""],
    requirements: {
      min_cgpa: 0,
      min_year: 1,
      skills_required: [""],
    },
    description: "",
    position_count: 1,
  });

  const [units, setUnits] = useState([]);
  const [unitSearchTerm, setUnitSearchTerm] = useState("");
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await api.get(`/api/events/units`);
        setUnits(res.data);
      } catch (error) {
        console.error("Failed to fetch organizational units:", error);
      }
    };

    fetchUnits();
  }, []);

  const positionTypes = [
    "Core Member",
    "Member",
    "Team Lead",
    "Coordinator",
    "Volunteer",
    "Intern",
    "Other",
  ];

  const yearOptions = [
    { value: 1, label: "1st Year" },
    { value: 2, label: "2nd Year" },
    { value: 3, label: "3rd Year" },
    { value: 4, label: "4th Year" },
  ];

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(unitSearchTerm.toLowerCase()),
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Position title is required";
    if (!formData.unit_id)
      newErrors.unit_id = "Organizational unit is required";
    if (!formData.position_type)
      newErrors.position_type = "Position type is required";
    if (formData.responsibilities.filter((r) => r.trim()).length === 0) {
      newErrors.responsibilities = "At least one responsibility is required";
    }
    if (
      formData.requirements.min_cgpa < 0 ||
      formData.requirements.min_cgpa > 10
    ) {
      newErrors.min_cgpa = "CGPA must be between 0 and 10";
    }
    if (!formData.position_count || formData.position_count < 1) {
      newErrors.position_count = "Position count must be at least 1";
    }
    if (
      formData.position_type === "Other" &&
      !formData.custom_position_type.trim()
    ) {
      newErrors.custom_position_type = "Please specify the position type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleRequirementChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value,
      },
    }));
  };

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const updateResponsibility = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) =>
        i === index ? value : resp,
      ),
    }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills_required: [...prev.requirements.skills_required, ""],
      },
    }));
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills_required: prev.requirements.skills_required.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const updateSkill = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills_required: prev.requirements.skills_required.map((skill, i) =>
          i === index ? value : skill,
        ),
      },
    }));
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        position_type:
          formData.position_type === "Other"
            ? formData.custom_position_type
            : formData.position_type,
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        requirements: {
          ...formData.requirements,
          skills_required: formData.requirements.skills_required.filter((s) =>
            s.trim(),
          ),
        },
      };

      try {
        const res = await api.post(`/api/positions/add-position`, cleanedData);
        console.log("Position created:", res.data);
        alert("Position created successfully!");

        // Optional: Reset form or redirect
        setFormData({
          title: "",
          unit_id: "",
          position_type: "",
          custom_position_type: "",
          responsibilities: [""],
          requirements: {
            min_cgpa: 0,
            min_year: 1,
            skills_required: [""],
          },
          description: "",
          position_count: 1,
        });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to create position. Please try again.";
        console.error("Error creating position:", message);
        alert(message);
      }
    }
  };

  const selectedUnit = units.find((unit) => unit._id === formData.unit_id);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Add New Position
                </h1>
                <p className="text-sm text-gray-600">
                  Create and define new organizational positions with detailed
                  requirements and responsibilities.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Essential details about the position
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Member"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.title ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizational Unit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedUnit ? selectedUnit.name : unitSearchTerm}
                      onChange={(e) => {
                        setUnitSearchTerm(e.target.value);
                        setIsUnitDropdownOpen(true);
                        if (!e.target.value) {
                          handleInputChange("unit_id", "");
                        }
                      }}
                      onFocus={() => setIsUnitDropdownOpen(true)}
                      placeholder="Select organizational unit"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        errors.unit_id ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {isUnitDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredUnits.map((unit) => (
                          <div
                            key={unit._id}
                            onClick={() => {
                              handleInputChange("unit_id", unit._id);
                              setUnitSearchTerm("");
                              setIsUnitDropdownOpen(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {unit.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.unit_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unit_id}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.position_type}
                    onChange={(e) =>
                      handleInputChange("position_type", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.position_type
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select position type</option>
                    {positionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {formData.position_type === "Other" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specify Position Type{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.custom_position_type}
                        onChange={(e) =>
                          handleInputChange(
                            "custom_position_type",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Research Assistant"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          errors.custom_position_type
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.custom_position_type && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.custom_position_type}
                        </p>
                      )}
                    </div>
                  )}

                  {errors.position_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.position_type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Positions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.position_count}
                    onChange={(e) =>
                      handleInputChange(
                        "position_count",
                        parseInt(e.target.value),
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.position_count
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.position_count && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.position_count}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Provide a detailed description of the position..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-500" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Responsibilities
                  </h2>
                  <p className="text-sm text-gray-600">
                    Define key responsibilities for this position
                  </p>
                </div>
              </div>

              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={responsibility}
                    onChange={(e) =>
                      updateResponsibility(index, e.target.value)
                    }
                    placeholder={`Responsibility ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="px-3 py-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addResponsibility}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Responsibility
              </button>
              {errors.responsibilities && (
                <p className="text-red-500 text-sm">
                  {errors.responsibilities}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-500" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Requirements
                  </h2>
                  <p className="text-sm text-gray-600">
                    Specify the qualifications and skills needed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.requirements.min_cgpa}
                    onChange={(e) =>
                      handleRequirementChange(
                        "min_cgpa",
                        parseFloat(e.target.value),
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.min_cgpa ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.min_cgpa && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.min_cgpa}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Year of Study
                  </label>
                  <select
                    value={formData.requirements.min_year}
                    onChange={(e) =>
                      handleRequirementChange(
                        "min_year",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {yearOptions.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                {formData.requirements.skills_required.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {formData.requirements.skills_required.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="px-3 py-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {index ===
                      formData.requirements.skills_required.length - 1 && (
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-colors"
              >
                Create Position
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPositionForm;
