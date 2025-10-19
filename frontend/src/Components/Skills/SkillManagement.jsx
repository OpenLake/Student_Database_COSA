import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useSkills, useSkillForm } from "../../hooks/useSkills";
import FilterDropdown from "./FilterDropdown";
import SkillCard from "./SkillCard";
import SkillFormModal from "./SkillFormModal";
import { EmptyStateNoSkills, EmptyStateNoResults } from "./EmptyState";

const SkillManagement = ({showForm, setShowForm}) => {
  // const [showForm, setShowForm] = useState(false);

  const {
    skills,
    userSkills,
    positions,
    filteredSkills,
    selectedType,
    setSelectedType,
    selectedProficiency,
    setSelectedProficiency,
    selectedEndorsement,
    setSelectedEndorsement,
    types,
    proficiencies,
    endorsementStatuses,
    refreshUserSkills,
  } = useSkills();

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

  const handleSubmit = async () => {
    const result = await submitSkill();
    alert(result.message);
    if (result.success) {
      setShowForm(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="">
      <div className="max-w-6xl mx-auto">

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 bg-white rounded-lg">
          <FilterDropdown
            label="Type"
            value={selectedType}
            onChange={setSelectedType}
            options={types}
          />
          <FilterDropdown
            label="Proficiency"
            value={selectedProficiency}
            onChange={setSelectedProficiency}
            options={proficiencies}
          />
          <FilterDropdown
            label="Endorsement"
            value={selectedEndorsement}
            onChange={setSelectedEndorsement}
            options={endorsementStatuses}
          />
        </div>

        {/* Form Modal */}
        <SkillFormModal
          showForm={showForm}
          formData={formData}
          newSkillData={newSkillData}
          showNewSkillForm={showNewSkillForm}
          skills={skills}
          positions={positions}
          loading={loading}
          onSkillChange={handleSkillChange}
          onFormDataChange={updateFormData}
          onNewSkillDataChange={updateNewSkillData}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />

        {/* Skills Grid */}
        {userSkills.length === 0 ? (
          <EmptyStateNoSkills />
        ) : filteredSkills.length === 0 ? (
          <EmptyStateNoResults />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSkills.map((userSkill) => (
              <SkillCard key={userSkill._id} userSkill={userSkill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillManagement;