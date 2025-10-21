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
import ViewPositionHolder from "./Positions/ViewPositionHolder";
import LoadingSpinner from "./common/LoadingScreen";
import LoadingSpinner from "./common/LoadingScreen";

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
      <LoadingSpinner/>
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
    <div className="px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className=" pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div className="">
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Your PORs
            </div>
          </div>
        </div>
        <div className="w-full h-[2px] bg-gray-300"></div>
      </div>
      <ViewPositionHolder />
    </div>
  );
};

export default ManagePositions;
