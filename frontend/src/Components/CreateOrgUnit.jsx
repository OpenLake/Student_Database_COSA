import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Building2 } from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

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
  const categoryOptions = ["cultural", "scitech", "sports", "academic", "independent"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === "checkbox" ? checked : value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
    if (!formData.name.trim()) {newErrors.name = "Organization name is required";}
    if (!formData.type) {newErrors.type = "Organization type is required";}
    if (userRole === "PRESIDENT" && !formData.category) {newErrors.category = "Category is required";}
    if (!formData.hierarchy_level || formData.hierarchy_level < 1) {newErrors.hierarchy_level = "Hierarchy level must be at least 1";}
    if (!formData.contact_info.email.trim()) {newErrors["contact_info.email"] = "Contact email is required";}
    else if (!/\S+@\S+\.\S+/.test(formData.contact_info.email)) {newErrors["contact_info.email"] = "Please enter a valid email address";}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {return;}
    setIsSubmitting(true);
    const validSocialMedia = socialMediaFields.filter(field => field.platform.trim() && field.url.trim());
    const dataToSubmit = { ...formData, contact_info: { ...formData.contact_info, social_media: validSocialMedia }};
    try {
      const res = await api.post(`/api/orgUnit/create`, dataToSubmit);
      alert("Organizational unit created successfully!");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-sm font-semibold text-yellow-900/80 mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const OptionalLabel = ({ children }) => (
    <label className="block text-sm font-semibold text-yellow-900/80 mb-1">
      {children}
    </label>
  );

  const ErrorMessage = ({ message }) =>
    message ? (
      <div className="flex items-center mt-1.5 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
        {message}
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-[#FEFDF7] py-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="bg-[#FDFAE2] rounded-xl border border-yellow-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 sm:px-8 border-b border-yellow-200/80">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <Building2 className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Create Organizational Unit
                  </h1>
                  <p className="text-gray-500 mt-1 text-sm">
                    Add a new organizational unit to the system
                  </p>
                </div>
              </div>
              <div className="bg-yellow-100/70 text-yellow-900/80 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-left sm:text-right">
                Role:{" "}
                {userRole
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <RequiredLabel>Organization Name</RequiredLabel>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" placeholder="Enter organization name" />
                  <ErrorMessage message={errors.name} />
                </div>
                <div>
                  <RequiredLabel>Organization Type</RequiredLabel>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition">
                    <option value="">Select type</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage message={errors.type} />
                </div>
                {userRole === "PRESIDENT" ? (
                  <div>
                    <RequiredLabel>Category</RequiredLabel>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition">
                      <option value="">Select category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>{cat.replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                      ))}
                    </select>
                    <ErrorMessage message={errors.category} />
                  </div>
                ) : (
                  <div>
                    <OptionalLabel>Category</OptionalLabel>
                    <div className="w-full px-3 py-2 bg-yellow-50/50 border border-yellow-300/30 rounded-lg text-gray-600 text-sm">
                      {getRoleCategory(userRole).replace(/\b\w/g, (l) => l.toUpperCase())} (Auto-assigned)
                    </div>
                  </div>
                )}
                <div>
                  <OptionalLabel>Parent Organization</OptionalLabel>
                  <select name="parent_unit_id" value={formData.parent_unit_id} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition">
                    <option value="">No parent</option>
                    {availableParentUnits.map((unit) => (
                      <option key={unit._id} value={unit._id}>{unit.name} ({unit.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <RequiredLabel>Hierarchy Level</RequiredLabel>
                  <input type="number" name="hierarchy_level" value={formData.hierarchy_level} onChange={handleInputChange} min="1" className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" />
                  <ErrorMessage message={errors.hierarchy_level} />
                </div>
                <div>
                  <OptionalLabel>Description</OptionalLabel>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" placeholder="Brief description of the organization..." />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <RequiredLabel>Contact Email</RequiredLabel>
                  <input type="email" name="contact_info.email" value={formData.contact_info.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" placeholder="contact@example.com" />
                  <ErrorMessage message={errors["contact_info.email"]} />
                </div>
                <div>
                  <OptionalLabel>Social Media Links</OptionalLabel>
                  <div className="space-y-2">
                    {socialMediaFields.map((field, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-2">
                        <input type="text" placeholder="Platform (e.g., Facebook)" value={field.platform} onChange={(e) => updateSocialMediaField(index, "platform", e.target.value)} className="flex-1 px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" />
                        <input type="url" placeholder="URL" value={field.url} onChange={(e) => updateSocialMediaField(index, "url", e.target.value)} className="flex-1 px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" />
                        <button type="button" onClick={() => removeSocialMediaField(index)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium">×</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addSocialMediaField} className="text-sky-600 hover:text-sky-800 text-sm font-semibold mt-2 transition">
                    + Add Social Media
                  </button>
                </div>
                <div className="space-y-6 border-t border-yellow-200/80 pt-6">
                    <div>
                        <OptionalLabel>Allocated Budget</OptionalLabel>
                        <input type="number" name="budget_info.allocated_budget" value={formData.budget_info.allocated_budget} onChange={handleInputChange} min="0" step="0.01" className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" placeholder="0.00" />
                    </div>
                     <div>
                        <OptionalLabel>Spent Amount</OptionalLabel>
                        <input type="number" name="budget_info.spent_amount" value={formData.budget_info.spent_amount} onChange={handleInputChange} min="0" step="0.01" className="w-full px-3 py-2 bg-white/50 border border-yellow-300/50 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" placeholder="0.00" />
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-4 h-4 text-sky-600 bg-yellow-100 border-yellow-300 rounded focus:ring-sky-500" />
                            <span className="text-sm font-medium text-gray-700">Active Organization</span>
                        </label>
                    </div>
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="mt-8 pt-6 border-t border-yellow-200/80">
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2.5 bg-[#23659C] text-white font-bold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#FDFAE2] disabled:bg-sky-300 disabled:cursor-not-allowed transition duration-200">
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </button>
                <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto px-6 py-2.5 bg-yellow-200/60 text-yellow-900 font-bold rounded-lg hover:bg-yellow-200/80 focus:outline-none transition duration-200">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOrgUnit;