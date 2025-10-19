import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  UserCheck,
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
  ].sort();
  const departments = [
    ...new Set(
      positionHolders.map((holder) => holder.position_id?.unit_id?.name)
    ),
  ].filter(Boolean); // Filter out any null/undefined department names

  // Filter position holders
  useEffect(() => {
    let filtered = positionHolders;

    if (searchTerm) {
      filtered = filtered.filter(
        (holder) =>
          holder.user_id?.personal_info?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.user_id?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.user_id?.user_id
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.position_id?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          holder.por_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((holder) => holder.status === selectedStatus);
    }
    if (selectedTenure) {
      filtered = filtered.filter(
        (holder) => holder.tenure_year === selectedTenure
      );
    }
    if (selectedDepartment) {
      filtered = filtered.filter(
        (holder) => holder.position_id?.unit_id?.name === selectedDepartment
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
    alert("coming soon");
  };

  const handleDelete = (holder) => {
    alert("coming soon");
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
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
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-[#EAE0D5] text-[#856A5D]",
      terminated: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-[#F5F1EC] text-black";
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
    <div className="min-h-screen bg-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg [#DCD3C9] mb-6">
          {/* Search and Filters */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, ID, position, or POR ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-black placeholder-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-white text-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
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
                  className="px-3 py-2 bg-white text-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                >
                  <option value="">All Tenures</option>
                  {tenureYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 bg-white text-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
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
            <div className="text-sm text-black">
              Showing {filteredHolders.length} of {positionHolders.length}{" "}
              position holders
            </div>
          </div>
        </div>

        {/* Position Holders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHolders.map((holder) => (
            <div
              key={holder._id}
              className="bg-white rounded-lg border-2 border-black hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-4  flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-lg">
                      {holder.user_id?.personal_info?.name || "N/A"}
                    </h3>
                    <p className="text-sm text-black truncate">
                      {holder.user_id?.user_id || "N/A"} •{" "}
                      {holder.user_id?.username || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 ml-2 rounded-full text-xs font-medium flex-shrink-0 flex items-center gap-1 ${getStatusColor(holder.status)}`}
                  >
                    {getStatusIcon(holder.status)}
                    {holder.status?.charAt(0).toUpperCase() +
                      holder.status?.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-black">
                    {holder.position_id?.title || "Unknown Position"}
                  </p>
                  <p className="text-sm text-black">
                    {holder.position_id?.unit_id?.name || "Unknown Dept"}
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-[#DCD3C9]">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(holder)}
                    className="flex-1 px-3 py-2 bg-black text-white text-sm rounded-lg hover:bg-[#856A5D] transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(holder)}
                    className="px-3 py-2 bg-[#F5F1EC] text-black text-sm rounded-lg hover:bg-[#EAE0D5] transition-colors"
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
          <div className="bg-white rounded-lg [#DCD3C9] p-12 text-center">
            <UserCheck className="w-12 h-12 text-black mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              No position holders found
            </h3>
            <p className="text-black">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Position Holder Details Modal */}
        {showDetails && selectedHolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-[#DCD3C9] px-6 py-4 flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      {selectedHolder.user_id?.personal_info?.name || "N/A"}
                    </h2>
                    <p className="text-sm text-black">
                      {selectedHolder.position_id?.title || "N/A"} • POR ID:{" "}
                      {selectedHolder.por_id}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-black hover:text-black"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  {/* Left Column */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black border-b border-[#DCD3C9] pb-2">
                        Holder Details
                      </h3>
                      <div className="text-sm space-y-2 pt-2">
                        <div className="flex justify-between">
                          <span className="text-black">Email:</span>
                          <span className="font-medium text-black truncate">
                            {selectedHolder.user_id?.username || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black">Student ID:</span>
                          <span className="font-medium text-black">
                            {selectedHolder.user_id?.user_id || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black border-b border-[#DCD3C9] pb-2">
                        Position Details
                      </h3>
                      <div className="text-sm space-y-2 pt-2">
                        <div className="flex justify-between">
                          <span className="text-black">Department:</span>
                          <span className="font-medium text-black text-right">
                            {selectedHolder.position_id?.unit_id?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black">Tenure:</span>
                          <span className="font-medium text-black">
                            {selectedHolder.tenure_year}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-black">Status:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedHolder.status)}`}
                          >
                            {getStatusIcon(selectedHolder.status)}
                            {selectedHolder.status?.charAt(0).toUpperCase() +
                              selectedHolder.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black border-b border-[#DCD3C9] pb-2">
                        Performance
                      </h3>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center bg-[#F5F1EC] rounded-lg p-3">
                          <Award className="w-6 h-6 text-black mx-auto mb-2" />
                          <div className="text-2xl font-bold text-black">
                            {selectedHolder.performance_metrics
                              ?.events_organized || 0}
                          </div>
                          <div className="text-sm text-black">
                            Events Organized
                          </div>
                        </div>
                        <div className="text-center bg-[#F5F1EC] rounded-lg p-3">
                          <DollarSign className="w-6 h-6 text-black mx-auto mb-2" />
                          <div className="text-lg font-bold text-black">
                            {formatCurrency(
                              selectedHolder.performance_metrics
                                ?.budget_utilized
                            )}
                          </div>
                          <div className="text-sm text-black">
                            Budget Utilized
                          </div>
                        </div>
                      </div>
                      {selectedHolder.performance_metrics?.feedback && (
                        <div className="pt-2">
                          <label className="block text-sm font-medium text-black mb-1">
                            Feedback:
                          </label>
                          <div className="bg-[#F5F1EC] rounded-lg p-3 text-sm text-black">
                            {selectedHolder.performance_metrics.feedback}
                          </div>
                        </div>
                      )}
                    </div>
                    {(selectedHolder.appointment_details?.appointed_by ||
                      selectedHolder.appointment_details?.appointment_date) && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-black border-b border-[#DCD3C9] pb-2">
                          Appointment
                        </h3>
                        <div className="bg-[#F5F1EC] rounded-lg p-4 text-sm space-y-2">
                          {selectedHolder.appointment_details?.appointed_by && (
                            <div className="flex justify-between">
                              <span className="text-black">Appointed By:</span>
                              <span className="font-medium text-black">
                                {
                                  selectedHolder.appointment_details
                                    .appointed_by?.personal_info?.name
                                }
                              </span>
                            </div>
                          )}
                          {selectedHolder.appointment_details
                            ?.appointment_date && (
                            <div className="flex justify-between">
                              <span className="text-black">Date:</span>
                              <span className="font-medium text-black">
                                {formatDate(
                                  selectedHolder.appointment_details
                                    .appointment_date
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
