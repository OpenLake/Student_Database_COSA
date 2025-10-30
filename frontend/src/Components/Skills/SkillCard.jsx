import React from "react";
import { Calendar, CheckCircle2, CircleOff, Star } from "lucide-react";
import DisplayCard from "../common/DisplayCard";

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
    <DisplayCard
      icon={Star}
      backgroundColor={getProficiencyColor(userSkill.proficiency_level)}
      title={userSkill.skill_id?.name || "Unnamed Skill"}
      subtitle={
        userSkill.proficiency_level?.charAt(0).toUpperCase() +
        userSkill.proficiency_level?.slice(1)
      }
      description={userSkill.is_endorsed ? "Endorsed" : "Not Endorsed"}
    />
  );
};

export default SkillCard;
