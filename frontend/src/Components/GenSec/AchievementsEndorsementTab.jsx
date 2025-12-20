"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { AdminContext } from "../../context/AdminContext";
import { User, Calendar, Award, ExternalLink } from "lucide-react";
import api from "../../utils/api";

const AchievementsEndorsementTab = ({ skillType }) => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(new Set());
  const [error, setError] = useState("");

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

  return (
    <div className="space-y-6 w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {achievements.map((ach) => (
          <div
            key={ach._id}
            className="bg-white border border-yellow-200 rounded-xl p-4 flex flex-col h-full shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-gray-800">{ach.title}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                "{ach.description}"
              </p>

              <div className="space-y-2 text-sm text-gray-700 border-t border-yellow-200 pt-3 mt-3">
                {ach.user_id && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>{ach.user_id.personal_info?.name}</span>
                  </div>
                )}
                {ach.event_id && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Event: {ach.event_id.title}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>
                    {format(new Date(ach.date_achieved), "dd MMM yyyy")}
                  </span>
                </div>
                {ach.certificate_url && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a
                      href={ach.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => handleVerify(ach._id)}
                disabled={verifying.has(ach._id)}
                className="w-full py-2 text-sm font-bold text-sky-800 bg-sky-100 rounded-lg hover:bg-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying.has(ach._id) ? "Endorsing..." : "Endorse"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsEndorsementTab;
