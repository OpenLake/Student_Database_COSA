import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Eye, Plus } from "lucide-react";
import SkillsEndorsementTab from "../GenSec/SkillsEndorsementTab";
import SkillManagement from "./SkillManagement";
import UserSkillsEndorsementTab from "../GenSec/UserSkillsEndorsementTab";

const Skills = () => {
  const [add, setAdd] = useState(false);
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {" "}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div className="">
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Skills
            </div>
            <div className="text-gray-600 mt-2">
              The skills that you've proved to have gained
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#5E4B3D] text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors font-medium shadow"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
        <SkillManagement showForm={showForm} setShowForm={setShowForm} />
      </div>
    </div>
  );
};

export default Skills;
