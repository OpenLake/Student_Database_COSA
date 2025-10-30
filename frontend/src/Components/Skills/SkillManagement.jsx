import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useSkills, useSkillForm } from "../../hooks/useSkills";
import FilterDropdown from "./FilterDropdown";
import SkillCard from "./SkillCard";
import SkillFormModal from "./SkillFormModal";
import { EmptyStateNoSkills, EmptyStateNoResults } from "./EmptyState";

const SkillManagement = ({ showForm, setShowForm }) => {
  const {
    userSkills,
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
  } = useSkills();

  return (
    <div className="bg-white px-6 py-2 w-full mx-auto rounded-lg">
      <div className="bg-white rounded-lg">
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

        {/* Skills Grid */}
        {userSkills.length === 0 ? (
          <EmptyStateNoSkills />
        ) : filteredSkills.length === 0 ? (
          <EmptyStateNoResults />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredSkills.map((userSkill) => (
              <>
                <SkillCard key={userSkill._id} userSkill={userSkill} />
                {/* <SkillCard key={userSkill._id} userSkill={userSkill} /> */}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillManagement;
