import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Building2, Mail, DollarSign, Users } from "lucide-react";
import { AdminContext } from "../context/AdminContext";
const CreateOrgUnit = () => {
  const navigate = useNavigate();
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const userRole = isUserLoggedIn ? isUserLoggedIn.role : "PRESIDENT";
  const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const getRoleCategory = (role) => {
    switch (role) {
      case "GENSEC_SCITECH":
        return "scitech";
      case "GENSEC_ACADEMIC":
        return "academic";
      case "GENSEC_CULTURAL":
        return "cultural";
      case "GENSEC_SPORTS":
        return "sports";
      case "PRESIDENT":
        return "";
      default:
        return "";
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    parent_unit_id: "",
    hierarchy_level: 1,
    category: getRoleCategory(userRole),
    is_active: true,
    contact_info: {
      email: "",
      social_media: {},
    },
    budget_info: {
      allocated_budget: 0,
      spent_amount: 0,
    },
  });

  const [errors, setErrors] = useState({});
  const [availableParentUnits, setAvailableParentUnits] = useState([]);
  const [socialMediaFields, setSocialMediaFields] = useState([]);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchParentUnits = async () => {
      setIsLoadingParents(true);
      setErrors((prev) => ({ ...prev, fetch: "" }));
      let url = `${API_BASE}/api/orgUnit/organizational-units`;
      const category = getRoleCategory(userRole);

      if (userRole !== "PRESIDENT" && category) {
        url += `?category=${category}`;
      }

      try {
        console.log(`Fetching parent units from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch parent units");
        }
        const data = await response.json();
        setAvailableParentUnits(data);
      } catch (error) {
        console.error("Error fetching parent units:", error);
        setErrors((prev) => ({
          ...prev,
          fetch: "Could not load parent organizations.",
        }));
      } finally {
        setIsLoadingParents(false);
      }
    };

    fetchParentUnits();
  }, [userRole]);

  const typeOptions = ["Council", "Club", "Committee", "independent_position"];
  const categoryOptions = [
    "cultural",
    "scitech",
    "sports",
    "academic",
    "independent",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addSocialMediaField = () => {
    setSocialMediaFields([...socialMediaFields, { platform: "", url: "" }]);
  };

  const updateSocialMediaField = (index, field, value) => {
    const updatedFields = [...socialMediaFields];
    updatedFields[index][field] = value;
    setSocialMediaFields(updatedFields);
    const validSocialMediaArray = updatedFields.filter(
      (field) => field.platform.trim() && field.url.trim(),
    );

    setFormData((prev) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        social_media: validSocialMediaArray,
      },
    }));
  };
  const removeSocialMediaField = (index) => {
    const updatedFields = socialMediaFields.filter((_, i) => i !== index);
    setSocialMediaFields(updatedFields);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Organization name is required";
    if (!formData.type) newErrors.type = "Organization type is required";

    // Category validation - only required for PRESIDENT role
    if (userRole === "PRESIDENT" && !formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.hierarchy_level || formData.hierarchy_level < 1) {
      newErrors.hierarchy_level = "Hierarchy level must be at least 1";
    }
    if (!formData.contact_info.email.trim()) {
      newErrors["contact_info.email"] = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_info.email)) {
      newErrors["contact_info.email"] = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    const validSocialMedia = socialMediaFields.filter(
      (field) => field.platform.trim() && field.url.trim(),
    );
    const dataToSubmit = {
      ...formData,
      contact_info: {
        ...formData.contact_info,
        social_media: validSocialMedia,
      },
    };
    try {
      const response = await fetch(`${API_BASE}/api/orgUnit/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred.");
      }
      alert("Organizational unit created successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors((prev) => ({ ...prev, submit: error.message }));
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const OptionalLabel = ({ children }) => (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {children} <span className="text-gray-400 text-xs">(Optional)</span>
    </label>
  );

  const ErrorMessage = ({ message }) =>
    message ? (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        {message}
      </div>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-white mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Create Organizational Unit
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Add a new organizational unit to the system
                  </p>
                </div>
              </div>
              <div className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full">
                <span className="text-blue-100 text-sm font-medium">
                  Role:{" "}
                  {userRole
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Basic Information
                  </h2>
                </div>

                {/* Organization Name */}
                <div>
                  <RequiredLabel>Organization Name</RequiredLabel>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter organization name"
                  />
                  <ErrorMessage message={errors.name} />
                </div>

                {/* Type */}
                <div>
                  <RequiredLabel>Organization Type</RequiredLabel>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select organization type</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage message={errors.type} />
                </div>

                {/* Category - Only show for PRESIDENT role */}
                {userRole === "PRESIDENT" ? (
                  <div>
                    <RequiredLabel>Category</RequiredLabel>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category.replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage message={errors.category} />
                  </div>
                ) : (
                  <div>
                    <OptionalLabel>Category</OptionalLabel>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                      {getRoleCategory(userRole).replace(/\b\w/g, (l) =>
                        l.toUpperCase(),
                      )}{" "}
                      (Auto-assigned based on your role)
                    </div>
                  </div>
                )}

                {/* Parent Unit */}
                <div>
                  <OptionalLabel>Parent Organization</OptionalLabel>
                  <select
                    name="parent_unit_id"
                    value={formData.parent_unit_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No parent organization</option>
                    {availableParentUnits.map((unit) => (
                      <option key={unit._id} value={unit._id}>
                        {unit.name} ({unit.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hierarchy Level */}
                <div>
                  <RequiredLabel>Hierarchy Level</RequiredLabel>
                  <input
                    type="number"
                    name="hierarchy_level"
                    value={formData.hierarchy_level}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ErrorMessage message={errors.hierarchy_level} />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher numbers indicate lower hierarchy levels
                  </p>
                </div>

                {/* Description */}
                <div>
                  <OptionalLabel>Description</OptionalLabel>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the organization's purpose and activities"
                  />
                </div>
              </div>

              {/* Right Column - Contact & Budget Information */}
              <div className="space-y-6">
                {/* Contact Information Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Contact Information
                  </h2>
                </div>

                {/* Email */}
                <div>
                  <RequiredLabel>Contact Email</RequiredLabel>
                  <input
                    type="email"
                    name="contact_info.email"
                    value={formData.contact_info.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="organization@example.com"
                  />
                  <ErrorMessage message={errors["contact_info.email"]} />
                </div>

                {/* Social Media */}
                <div>
                  <OptionalLabel>Social Media Links</OptionalLabel>
                  {socialMediaFields.map((field, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Platform (e.g., Facebook, Twitter)"
                        value={field.platform}
                        onChange={(e) =>
                          updateSocialMediaField(
                            index,
                            "platform",
                            e.target.value,
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={field.url}
                        onChange={(e) =>
                          updateSocialMediaField(index, "url", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialMediaField(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocialMediaField}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Social Media Link
                  </button>
                </div>

                {/* Budget Information Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Budget Information
                  </h2>
                </div>

                {/* Allocated Budget */}
                <div>
                  <OptionalLabel>Allocated Budget</OptionalLabel>
                  <input
                    type="number"
                    name="budget_info.allocated_budget"
                    value={formData.budget_info.allocated_budget}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                {/* Spent Amount */}
                <div>
                  <OptionalLabel>Spent Amount</OptionalLabel>
                  <input
                    type="number"
                    name="budget_info.spent_amount"
                    value={formData.budget_info.spent_amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                {/* Status */}
                <div>
                  <OptionalLabel>Status</OptionalLabel>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Active Organization
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateOrgUnit;
