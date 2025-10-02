"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Award, Calendar } from "lucide-react";
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
    <div className="bg-pink-50 border border-pink-100 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Skill Request
          </h3>
          <h4 className="text-md font-medium text-gray-800 mb-2">
            {skill.name}
          </h4>
          <p className="text-sm text-gray-600 mb-3">{skill.category}</p>
          {skill.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              "{skill.description}"
            </p>
          )}
        </div>
      </div>

      {/* Skill ID Badge */}
      {skill.skill_id && (
        <div className="mb-3">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            ID: {skill.skill_id}
          </span>
        </div>
      )}

      {/* Date Information */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Created: {formatDate(skill.created_at)}</span>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onEndorse(skill._id)}
          disabled={isEndorsing}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isEndorsing ? "Processing..." : "View"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Pending Endorsements
        </h3>
        <p className="text-gray-600">
          All {skillType} skills have been reviewed and endorsed.
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
