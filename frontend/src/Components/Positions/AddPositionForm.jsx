import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, AlertCircle } from "lucide-react";
import api from "../../utils/api";

// --- STABLE HELPER COMPONENTS & CONSTANTS (MOVED OUTSIDE) ---

const initialFormState = {
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
};

const inputStyles = "w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition";
const labelStyles = "text-sm font-medium text-stone-600";

const ErrorMessage = ({ message }) => message ? ( <div className="flex items-center mt-1 text-xs text-red-600"><AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />{message}</div>) : null;
  
const DynamicFieldArray = ({ label, array, onUpdate, onRemove, onAdd, error }) => (
    <div>
        <label className={labelStyles}>{label} <span className="text-red-500">*</span></label>
        {array.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
                <input type="text" value={item} onChange={(e) => onUpdate(index, e.target.value)} className={inputStyles + " !mt-0 flex-grow"} placeholder={`${label.slice(0,-1)} #${index + 1}`} />
                {array.length > 1 && (
                    <button type="button" onClick={() => onRemove(index)} className="p-2 text-stone-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                        <X size={16} />
                    </button>
                )}
            </div>
        ))}
        <button type="button" onClick={onAdd} className="text-stone-600 hover:text-stone-800 font-medium text-sm mt-2 transition flex items-center gap-1">
            <Plus size={14} /> Add {label.slice(0,-1)}
        </button>
        <ErrorMessage message={error} />
    </div>
);

// --- MAIN COMPONENT ---

const AddPositionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);

  const [units, setUnits] = useState([]);
  const [unitSearchTerm, setUnitSearchTerm] = useState("");
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unitDropdownRef = useRef(null);

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
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target)) {
        setIsUnitDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const positionTypes = ["Core Member", "Member", "Team Lead", "Coordinator", "Volunteer", "Intern", "Other"];
  const yearOptions = [{ value: 1, label: "1st Year" }, { value: 2, label: "2nd Year" }, { value: 3, label: "3rd Year" }, { value: 4, label: "4th Year" }];

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(unitSearchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Position title is required.";
    if (!formData.unit_id) newErrors.unit_id = "Organizational unit is required.";
    if (!formData.position_type) newErrors.position_type = "Position type is required.";
    if (formData.position_type === "Other" && !formData.custom_position_type.trim()) newErrors.custom_position_type = "Please specify the position type.";
    if (formData.responsibilities.every(r => r.trim() === "")) newErrors.responsibilities = "At least one responsibility is required.";
    if (!formData.position_count || formData.position_count < 1) newErrors.position_count = "Position count must be at least 1.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleRequirementChange = (field, value) => {
    setFormData((prev) => ({ ...prev, requirements: { ...prev.requirements, [field]: value }}));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => {
        const updatedArray = [...prev[arrayName]];
        updatedArray[index] = value;
        return { ...prev, [arrayName]: updatedArray };
    });
  };

  const addToArray = (arrayName) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], ""] }));
  };

  const removeFromArray = (arrayName, index) => {
    setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
  };

  const handleSkillsChange = (index, value) => {
    setFormData(prev => {
        const updatedSkills = [...prev.requirements.skills_required];
        updatedSkills[index] = value;
        return { ...prev, requirements: { ...prev.requirements, skills_required: updatedSkills }};
    });
  };
  
  const addSkill = () => {
    handleRequirementChange("skills_required", [...formData.requirements.skills_required, ""]);
  };
  
  const removeSkill = (index) => {
    handleRequirementChange("skills_required", formData.requirements.skills_required.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const cleanedData = {
      ...formData,
      position_type: formData.position_type === "Other" ? formData.custom_position_type : formData.position_type,
      responsibilities: formData.responsibilities.filter((r) => r.trim()),
      requirements: {
        ...formData.requirements,
        skills_required: formData.requirements.skills_required.filter((s) => s.trim()),
      },
    };

    try {
      await api.post(`/api/positions/add-position`, cleanedData);
      alert("Position created successfully!");
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create position.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const selectedUnit = units.find((unit) => unit._id === formData.unit_id);

  return (
    <div className="min-h-screen w-full bg-[#FDFAE2] flex items-center justify-center p-4 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-200 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">Add New Position</h2>
          <p className="text-stone-500 mt-1 text-sm">Define a new role within an organizational unit.</p>
        </div>

        {/* Section 1: Basic Information */}
        <div className="pt-4 border-t border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyles}>Position Title <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="e.g., Core Member" className={inputStyles} />
                    <ErrorMessage message={errors.title} />
                </div>
                <div ref={unitDropdownRef} className="relative">
                    <label className={labelStyles}>Organizational Unit <span className="text-red-500">*</span></label>
                    <input type="text" value={selectedUnit ? selectedUnit.name : unitSearchTerm} onChange={(e) => { setUnitSearchTerm(e.target.value); setIsUnitDropdownOpen(true); if (!e.target.value) handleInputChange("unit_id", ""); }} onFocus={() => setIsUnitDropdownOpen(true)} placeholder="Search for unit" className={inputStyles} />
                    {isUnitDropdownOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredUnits.length > 0 ? filteredUnits.map((unit) => (
                                <div key={unit._id} onClick={() => { handleInputChange("unit_id", unit._id); setUnitSearchTerm(""); setIsUnitDropdownOpen(false); }} className="px-3 py-2 text-sm hover:bg-stone-100 cursor-pointer">{unit.name}</div>
                            )) : <div className="px-3 py-2 text-sm text-stone-500">No units found.</div>}
                        </div>
                    )}
                    <ErrorMessage message={errors.unit_id} />
                </div>
                <div>
                    <label className={labelStyles}>Position Type <span className="text-red-500">*</span></label>
                    <select value={formData.position_type} onChange={(e) => handleInputChange("position_type", e.target.value)} className={inputStyles}>
                        <option value="">Select type</option>
                        {positionTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                    </select>
                    <ErrorMessage message={errors.position_type} />
                </div>
                {formData.position_type === "Other" && (
                    <div>
                        <label className={labelStyles}>Custom Type <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.custom_position_type} onChange={(e) => handleInputChange("custom_position_type", e.target.value)} placeholder="e.g., Research Assistant" className={inputStyles} />
                        <ErrorMessage message={errors.custom_position_type} />
                    </div>
                )}
                 <div>
                    <label className={labelStyles}>Number of Positions <span className="text-red-500">*</span></label>
                    <input type="number" min="1" value={formData.position_count} onChange={(e) => handleInputChange("position_count", Number(e.target.value))} className={inputStyles} />
                    <ErrorMessage message={errors.position_count} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelStyles}>Description</label>
                    <textarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Provide a detailed description of the position..." rows={3} className={inputStyles} />
                </div>
            </div>
        </div>

        {/* Section 2: Responsibilities & Requirements */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-stone-200">
            <DynamicFieldArray label="Responsibilities" array={formData.responsibilities} onUpdate={(index, value) => handleArrayChange("responsibilities", index, value)} onRemove={index => removeFromArray("responsibilities", index)} onAdd={() => addToArray("responsibilities")} error={errors.responsibilities}/>
            
            <div className="space-y-4">
                 <DynamicFieldArray label="Required Skills" array={formData.requirements.skills_required} onUpdate={handleSkillsChange} onRemove={removeSkill} onAdd={addSkill} />
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelStyles}>Minimum CGPA</label>
                        <input type="number" step="0.1" min="0" max="10" value={formData.requirements.min_cgpa} onChange={(e) => handleRequirementChange("min_cgpa", Number(e.target.value))} className={inputStyles} />
                        <ErrorMessage message={errors.min_cgpa} />
                    </div>
                    <div>
                        <label className={labelStyles}>Minimum Year</label>
                        <select value={formData.requirements.min_year} onChange={(e) => handleRequirementChange("min_year", Number(e.target.value))} className={inputStyles}>
                            {yearOptions.map((year) => (<option key={year.value} value={year.value}>{year.label}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="pt-5 flex flex-col sm:flex-row gap-4 border-t border-stone-200">
          <button type="submit" disabled={isSubmitting} className="flex-1 bg-stone-800 text-white py-2.5 px-4 rounded-lg hover:bg-stone-700 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:bg-stone-400 disabled:cursor-not-allowed">
            {isSubmitting ? "Creating..." : "Create Position"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2.5 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPositionForm;