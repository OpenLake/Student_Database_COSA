import React, { useContext } from "react";
import {
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Award,
  Clock,
  DollarSign,
} from "lucide-react";
import { usePositionHolders } from "../../hooks/usePositionHolders";
import { PositionHolderCard, SearchInput } from "./PositionCard";
import { AdminContext } from "../../context/AdminContext";

const ViewPositionHolder = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const {
    filteredHolders,
    positionHolders,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedTenure,
    setSelectedTenure,
    selectedDepartment,
    setSelectedDepartment,
    selectedHolder,
    setSelectedHolder,
    showDetails,
    setShowDetails,
    statuses,
    tenureYears,
    departments,
  } = usePositionHolders();

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl">
        {/* Header with Search and Filters */}
        <div className="bg-white rounded-lg mb-6">
          <div className="space-y-4">
            <div className="flex :flex-row gap-2">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name, email, ID, position, or POR ID..."
              />
              <div className="flex flex-wrap gap-2">
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
                {userRole !== "CLUB_COORDINATOR" && (
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
                )}
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
            <PositionHolderCard
              holder={holder}
              onViewDetails={() => handleViewDetails(holder)}
              onEdit={() => handleEdit(holder)}
              onDelete={() => handleDelete(holder)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredHolders.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
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
