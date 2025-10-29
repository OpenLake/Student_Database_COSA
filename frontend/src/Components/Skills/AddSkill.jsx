import React from "react";
import { useSkillForm } from "../../hooks/useSkills";
import { Trophy } from "lucide-react";

const FormField = ({ label, icon: Icon, children, required = false }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </label>
    {children}
  </div>
);

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-2 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
    required={required}
  />
);

const TextArea = ({ name, value, onChange, placeholder, rows = 4 }) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-2 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
  />
);

const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full px-2 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
    required={required}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
const AddSkill = () => {
  const { newSkillData, updateNewSkillData, submitSkill, loading } =
    useSkillForm();
  return (
    <div className="px-6 pt-6 pb-2 flex flex-col items-start justify-between flex-wrap gap-3">
      <div>
        <div className="text-2xl font-bold tracking-tight text-gray-900">
          Add New Skill
        </div>
      </div>
      <FormField label="Skill Name" required={true}>
        <Input
          type="text"
          value={newSkillData.name}
          onChange={(e) => updateNewSkillData({ name: e.target.value })}
          placeholder="Enter skill name"
          required
        />
      </FormField>

      <FormField label="Category" required={true}>
        <Input
          type="text"
          value={newSkillData.category}
          onChange={(e) => updateNewSkillData({ category: e.target.value })}
          placeholder="e.g., Programming, Design"
          required
        />
      </FormField>

      <FormField label="Type" required={true}>
        <Select
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
      </FormField>

      <FormField label="Desc" required={false}>
        <TextArea
          value={newSkillData.description}
          onChange={(e) => updateNewSkillData({ description: e.target.value })}
          rows={3}
          placeholder="Optional: A brief description"
        />
      </FormField>
      <div className="pt-4">
        <button
          onClick={submitSkill}
          disabled={loading}
          className={`w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>{loading ? "Submitting..." : "Submit Skill"}</span>
        </button>
      </div>
    </div>
  );
};

export default AddSkill;
