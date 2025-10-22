import React from "react";
import { X, ChevronDown, Trophy } from "lucide-react";
import { useSkillForm, useSkills } from "../../hooks/useSkills";
import FilterDropdown from "./FilterDropdown";

const SkillFormModal = ({ showForm, setShowForm }) => {
  // if (!showForm) return null;

  const { skills, positions, refreshUserSkills } = useSkills();

  const {
    formData,
    newSkillData,
    loading,
    showNewSkillForm,
    handleSkillChange,
    updateFormData,
    updateNewSkillData,
    resetForm,
    submitSkill,
  } = useSkillForm(refreshUserSkills);

  const onSubmit = async () => {
    const result = await submitSkill();
    alert(result.message);
    if (result.success) {
      setShowForm(false);
    }
  };

  const onClose = () => {
    resetForm();
    setShowForm(false);
  };
  return (
    <div className="bg-white px-6 py-2 w-full mx-auto rounded-lg">
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 bg-white rounded-lg">
          {/* Skill Selection */}
          <FilterDropdown
            label="Select Skill"
            value={formData.skill_id}
            onChange={handleSkillChange}
            options={skills.map((skill) => skill.name + " - " + skill.category)}
          />

          <FilterDropdown
            label="Proficiency Level"
            value={formData.proficiency_level}
            onChange={updateFormData}
            options={["Beginner", "Intermediate", "Advanced", "Expert"]}
          />

          <FilterDropdown
            label="Associated Position (Optional)"
            value={formData.position_id}
            onChange={updateFormData}
            options={positions.map(
              (pos) => `${pos.title} - ${pos.unit_id?.name || "No Unit"}`,
            )}
          />
        </div>
        <div className="pt-4">
          <button
            onClick={onSubmit}
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
    </div>
  );
};

export default SkillFormModal;
