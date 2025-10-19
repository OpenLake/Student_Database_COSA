import React from "react";
import { Calendar, CheckCircle2, CircleOff } from "lucide-react";

const getProficiencyColor = (level) => {
  const colors = {
    beginner: "bg-blue-100 text-blue-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-orange-100 text-orange-800",
    expert: "bg-red-100 text-red-800",
  };
  return colors[level?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const SkillCard = ({ userSkill }) => {
  return (
    <div className="bg-white border border-[#DCD3C9] p-4 rounded-lg shadow-sm hover:shadow-md hover:border-[#A98B74] transition-all">
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Left Side */}
        <div className="flex flex-col gap-1">
          <h5 className="font-bold text-base text-[#5E4B3D] truncate">
            {userSkill.skill_id?.name || "Unnamed Skill"}
          </h5>
          <div className="flex items-center gap-2 text-sm text-[#7D6B5F]">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(userSkill.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getProficiencyColor(
              userSkill.proficiency_level
            )}`}
          >
            {userSkill.proficiency_level?.charAt(0).toUpperCase() +
              userSkill.proficiency_level?.slice(1)}
          </span>
          {userSkill.is_endorsed ? (
            <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Endorsed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-[#7D6B5F] font-medium">
              <CircleOff className="w-4 h-4" />
              <span>Not Endorsed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;