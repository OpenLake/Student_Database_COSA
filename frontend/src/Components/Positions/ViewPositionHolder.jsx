import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Calendar,
  BarChart3,
  Award,
  Clock,
  DollarSign,
} from "lucide-react";
import api from "../../utils/api";
const ViewPositionHolder = () => {
  const [positionHolders, setPositionHolders] = useState([]);
  const [filteredHolders, setFilteredHolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTenure, setSelectedTenure] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedHolder, setSelectedHolder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPositionHolders = async () => {
      try {
        const res = await api.get(`/api/positions/get-all-position-holder`);
        setPositionHolders(res.data);
        setFilteredHolders(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositionHolders();
  }, []);

  // Get unique values for filters
  const statuses = ["active", "completed", "terminated"];
  const tenureYears = [
    ...new Set(positionHolders.map((holder) => holder.tenure_year)),
  ];
  const departments = [
    ...new Set(
      positionHolders.map((holder) => holder.position_id.unit_id.name),
    ),
  ];

  // Filter position holders
  useEffect(() => {
    let filtered = positionHolders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (holder) =>
          holder.user_id.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.user_id.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.user_id.student_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.position_id.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.por_id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter((holder) => holder.status === selectedStatus);
    }

    // Tenure filter
    if (selectedTenure) {
      filtered = filtered.filter(
        (holder) => holder.tenure_year === selectedTenure,
      );
    }

    // Department filter
    if (selectedDepartment) {
      filtered = filtered.filter(
        (holder) => holder.position_id.unit_id.name === selectedDepartment,
      );
    }

    setFilteredHolders(filtered);
  }, [
    searchTerm,
    selectedStatus,
    selectedTenure,
    selectedDepartment,
    positionHolders,
  ]);

  const handleViewDetails = (holder) => {
    setSelectedHolder(holder);
    setShowDetails(true);
  };

  const handleEdit = (holder) => {
    console.log("Edit position holder:", holder);
    // Navigate to edit form or open edit modal
    alert("comming soon");
  };

  const handleDelete = (holder) => {
    alert("comming soon");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      completed: "bg-blue-100 text-blue-700",
      terminated: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <UserCheck className="w-3 h-3" />,
      completed: <Award className="w-3 h-3" />,
      terminated: <Clock className="w-3 h-3" />,
    };
    return icons[status] || <UserCheck className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  View Position Holders
                </h1>
                <p className="text-sm text-gray-600">
                  Browse and manage position holder assignments
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, student ID, position, or POR ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedTenure}
                  onChange={(e) => setSelectedTenure(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">All Tenure Years</option>
                  {tenureYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {filteredHolders.length} of {positionHolders.length}{" "}
              position holders
            </div>
          </div>
        </div>

        {/* Position Holders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHolders.map((holder) => (
            <div
              key={holder._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {holder.user_id?.personal_info?.name || "N/A"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {holder.user_id?.user_id || "N/A"} •{" "}
                      {holder.user_id?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      POR ID: {holder.por_id}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(holder.status)}`}
                    >
                      {getStatusIcon(holder.status)}
                      {holder.status.charAt(0).toUpperCase() +
                        holder.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {holder.position_id.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {holder.position_id.unit_id.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Tenure: {holder.tenure_year}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                      <Award className="w-3 h-3" />
                      <span>Events</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {holder.performance_metrics.events_organized}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Budget</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(
                        holder.performance_metrics.budget_utilized,
                      )}
                    </p>
                  </div>
                </div>

                {/* Appointment Info */}
                {holder.appointment_details.appointed_by && (
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                    <span className="font-medium">Appointed by:</span>{" "}
                    {holder.appointment_details.appointed_by.personal_info.name}
                    <br />
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(holder.appointment_details.appointment_date)}
                  </div>
                )}

                {/* Feedback Preview */}
                {holder.performance_metrics.feedback && (
                  <div className="text-xs text-gray-600 bg-blue-50 rounded p-2">
                    <p className="line-clamp-2">
                      {holder.performance_metrics.feedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(holder)}
                    className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(holder)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(holder)}
                    className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHolders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No position holders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Position Holder Details Modal */}
        {showDetails && selectedHolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedHolder.user_id.personal_info.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedHolder.position_id.title} • POR ID:{" "}
                      {selectedHolder.por_id}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Information */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-500" />
                    User Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {selectedHolder.user_id.personal_info.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {selectedHolder.user_id.username}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student ID:</span>
                      <span className="font-medium">
                        {selectedHolder.user_id.user_id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Position Information */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Position Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">
                        {selectedHolder.position_id.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">
                        {selectedHolder.position_id.unit_id.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {selectedHolder.position_id.position_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tenure Year:</span>
                      <span className="font-medium">
                        {selectedHolder.tenure_year}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(selectedHolder.status)}`}
                      >
                        {getStatusIcon(selectedHolder.status)}
                        {selectedHolder.status.charAt(0).toUpperCase() +
                          selectedHolder.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                {(selectedHolder.appointment_details.appointed_by ||
                  selectedHolder.appointment_details.appointment_date) && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      Appointment Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {selectedHolder.appointment_details.appointed_by && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Appointed By:</span>
                          <span className="font-medium">
                            {
                              selectedHolder.appointment_details.appointed_by
                                .personal_info.name
                            }
                          </span>
                        </div>
                      )}
                      {selectedHolder.appointment_details.appointment_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Appointment Date:
                          </span>
                          <span className="font-medium">
                            {formatDate(
                              selectedHolder.appointment_details
                                .appointment_date,
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    Performance Metrics
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-white rounded-lg p-3">
                        <Award className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedHolder.performance_metrics.events_organized}
                        </div>
                        <div className="text-sm text-gray-600">
                          Events Organized
                        </div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-3">
                        <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(
                            selectedHolder.performance_metrics.budget_utilized,
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Budget Utilized
                        </div>
                      </div>
                    </div>

                    {selectedHolder.performance_metrics.feedback && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Performance Feedback:
                        </label>
                        <div className="bg-white rounded-lg p-3 text-gray-700">
                          {selectedHolder.performance_metrics.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    Timeline
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {formatDate(selectedHolder.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {formatDate(selectedHolder.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPositionHolder;
