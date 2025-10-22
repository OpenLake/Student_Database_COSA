import React, { useContext, useEffect, useMemo } from "react";
import { X, ChevronDown, Trophy } from "lucide-react";
import { useSkillForm, useSkills } from "../../hooks/useSkills";
import FilterDropdown from "./FilterDropdown";
import { usePositionHolders } from "../../hooks/usePositionHolders";
import { AdminContext } from "../../context/AdminContext";

const SkillFormModal = ({ showForm, setShowForm }) => {
  // if (!showForm) return null;
  const { isUserLoggedIn } = useContext(AdminContext);

  const { skills, positions, refreshUserSkills } = useSkills();
  const { positionHolders } = usePositionHolders();
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

  const userPositions = useMemo(() => {
    if (!isUserLoggedIn?._id || !positionHolders.length || !positions.length) {
      return [];
    }

    // Get position IDs held by current user
    const userPositionIds = positionHolders
      .filter(
        (holder) =>
          holder.user_id?._id === isUserLoggedIn._id ||
          holder.user_id === isUserLoggedIn._id
      )
      .map((holder) => holder.position_id?._id || holder.position_id);

    // Filter positions to only include user's positions
    return positions.filter((pos) => userPositionIds.includes(pos._id));
  }, [isUserLoggedIn, positionHolders, positions]);

  const onSubmit = async () => {
    const result = await submitSkill();
    alert(result.message);
    if (result.success) {
      setShowForm(false);
    }
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
            options={userPositions.map(
              (pos) => `${pos.title} - ${pos.unit_id?.name || "No Unit"}`
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
