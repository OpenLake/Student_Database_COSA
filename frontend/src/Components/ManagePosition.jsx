import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Eye,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Plus,
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
          position.tenure_year.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (tenureFilter !== "all") {
      filtered = filtered.filter((p) => p.tenure_year === tenureFilter);
    }

    setFilteredPositions(filtered);
  }, [positions, searchTerm, statusFilter, tenureFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-[#EAE0D5] text-[#856A5D]",
      terminated: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-[#F5F1EC] text-black";
  };

  const uniqueTenureYears = [
    ...new Set(positions.map((p) => p.tenure_year)),
  ].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black">
        Loading your positions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="text-2xl font-bold tracking-tight text-gray-900">
                Your PORs
              </div>
            </div>
          </div>
          {/* Gray horizontal line separator */}
          {/* <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-[#856A5D] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Position
          </button> */}
          <div className="w-full h-[2px] bg-gray-300"></div>
        </div>

        {/* Filters */}
        <div className="">
          <div className="flex flex lg:flex-row gap-4 pb-2">
            <div className="flex-1 relative round-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, department, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-10 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="terminated">Terminated</option>
              </select>

              <select
                value={tenureFilter}
                onChange={(e) => setTenureFilter(e.target.value)}
                className="px-3 py-2  border-2 border-black rounded-md bg-white text-black focus:outline-none"
              >
                <option value="all">All Tenures</option>
                {uniqueTenureYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-black">
            Showing {filteredPositions.length} of {positions.length} positions
          </div>
        </div>

        {/* Positions Grid */}
        {filteredPositions.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <UserCheck className="w-12 h-12 text-black mx-auto mb-4" />
            <div className="text-lg font-medium text-black mb-2">
              No positions found
            </div>
            <p className="text-black">
              You currently have no assigned positions.
            </p>
          </div>
        ) : (
          <div className="py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPositions.map((position) => (
              <div
                key={position._id}
                className="bg-white rounded-lg shadow-sm border-2 border-black hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="px-4 py-2  flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-black text-xl">
                        {position.position_id?.title || "Unknown Position"}
                      </div>
                      <div className="text-sm text-black">
                        {position.position_id?.unit_id?.name ||
                          "Unknown Department"}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-2 ml-2 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                        position.status
                      )}`}
                    >
                      {position.status?.charAt(0).toUpperCase() +
                        position.status?.slice(1)}
                    </span>
                  </div>

                  <div className="text-sm text-black">
                    <p>
                      <span className="font-medium">Tenure:</span>{" "}
                      {position.tenure_year}
                    </p>
                    {position.appointment_details?.appointed_by && (
                      <p>
                        <span className="font-medium">Appointed By:</span>{" "}
                        {position.appointment_details.appointed_by
                          ?.personal_info?.name || "Unknown"}
                      </p>
                    )}
                    {position.appointment_details?.appointment_date && (
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {formatDate(
                          position.appointment_details.appointment_date
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* <div className="p-4 bg-[#F5F1EC] flex justify-around text-center">
                  <div>
                    <span className="text-xs text-black">Events</span>
                    <p className="text-lg font-bold text-black">
                      {position.performance_metrics?.events_organized || 0}
                    </p>
                  </div>
                  <div className="border-l border-black h-8"></div>
                  <div>
                    <span className="text-xs text-black">Budget</span>
                    <p className="text-sm font-bold text-black">
                      {formatCurrency(
                        position.performance_metrics?.budget_utilized
                      )}
                    </p>
                  </div>
                </div> */}

                <div className="px-4 py-2 border-t border-black text-xs text-black flex justify-between">
                  <span>Created: {formatDate(position.created_at)}</span>
                  {position.updated_at !== position.created_at && (
                    <span>Updated: {formatDate(position.updated_at)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-black hover:text-black"
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
