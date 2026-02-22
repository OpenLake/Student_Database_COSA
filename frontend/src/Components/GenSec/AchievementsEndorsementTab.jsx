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
  const [rejecting, setRejecting] = useState(new Set());
  const [error, setError] = useState("");

  const fetchUnverifiedAchievements = async (type) => {
    const res = await api.get(`/api/achievements/unendorsed/${type}`);
    return res.data;
  };

  const verifyAchievement = async (id) => {
    await api.patch(`/api/achievements/verify/${id}`, {
      verified_by: isUserLoggedIn._id,
    });
  };

  const rejectAchievement = async (id) => {
    await api.post(`/api/achievements/reject/${id}`);
  };

  const loadAchievements = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchUnverifiedAchievements(skillType);
      setAchievements(data);
    } catch {
      setError("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillType]);

  const handleVerify = async (id) => {
    setVerifying((prev) => new Set(prev).add(id));
    try {
      await verifyAchievement(id);
      setAchievements((prev) => prev.filter((ach) => ach._id !== id));
    } finally {
      setVerifying((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this achievement?\n\nThis action cannot be undone.",
    );
    if (!confirmed) return;

    setRejecting((prev) => new Set(prev).add(id));
    try {
      await rejectAchievement(id);
      setAchievements((prev) => prev.filter((ach) => ach._id !== id));
    } finally {
      setRejecting((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {achievements.map((ach) => (
        <div
          key={ach._id}
          className="bg-white border border-yellow-200 rounded-xl p-4 flex flex-col shadow-sm"
        >
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-800">{ach.title}</h3>
            <p className="text-xs text-gray-500 mb-3">"{ach.description}"</p>

            <div className="space-y-2 text-sm text-gray-700 border-t border-yellow-200 pt-3">
              {ach.user_id && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{ach.user_id.personal_info?.name}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(ach.date_achieved), "dd MMM yyyy")}
                </span>
              </div>

              {ach.certificate_url && (
                <a
                  href={ach.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Certificate
                </a>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleVerify(ach._id)}
              disabled={verifying.has(ach._id) || rejecting.has(ach._id)}
              className="w-full py-2 text-sm font-bold text-sky-800 bg-sky-100 rounded-lg"
            >
              {verifying.has(ach._id) ? "Endorsing..." : "Endorse"}
            </button>

            <button
              onClick={() => handleReject(ach._id)}
              disabled={verifying.has(ach._id) || rejecting.has(ach._id)}
              className="w-full py-2 text-sm font-bold text-red-800 bg-red-100 rounded-lg"
            >
              {rejecting.has(ach._id) ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsEndorsementTab;
