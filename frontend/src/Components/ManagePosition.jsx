import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Calendar,
  BarChart3,
  Eye,
  Filter,
  Search,
  Trophy,
  Palette,
  Microscope,
  Users,
  Briefcase,
  Grid3x3,
} from "lucide-react";
import api from "../utils/api";
import { AdminContext } from "../context/AdminContext";
import AddPositionHolder from "./AddPositionHolder";

const ManagePositions = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tenureFilter, setTenureFilter] = useState("all");

  useEffect(() => {
    const fetchMyPositions = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/positions/${isUserLoggedIn._id}`);
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

  useEffect(() => {
    let filtered = positions;

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

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (position) => position.status === statusFilter,
      );
    }

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

  const uniqueTenureYears = [
    ...new Set(positions.map((p) => p.tenure_year)),
  ].sort();

  const getUnitConfig = (unitName) => {
    const unitLower = unitName?.toLowerCase() || "";

    if (unitLower.includes("cosa") || unitLower.includes("cultural")) {
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: Grid3x3,
        iconBg: "bg-green-100",
      };
    } else if (unitLower.includes("cult")) {
      return {
        bg: "bg-green-200",
        text: "text-green-700",
        icon: Palette,
        iconBg: "bg-green-100",
      };
    } else if (unitLower.includes("scitech") || unitLower.includes("tech")) {
      return {
        bg: "bg-red-200",
        text: "text-red-700",
        icon: Microscope,
        iconBg: "bg-red-100",
      };
    } else if (unitLower.includes("sport")) {
      return {
        bg: "bg-cyan-100",
        text: "text-cyan-700",
        icon: Trophy,
        iconBg: "bg-cyan-100",
      };
    } else if (unitLower.includes("academic") || unitLower.includes("social")) {
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Users,
        iconBg: "bg-yellow-100",
      };
    } else {
      return {
        bg: "bg-purple-200",
        text: "text-purple-700",
        icon: Briefcase,
        iconBg: "bg-purple-100",
      };
    }
  };

  const groupedPositions = filteredPositions.reduce((acc, position) => {
    const unitName =
      position.position_id?.unit_id?.name || "Unknown Department";
    if (!acc[unitName]) {
      acc[unitName] = [];
    }
    acc[unitName].push(position);
    return acc;
  }, {});

  const calculateDuration = (startDate) => {
    if (!startDate) return "N/A";
    const start = new Date(startDate);
    const now = new Date();
    const months = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 30));
    return `${months} month${months !== 1 ? "s" : ""}`;
  };

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Your PORs
                </h1>
                <p className="text-sm text-gray-600">
                  View all your current and past positions
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition-colors"
            >
              + Add a Position
            </button>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
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

          <div className="px-6 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredPositions.length} of {positions.length} positions
            </p>
          </div>
        </div>

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
          <div className="space-y-6">
            {Object.entries(groupedPositions).map(
              ([unitName, unitPositions]) => {
                const unitConfig = getUnitConfig(unitName);
                const IconComponent = unitConfig.icon;

                return (
                  <div
                    key={unitName}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 ${unitConfig.iconBg} rounded-md flex items-center justify-center`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${unitConfig.text}`}
                            strokeWidth={2}
                          />
                        </div>
                        <h2 className={`text-2xl font-bold ${unitConfig.text}`}>
                          {unitName}
                        </h2>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                        Request Change
                      </button>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unitPositions.map((position) => (
                          <div
                            key={position._id}
                            className={`${unitConfig.bg} rounded-xl p-5 transition-all hover:shadow-md cursor-pointer border border-transparent hover:border-gray-200`}
                          >
                            <div className="space-y-1">
                              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {position.position_id?.title ||
                                  "Unknown Position"}
                              </h3>
                              <div className="text-sm text-gray-500 font-normal">
                                {formatDate(
                                  position.appointment_details
                                    ?.appointment_date,
                                )}{" "}
                                - Present
                              </div>
                              <div className="text-sm text-gray-500 font-normal">
                                (
                                {calculateDuration(
                                  position.appointment_details
                                    ?.appointment_date,
                                )}
                                )
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>
            <AddPositionHolder onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePositions;
