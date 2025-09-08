"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { AdminContext } from "../../context/AdminContext";
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
    return <p className="text-gray-500">Loading achievements...</p>;
  }
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (achievements.length === 0) {
    return (
      <p className="text-gray-500">No achievements pending endorsement.</p>
    );
  }
  console.log("Achievements:", achievements);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((ach) => (
        <div
          key={ach._id}
          className="bg-white shadow rounded-lg p-4 border border-gray-200"
        >
          <h3 className="text-lg font-semibold">{ach.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{ach.description}</p>

          {/* User Info */}
          {ach.user_id && (
            <p className="text-sm text-gray-500">
              Submitted by: {ach.user_id.personal_info?.name} (
              {ach.user_id.username}) | ID: {ach.user_id.user_id}
            </p>
          )}

          {ach.event_id && (
            <>
              <p className="text-sm text-gray-500 mt-1">
                Event: {ach.event_id.title}
              </p>
              <p className="text-sm text-gray-500">
                {ach.event_id.description}
              </p>
            </>
          )}
          <p className="text-sm text-gray-500">
            Date: {format(new Date(ach.date_achieved), "dd MMM yyyy")}
          </p>
          {ach.certificate_url && (
            <a
              href={ach.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline block mt-1"
            >
              View Certificate
            </a>
          )}
          <button
            onClick={() => handleVerify(ach._id)}
            disabled={verifying.has(ach._id)}
            className={`mt-2 px-4 py-1 rounded text-white ${
              verifying.has(ach._id)
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {verifying.has(ach._id) ? "Verifying..." : "Mark as Verified"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AchievementsEndorsementTab;
