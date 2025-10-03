"use client";

import React, { useState } from "react";
import { getConfigByRole, endorsementTabs } from "../../config/endorseConfig";
import { AdminContext } from "../../context/AdminContext";

// Import the dedicated tab components
import SkillsEndorsementTab from "./SkillsEndorsementTab";
import AchievementsEndorsementTab from "./AchievementsEndorsementTab";
import UserSkillsEndorsementTab from "./UserSkillsEndorsementTab";

const TabNavigation = ({ activeTab, onTabChange }) => {
  const getTabIcon = (iconType) => {
    switch (iconType) {
      case "user":
        return (
          <svg
            className="w-5 h-5"
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
            className="w-5 h-5"
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
            className="w-5 h-5"
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
    <div className="border-b border-gray-200 bg-white">
      <nav className="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8">
        {endorsementTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 py-4 px-2 border-b-3 font-semibold text-base transition-colors min-w-0 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            } rounded-t-lg`}
          >
            {getTabIcon(tab.icon)}
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// Main Component
const GenSecEndorse = () => {
  const { userRole } = React.useContext(AdminContext);
  const adminRole = userRole;

  const [activeTab, setActiveTab] = useState("user-skills");

  const config = getConfigByRole(adminRole);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "user-skills":
        return <UserSkillsEndorsementTab skillType={config.skillType} />;
      case "skills":
        return <SkillsEndorsementTab skillType={config.skillType} />;
      case "achievements":
        return <AchievementsEndorsementTab skillType={config.skillType} />;
      default:
        return <UserSkillsEndorsementTab skillType={config.skillType} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-gray-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Pending Endorsement
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Review and approve pending requests for your department
                  </p>
                </div>
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
        <div className="max-w-7xl mx-auto">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-600 font-medium">
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