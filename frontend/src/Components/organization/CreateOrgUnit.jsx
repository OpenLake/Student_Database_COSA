import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Building2 } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import api from "../../utils/api";

// Define the initial empty state for the form so we can reset it later
const initialFormState = {
  name: "",
  type: "",
  description: "",
  parent_unit_id: "",
  hierarchy_level: 1,
  category: "",
  is_active: true,
  contact_info: {
    email: "",
    social_media: {},
  },
  budget_info: {
    allocated_budget: 0,
    spent_amount: 0,
  },
};

const CreateOrgUnit = () => {
  const navigate = useNavigate();
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const userRole = isUserLoggedIn ? isUserLoggedIn.role : "PRESIDENT";

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
      default:
        return "";
    }
  };

  const [formData, setFormData] = useState({
    ...initialFormState,
    category: getRoleCategory(userRole),
  });

  const [errors, setErrors] = useState({});
  const [availableParentUnits, setAvailableParentUnits] = useState([]);
  const [socialMediaFields, setSocialMediaFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchParentUnits = async () => {
      let url = `/api/orgUnit/organizational-units`;
      const category = getRoleCategory(userRole);
      if (userRole !== "PRESIDENT" && category) {
        url += `?category=${category}`;
      }
      try {
        const { data } = await api.get(url);
        setAvailableParentUnits(data);
      } catch (error) {
        console.error("Error fetching parent units:", error);
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
  };
  const removeSocialMediaField = (index) => {
    setSocialMediaFields(socialMediaFields.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required.";
    }
    if (!formData.type) {
      newErrors.type = "Organization type is required.";
    }
    if (userRole === "PRESIDENT" && !formData.category) {
      newErrors.category = "Category is required.";
    }
    if (!formData.hierarchy_level || formData.hierarchy_level < 1) {
      newErrors.hierarchy_level = "Hierarchy level must be at least 1.";
    }
    if (!formData.contact_info.email.trim()) {
      newErrors["contact_info.email"] = "Contact email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_info.email)) {
      newErrors["contact_info.email"] = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- FIXED handleSubmit function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    // This now correctly filters and keeps the array structure
    const validSocialMedia = socialMediaFields.filter(
      (field) => field.platform.trim() && field.url.trim(),
    );

    const dataToSubmit = {
      ...formData,
      contact_info: {
        ...formData.contact_info,
        social_media: validSocialMedia, // Send the correct array of objects
      },
    };

    try {
      await api.post(`/api/orgUnit/create`, dataToSubmit);
      alert("Organizational unit created successfully!");
      // Reset the form to its initial state
      setFormData({ ...initialFormState, category: getRoleCategory(userRole) });
      setSocialMediaFields([]);
      setErrors({});
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Themed Helper Components ---
  const inputStyles =
    "w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-black placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition";
  const labelStyles = "text-sm font-medium text-black";

  const RequiredLabel = ({ children }) => (
    <label className={labelStyles}>
      {children} <span className="text-red-500">*</span>
    </label>
  );
  const OptionalLabel = ({ children }) => (
    <label className={labelStyles}>{children}</label>
  );
  const ErrorMessage = ({ message }) =>
    message ? (
      <div className="flex items-center mt-1 text-xs text-red-600">
        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
        {message}
      </div>
    ) : null;

  return (
    <div className="w-full bg-white flex items-center justify-center px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl px-8 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
        {/* Form Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <RequiredLabel>Organization Name</RequiredLabel>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder="Enter organization name"
              />
              <ErrorMessage message={errors.name} />
            </div>
            <div>
              <RequiredLabel>Organization Type</RequiredLabel>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={inputStyles}
              >
                <option value="">Select type</option>
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
            {userRole === "PRESIDENT" ? (
              <div>
                <RequiredLabel>Category</RequiredLabel>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={inputStyles}
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <ErrorMessage message={errors.category} />
              </div>
            ) : (
              <div>
                <OptionalLabel>Category</OptionalLabel>
                <div className="w-full p-2 mt-1 bg-stone-100 border border-stone-200 rounded-lg text-black text-sm">
                  {getRoleCategory(userRole).replace(/\b\w/g, (l) =>
                    l.toUpperCase(),
                  )}{" "}
                  (Auto-assigned)
                </div>
              </div>
            )}
            <div>
              <OptionalLabel>Parent Organization</OptionalLabel>
              <select
                name="parent_unit_id"
                value={formData.parent_unit_id}
                onChange={handleInputChange}
                className={inputStyles}
              >
                <option value="">No parent</option>
                {availableParentUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name} ({unit.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <RequiredLabel>Hierarchy Level</RequiredLabel>
              <input
                type="number"
                name="hierarchy_level"
                value={formData.hierarchy_level}
                onChange={handleInputChange}
                min="1"
                className={inputStyles}
              />
              <ErrorMessage message={errors.hierarchy_level} />
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <OptionalLabel>Description</OptionalLabel>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={inputStyles}
                placeholder="Brief description of the organization..."
              />
            </div>
            <div>
              <RequiredLabel>Contact Email</RequiredLabel>
              <input
                type="email"
                name="contact_info.email"
                value={formData.contact_info.email}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder="contact@example.com"
              />
              <ErrorMessage message={errors["contact_info.email"]} />
            </div>
            <div>
              <OptionalLabel>Social Media Links</OptionalLabel>
              <div className="space-y-2">
                {socialMediaFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Platform"
                      value={field.platform}
                      onChange={(e) =>
                        updateSocialMediaField(
                          index,
                          "platform",
                          e.target.value,
                        )
                      }
                      className={inputStyles + " !mt-0"}
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={field.url}
                      onChange={(e) =>
                        updateSocialMediaField(index, "url", e.target.value)
                      }
                      className={inputStyles + " !mt-0"}
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialMediaField(index)}
                      className="p-2 text-black hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSocialMediaField}
                className="text-black font-medium text-sm mt-2 transition"
              >
                + Add Social Media
              </button>
            </div>
          </div>
        </div>
        {/* Budget & Status Section */}
        <div className="pt-4 border-t border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <OptionalLabel>Allocated Budget ($)</OptionalLabel>
              <input
                type="number"
                name="budget_info.allocated_budget"
                value={formData.budget_info.allocated_budget}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={inputStyles}
                placeholder="0.00"
              />
            </div>
            <div>
              <OptionalLabel>Spent Amount ($)</OptionalLabel>
              <input
                type="number"
                name="budget_info.spent_amount"
                value={formData.budget_info.spent_amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={inputStyles}
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-stone-300 text-black focus:ring-stone-600"
                />
                <span className="text-sm font-medium text-black">
                  Set as Active
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-5 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-stone-800 text-white py-2.5 px-4 rounded-lg hover:bg-stone-700 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:bg-stone-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Organization"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 px-4 rounded-lg border border-stone-300 text-black hover:bg-stone-100 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrgUnit;
