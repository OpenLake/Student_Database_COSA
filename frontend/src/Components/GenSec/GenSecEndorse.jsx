"use client";

import React, { useState, useEffect } from "react";
import { getConfigByRole, endorsementTabs } from "../../config/endorseConfig";
import SkillsEndorsementTab from "./SkillsEndorsementTab";
import AchievementsEndorsementTab from "./AchievementsEndorsementTab";
import { AdminContext } from "../../context/AdminContext";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const fetchUnendorsedSkills = async (skillType) => {
  const res = await fetch(
    `${API_BASE_URL}/api/skills/user-skills/unendorsed/${skillType}`,
  );
  if (!res.ok) throw new Error("Failed to fetch user skills");
  return res.json();
};

const endorseSkill = async (skillId) => {
  const res = await fetch(
    `${API_BASE_URL}/api/skills/user-skills/endorse/${skillId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) throw new Error("Failed to endorse skill");
  return res.json();
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {skill.skill_id.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {skill.skill_id.category}
          </p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency_level)}`}
          >
            {skill.proficiency_level.charAt(0).toUpperCase() +
              skill.proficiency_level.slice(1)}
          </span>
        </div>
        <button
          onClick={() => onEndorse(skill._id)}
          disabled={isEndorsing}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isEndorsing ? "Endorsing..." : "Endorse"}
        </button>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-gray-900">
              {skill.user_id.personal_info.name}
            </p>
            <p className="text-sm text-gray-600">
              {skill.user_id.user_id} • @{skill.user_id.username}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Submitted: {formatDate(skill.created_at)}
            </p>
          </div>
        </div>

        {skill.position_id && (
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm font-medium text-gray-900">
              Position: {skill.position_id.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserSkillsTab = ({ skillType }) => {
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

      const result = await endorseSkill(skillId);

      if (result.success) {
        setSkills((prev) => prev.filter((skill) => skill._id !== skillId));
        console.log("User skill endorsed successfully");
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
          All user skills endorsed!
        </h3>
        <p className="text-gray-600">
          There are no pending {skillType} user skills to review at this time.
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

const TabNavigation = ({ activeTab, onTabChange, skillType }) => {
  const getTabIcon = (iconType) => {
    switch (iconType) {
      case "user":
        return (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "skill":
        return (
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case "achievement":
        return (
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
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {endorsementTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {getTabIcon(tab.icon)}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Main Component
const GenSecEndorse = () => {
  // Mock admin context - replace with useContext(AdminContext)
  const { userRole } = React.useContext(AdminContext); // Default to GENSEC_CULT if context is not available
  const adminRole = userRole; // This should come from AdminContext

  const [currentPage, setCurrentPage] = useState("endorsement"); // 'endorsement' or 'history'
  const [activeTab, setActiveTab] = useState("user-skills");

  const config = getConfigByRole(adminRole);

  const handleBackToEndorsement = () => {
    setCurrentPage("endorsement");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "user-skills":
        return <UserSkillsTab skillType={config.skillType} />;
      case "skills":
        return <SkillsEndorsementTab skillType={config.skillType} />;
      case "achievements":
        return <AchievementsEndorsementTab skillType={config.skillType} />;
      default:
        return <UserSkillsTab skillType={config.skillType} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {config.pageTitle}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {config.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {config.displayTitle}
                  </p>
                  <p className="text-sm text-gray-600">Endorsement Panel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            skillType={config.skillType}
          />
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-gray-600">
            {endorsementTabs.find((tab) => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GenSecEndorse;
