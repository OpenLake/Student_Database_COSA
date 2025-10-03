"use client";

import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { User, Briefcase, Tag } from "lucide-react";

// API call to fetch unendorsed user skills
const fetchUnendorsedSkills = async (skillType) => {
  try {
    const res = await api.get(
      `/api/skills/user-skills/unendorsed/${skillType}`
    );
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch unendorsed skills";
    throw new Error(message);
  }
};

// API call to endorse a user skill
const endorseSkill = async (skillId) => {
  try {
    const res = await api.post(`/api/skills/user-skills/endorse/${skillId}`);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to endorse skill";
    throw new Error(message);
  }
};

const UserSkillCard = ({ skill, onEndorse, isEndorsing }) => {
  const getProficiencyColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-gray-200 text-gray-800";
      case "intermediate":
        return "bg-blue-200 text-blue-800";
      case "advanced":
        return "bg-green-200 text-green-800";
      case "expert":
        return "bg-purple-200 text-purple-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="bg-[#FDFAE2] border border-yellow-200 rounded-xl p-4 flex flex-col h-full shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 pr-2">
            {skill.skill_id.name}
          </h3>
          <span
            className={`flex-shrink-0 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getProficiencyColor(
              skill.proficiency_level
            )}`}
          >
            {skill.proficiency_level}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-700 border-t border-yellow-200 pt-3 mt-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>{skill.user_id.personal_info.name}</span>
          </div>
          {skill.position_id && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>Position: {skill.position_id.title}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>Category: {skill.skill_id.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => onEndorse(skill._id)}
          disabled={isEndorsing}
          className="w-full py-2 text-sm font-bold text-sky-800 bg-sky-100 rounded-lg hover:bg-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEndorsing ? "Endorsing..." : "Endorse"}
        </button>
      </div>
    </div>
  );
};

const UserSkillsEndorsementTab = ({ skillType }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [endorsingSkills, setEndorsingSkills] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSkills();
  }, [skillType]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUnendorsedSkills(skillType);
      setSkills(data);
    } catch (err) {
      setError("Failed to load user skills. Please try again.");
      console.error("Error loading skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndorse = async (skillId) => {
    try {
      setEndorsingSkills((prev) => new Set([...prev, skillId]));
      await endorseSkill(skillId);
      setSkills((prev) => prev.filter((skill) => skill._id !== skillId));
      console.log("User skill endorsed successfully");
    } catch (err) {
      console.error("Error endorsing skill:", err);
      setError("Failed to endorse skill. Please try again.");
    } finally {
      setEndorsingSkills((prev) => {
        const newSet = new Set(prev);
        newSet.delete(skillId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Pending Endorsements
            </h3>
            <p className="text-gray-600">
                All {skillType} user skills have been reviewed and endorsed.
            </p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <UserSkillCard
            key={skill._id}
            skill={skill}
            onEndorse={handleEndorse}
            isEndorsing={endorsingSkills.has(skill._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSkillsEndorsementTab;