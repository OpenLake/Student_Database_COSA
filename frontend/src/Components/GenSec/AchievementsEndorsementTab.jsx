"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { AdminContext } from "../../context/AdminContext";
import {
  ChevronRight,
  User,
  Calendar,
  Award,
  ExternalLink,
} from "lucide-react";
import api from "../../utils/api";

const AchievementsEndorsementTab = ({ skillType }) => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(new Set());
  const [error, setError] = useState("");

  // API call to fetch unendorsed achievements
  const fetchUnverifiedAchievements = async (type) => {
    try {
      const res = await api.get(`/api/achievements/unendorsed/${type}`);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch unendorsed achievements";
      throw new Error(message);
    }
  };
  // API call to verify an achievement
  const verifyAchievement = async (id) => {
    try {
      const res = await api.patch(`/api/achievements/verify/${id}`, {
        verified_by: isUserLoggedIn._id,
      });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to verify achievement";
      throw new Error(message);
    }
  };

  const loadAchievements = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchUnverifiedAchievements(skillType);
      setAchievements(data);
    } catch (err) {
      setError("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [skillType]);

  const handleVerify = async (id) => {
    setVerifying((prev) => new Set(prev).add(id));
    try {
      await verifyAchievement(id);
      setAchievements((prev) => prev.filter((ach) => ach._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to verify achievement");
    } finally {
      setVerifying((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Pending Endorsements
        </h3>
        <p className="text-gray-600">
          All achievements have been reviewed and endorsed.
        </p>
      </div>
    );
  }

  console.log("Achievements:", achievements);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((ach) => (
        <div
          key={ach._id}
          className="bg-pink-50 border border-pink-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
        >
          {/* Card Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {ach.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              "{ach.description}"
            </p>
          </div>

          {/* User Information */}
          {ach.user_id && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              <span className="font-medium">
                {ach.user_id.personal_info?.name}
              </span>
              <span className="text-gray-500">
                {ach.user_id.user_id ? `• ${ach.user_id.user_id}` : ""}
              </span>
            </div>
          )}

          {/* Event Information */}
          {ach.event_id && (
            <div className="bg-white rounded-md p-2 mb-2">
              <p className="text-sm font-medium text-gray-900">
                Event: {ach.event_id.title}
              </p>
              {ach.event_id.description && (
                <p className="text-xs text-gray-600 mt-1">
                  {ach.event_id.description}
                </p>
              )}
            </div>
          )}

          {/* Date and Certificate */}
          <div className="flex items-center justify-between mb-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(ach.date_achieved), "dd MMM yyyy")}</span>
            </div>
            {ach.certificate_url && (
              <a
                href={ach.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Certificate
              </a>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2 border-t border-pink-200">
            <button
              onClick={() => handleVerify(ach._id)}
              disabled={verifying.has(ach._id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{verifying.has(ach._id) ? "Endorsing..." : "Endorse"}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsEndorsementTab;
