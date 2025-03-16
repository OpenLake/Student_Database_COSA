import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default function GensecSciTechDashboard() {
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

  const getStatusBadge = (status) => {
    const badgeClasses = {
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Approved: "bg-green-100 text-green-800 border border-green-200",
      Rejected: "bg-red-100 text-red-800 border border-red-200"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[status]}`}>
        {status}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === "" || 
      booking.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      booking.status.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });

  const stats = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "Pending").length,
    approved: bookings.filter(b => b.status === "Approved").length,
    rejected: bookings.filter(b => b.status === "Rejected").length
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">GenSec Sci-Tech Dashboard</h1>
              <button 
                onClick={fetchBookings}
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center gap-2"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold">{stats.all}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
