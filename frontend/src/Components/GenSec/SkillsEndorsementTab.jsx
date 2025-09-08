"use client";

import { useState, useEffect } from "react";
import api from "../../utils/api";
const fetchUnendorsedSkills = async (skillType) => {
  try {
    const res = await api.get(`/api/skills/unendorsed/${skillType}`);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch unendorsed skills";
    throw new Error(message);
  }
};

const endorseSkill = async (skillId) => {
  try {
    const res = await api.post(`/api/skills/endorse/${skillId}`);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to endorse skill";
    throw new Error(message);
  }
};

// Skill Card Component
const SkillCard = ({ skill, onEndorse, isEndorsing }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {skill.name}
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {skill.skill_id}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{skill.category}</p>
          {skill.description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {skill.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onEndorse(skill._id)}
          disabled={isEndorsing}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isEndorsing ? "Endorsing..." : "Endorse Skill"}
        </button>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
            <span className="text-sm text-gray-600">Pending Endorsement</span>
          </div>
          <p className="text-sm text-gray-600">
            Created: {formatDate(skill.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

const SkillsEndorsementTab = ({ skillType }) => {
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
      console.error("Error loading skills:", err);
      setError("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndorse = async (skillId) => {
    try {
      setEndorsingSkills((prev) => new Set([...prev, skillId]));
      const result = await endorseSkill(skillId);
      if (result.success) {
        setSkills((prev) => prev.filter((s) => s._id !== skillId));
      }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
          All skills endorsed!
        </h3>
        <p className="text-gray-600">
          There are no pending {skillType} skills to review at this time.
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard
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

export default SkillsEndorsementTab;
