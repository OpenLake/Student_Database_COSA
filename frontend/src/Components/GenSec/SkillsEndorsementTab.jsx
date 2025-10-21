"use client";

import { useState, useEffect } from "react";
import { Award, Calendar, Tag } from "lucide-react";
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

const SkillCard = ({ skill, onEndorse, isEndorsing }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-4 flex flex-col h-full shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{skill.name}</h3>
        {skill.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {skill.description}
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-700 border-t border-yellow-200 pt-3 mt-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>Category: {skill.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>Submitted: {formatDate(skill.created_at)}</span>
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
      await endorseSkill(skillId);
      setSkills((prev) => prev.filter((s) => s._id !== skillId));
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