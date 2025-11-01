import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Eye, Plus } from "lucide-react";
import SkillManagement from "./SkillManagement";
import SkillFormModal from "./SkillFormModal";

const Skills = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {" "}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">
            Skills
          </div>
          <div className="text-gray-600 mt-2">
            The skills that you've proved to have gained
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-black px-4 py-2 rounded-lg"
        >
          {showForm ? (
            <>
              <Eye className="w-5 h-5" />
              <span>View Skills</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Add Skills</span>
            </>
          )}
        </button>
        {showForm ? (
          <SkillFormModal showForm={showForm} setShowForm={setShowForm} />
        ) : (
          <SkillManagement showForm={showForm} setShowForm={setShowForm} />
        )}
      </div>
    </div>
  );
};

export default Skills;
