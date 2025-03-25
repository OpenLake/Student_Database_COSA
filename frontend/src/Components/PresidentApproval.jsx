import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default function PresidentApproval() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/room/requests`);
      setBookings(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load booking requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/room/request/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
      setError(`Failed to ${status.toLowerCase()} booking. Please try again.`);
    }
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Approved: "bg-green-100 text-green-800 border border-green-200",
      Rejected: "bg-red-100 text-red-800 border border-red-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      booking.status.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  const stats = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    approved: bookings.filter((b) => b.status === "Approved").length,
    rejected: bookings.filter((b) => b.status === "Rejected").length,
  };

  const TabButton = ({ name, label, count }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
        activeTab === name
          ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
      }`}
    >
      {label}{" "}
      {count > 0 && (
        <span className="ml-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                President Approval Panel
              </h1>
              <button
                onClick={fetchBookings}
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center gap-2"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold">{stats.all}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-6 pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-1">
                <TabButton name="all" label="All Requests" count={stats.all} />
                <TabButton
                  name="pending"
                  label="Pending"
                  count={stats.pending}
                />
                <TabButton
                  name="approved"
                  label="Approved"
                  count={stats.approved}
                />
                <TabButton
                  name="rejected"
                  label="Rejected"
                  count={stats.rejected}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Loading booking requests...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-gray-500 font-medium">
                No booking requests found
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto mx-6 mb-6 rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.room}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {booking.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.status === "Pending" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                updateStatus(booking._id, "Approved")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200 shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(booking._id, "Rejected")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200 shadow-sm"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            No actions available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
