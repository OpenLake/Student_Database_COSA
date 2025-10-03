"use client";

import React, { useState, useEffect } from "react";
import api from "../../utils/api";

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
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProficiencyColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-gray-100 text-gray-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-green-100 text-green-800";
      case "expert":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {skill.skill_id.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{skill.skill_id.category}</p>
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(
            skill.proficiency_level
          )}`}
        >
          {skill.proficiency_level.charAt(0).toUpperCase() +
            skill.proficiency_level.slice(1)}
        </span>
      </div>

      {/* User Information */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {skill.user_id.personal_info.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {skill.user_id.personal_info.name}
          </p>
          <p className="text-sm text-gray-600">{skill.user_id.user_id}</p>
        </div>
      </div>

      {/* Position and Date Information */}
      <div className="space-y-2 mb-2">
        {skill.position_id && (
          <div className="bg-white rounded-md p-2">
            <p className="text-sm font-medium text-gray-900">
              Position: {skill.position_id.title}
            </p>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Submitted: {formatDate(skill.created_at)}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-2 border-t border-pink-200">
        <button
          onClick={() => onEndorse(skill._id)}
          disabled={isEndorsing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isEndorsing ? "Endorsing..." : "Endorse"}</span>
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