import React from "react";
import { useSkillForm, useSkills } from "../../hooks/useSkills";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  options,
  rows,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-[#5E4B3D]">
      {label} {required && "*"}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows || 2}
        placeholder={placeholder}
        className="w-full p-2 text-sm border border-[#DCD3C9] rounded focus:ring-1 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
      />
    ) : type === "select" ? (
      <select
        value={value}
        onChange={onChange}
        className="w-full p-2 text-sm border border-[#DCD3C9] rounded focus:ring-1 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
        required={required}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-2 text-sm border border-[#DCD3C9] rounded focus:ring-1 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
      />
    )}
  </div>
);

const CreateNewSkill = () => {
  const { refreshUserSkills } = useSkills();
  const { newSkillData, updateNewSkillData, submitSkill, resetForm, loading } =
    useSkillForm(refreshUserSkills);
  const handleSubmit = async () => {
    const result = await submitSkill();
    alert(result.message);
    if (result.success) {
      resetForm();
    }
  };
  const handleClose = () => {
    resetForm();
  };
  return (
    <div className="p-3 bg-white border border-[#DCD3C9] rounded-lg space-y-3 text-sm">
      <div className="text-2xl font-bold tracking-tight text-gray-900">
        Create New Skill
      </div>

      <InputField
        label="Skill Name"
        value={newSkillData.name}
        onChange={(e) => updateNewSkillData({ name: e.target.value })}
        required
        placeholder="Enter skill name"
      />

      <InputField
        label="Category"
        value={newSkillData.category}
        onChange={(e) => updateNewSkillData({ category: e.target.value })}
        required
        placeholder="e.g., Programming, Design"
      />

      <InputField
        label="Type"
        type="select"
        value={newSkillData.type}
        onChange={(e) => updateNewSkillData({ type: e.target.value })}
        required
        options={[
          { value: "technical", label: "Technical" },
          { value: "cultural", label: "Cultural" },
          { value: "sports", label: "Sports" },
          { value: "academic", label: "Academic" },
          { value: "other", label: "Other" },
        ]}
      />

      <InputField
        label="Description"
        type="textarea"
        value={newSkillData.description}
        onChange={(e) => updateNewSkillData({ description: e.target.value })}
        placeholder="Optional: A brief description"
        rows={2}
      />
      <div className="flex gap-3 pt-6 border-t border-[#DCD3C9]">
        <button
          onClick={handleClose}
          className="flex-1 bg-white border border-[#DCD3C9] text-[#7D6B5F] py-3 rounded-lg hover:bg-[#F5F1EC] transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-[#A98B74] text-white py-3 rounded-lg hover:bg-[#856A5D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Adding..." : "Add Skill"}
        </button>
      </div>
    </div>
  );
};

export default CreateNewSkill;
