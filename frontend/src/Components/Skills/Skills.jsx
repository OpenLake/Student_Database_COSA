import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Eye, Plus } from "lucide-react";
import SkillsEndorsementTab from "../GenSec/SkillsEndorsementTab";
import SkillManagement from "./UserSkillManagement";
import UserSkillsEndorsementTab from "../GenSec/UserSkillsEndorsementTab";

const Skills = () => {
  const [add, setAdd] = useState(false);
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";

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
        <SkillManagement />
      </div>
    </div>
  );
};

export default Skills;
