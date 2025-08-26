import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Calendar,
  BarChart3,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import AddPositionHolder from "./AddPositionHolder";
const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const ManagePositions = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tenureFilter, setTenureFilter] = useState("all");

  useEffect(() => {
    const fetchMyPositions = async () => {
      try {
        setLoading(true);
        // Assuming you have an API endpoint to fetch positions by user_id
        const response = await axios.get(
          `${API_BASE}/api/positions/${isUserLoggedIn._id}`,
        );
        setPositions(response.data);
        setFilteredPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
        setError("Failed to fetch positions");
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoggedIn?._id) {
      fetchMyPositions();
    }
  }, [isUserLoggedIn]);

  // Filter positions based on search term, status, and tenure
  useEffect(() => {
    let filtered = positions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (position) =>
          position.position_id?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          position.position_id?.unit_id?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          position.tenure_year.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (position) => position.status === statusFilter,
      );
    }

    // Filter by tenure
    if (tenureFilter !== "all") {
      filtered = filtered.filter(
        (position) => position.tenure_year === tenureFilter,
      );
    }

    setFilteredPositions(filtered);
  }, [positions, searchTerm, statusFilter, tenureFilter]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "terminated":
        return "bg-red-100 text-red-800";
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

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Get unique tenure years for filter dropdown
  const uniqueTenureYears = [
    ...new Set(positions.map((p) => p.tenure_year)),
  ].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading your positions...</div>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  My Positions
                </h1>
                <p className="text-sm text-gray-600">
                  View all your current and past positions
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
            >
              + Add a Position
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              {/* Tenure Filter */}
              <select
                value={tenureFilter}
                onChange={(e) => setTenureFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Years</option>
                {uniqueTenureYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="px-6 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredPositions.length} of {positions.length} positions
            </p>
          </div>
        </div>

        {/* Positions Grid */}
        {filteredPositions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No positions found
            </h3>
            <p className="text-gray-600">
              {positions.length === 0
                ? "You haven't been assigned any positions yet."
                : "No positions match your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPositions.map((position) => (
              <div
                key={position._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Position Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {position.position_id?.title || "Unknown Position"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {position.position_id?.unit_id?.name ||
                          "Unknown Department"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500">
                          {position.tenure_year}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                            position.status,
                          )}`}
                        >
                          {position.status.charAt(0).toUpperCase() +
                            position.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Appointment Details */}
                  {(position.appointment_details?.appointed_by ||
                    position.appointment_details?.appointment_date) && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <h4 className="text-sm font-medium text-gray-900">
                          Appointment Details
                        </h4>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        {position.appointment_details.appointed_by && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Appointed by:</span>
                            <span className="text-gray-900 font-medium">
                              {position.appointment_details.appointed_by
                                .personal_info?.name ||
                                position.appointment_details.appointed_by
                                  .username ||
                                "Unknown"}
                            </span>
                          </div>
                        )}
                        {position.appointment_details.appointment_date && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Appointment date:
                            </span>
                            <span className="text-gray-900 font-medium">
                              {formatDate(
                                position.appointment_details.appointment_date,
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Performance Metrics
                      </h4>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Events organized:</span>
                        <span className="text-gray-900 font-medium">
                          {position.performance_metrics?.events_organized || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget utilized:</span>
                        <span className="text-gray-900 font-medium">
                          {formatCurrency(
                            position.performance_metrics?.budget_utilized,
                          )}
                        </span>
                      </div>
                      {position.performance_metrics?.feedback && (
                        <div className="pt-2 border-t border-purple-200">
                          <p className="text-xs text-gray-600 mb-1">
                            Feedback:
                          </p>
                          <p className="text-sm text-gray-900">
                            {position.performance_metrics.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <span>Created: {formatDate(position.created_at)}</span>
                    {position.updated_at !== position.created_at && (
                      <span>Updated: {formatDate(position.updated_at)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            {/* Render Separate Component */}
            <AddPositionHolder onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePositions;
