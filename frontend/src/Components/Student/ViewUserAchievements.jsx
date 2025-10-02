import React, { useState, useEffect } from "react";
import {
  Trophy,
  Calendar,
  Award,
  Eye,
  Filter,
  Search,
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../../utils/api";
import { AdminContext } from "../../context/AdminContext";

const ViewAchievements = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    const fetchMyAchievements = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/achievements/${isUserLoggedIn._id}`,
        );
        setAchievements(response.data);
        setFilteredAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError("Failed to fetch achievements");
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoggedIn?._id) {
      fetchMyAchievements();
    }
  }, [isUserLoggedIn]);

  // Filter achievements based on search term, category, verification status, and level
  useEffect(() => {
    let filtered = achievements;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (achievement) =>
          achievement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          achievement.category
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          achievement.type?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (achievement) => achievement.category === categoryFilter,
      );
    }

    // Filter by verification status
    if (verificationFilter !== "all") {
      filtered = filtered.filter((achievement) =>
        verificationFilter === "verified"
          ? achievement.verified
          : !achievement.verified,
      );
    }

    // Filter by level
    if (levelFilter !== "all") {
      filtered = filtered.filter(
        (achievement) => achievement.level === levelFilter,
      );
    }

    setFilteredAchievements(filtered);
  }, [
    achievements,
    searchTerm,
    categoryFilter,
    verificationFilter,
    levelFilter,
  ]);

  const getVerificationBadgeColor = (verified) => {
    return verified
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getLevelBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case "international":
        return "bg-purple-100 text-purple-800";
      case "national":
        return "bg-blue-100 text-blue-800";
      case "state":
        return "bg-indigo-100 text-indigo-800";
      case "district":
        return "bg-green-100 text-green-800";
      case "college":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique values for filter dropdowns
  const uniqueCategories = [
    ...new Set(achievements.map((a) => a.category).filter(Boolean)),
  ].sort();
  const uniqueLevels = [
    ...new Set(achievements.map((a) => a.level).filter(Boolean)),
  ].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading your achievements...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    My Achievements
                  </h1>
                  <p className="text-sm text-gray-600">
                    View all your accomplishments and recognitions
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  // Navigate to add achievement page
                  window.location.href = "/add-achievement";
                }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              >
                <option value="all">All Levels</option>
                {uniqueLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>

              {/* Verification Filter */}
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="px-6 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredAchievements.length} of {achievements.length}{" "}
              achievements
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600">
              {achievements.length === 0
                ? "You haven't added any achievements yet."
                : "No achievements match your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Achievement Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {achievement.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {achievement.category?.charAt(0).toUpperCase() +
                            achievement.category?.slice(1)}
                        </span>
                        {achievement.level && (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(achievement.level)}`}
                          >
                            {achievement.level.charAt(0).toUpperCase() +
                              achievement.level.slice(1)}
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getVerificationBadgeColor(achievement.verified)}`}
                        >
                          {achievement.verified ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Pending
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Achievement Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-orange-500" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Achievement Details
                      </h4>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date achieved:</span>
                        <span className="text-gray-900 font-medium">
                          {formatDate(achievement.date_achieved)}
                        </span>
                      </div>
                      {achievement.type && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Type:</span>
                          <span className="text-gray-900 font-medium">
                            {achievement.type}
                          </span>
                        </div>
                      )}
                      {achievement.position && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Position:</span>
                          <span className="text-gray-900 font-medium">
                            {achievement.position}
                          </span>
                        </div>
                      )}
                      {achievement.event_id && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Event:</span>
                          <span className="text-gray-900 font-medium">
                            {achievement.event_id.title ||
                              achievement.event_id.name ||
                              "Event"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Details */}
                  {achievement.verified && achievement.verified_by && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <h4 className="text-sm font-medium text-gray-900">
                          Verification Details
                        </h4>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Verified by:</span>
                          <span className="text-gray-900 font-medium">
                            {achievement.verified_by.personal_info?.name ||
                              achievement.verified_by.username ||
                              "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certificate */}
                  {achievement.certificate_url && (
                    <div>
                      <a
                        href={achievement.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Certificate
                      </a>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <span>Added: {formatDate(achievement.created_at)}</span>
                    <span>ID: {achievement.achievement_id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAchievements;
