import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  MapPin,
} from "lucide-react";
import api from "../../utils/api";
const ViewPosition = () => {
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await api.get(`/api/positions/get-all`);
        setPositions(res.data);
        setFilteredPositions(res.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, []);

  // Get unique units and position types for filters
  const units = [...new Set(positions.map((pos) => pos.unit_id.name))];
  const positionTypes = [...new Set(positions.map((pos) => pos.position_type))];

  // Filter positions based on search and filters
  useEffect(() => {
    let filtered = positions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (position) =>
          position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          position.position_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          position.unit_id.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          position.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Unit filter
    if (selectedUnit) {
      filtered = filtered.filter(
        (position) => position.unit_id.name === selectedUnit,
      );
    }

    // Position type filter
    if (selectedType) {
      filtered = filtered.filter(
        (position) => position.position_type === selectedType,
      );
    }

    setFilteredPositions(filtered);
  }, [searchTerm, selectedUnit, selectedType, positions]);

  const handleViewDetails = (position) => {
    setSelectedPosition(position);
    setShowDetails(true);
  };

  const handleEdit = (position) => {
    console.log("Edit position:", position);
    alert("comming soon");
  };

  const handleDelete = (position) => {
    // if (window.confirm(`Are you sure you want to delete the position "${position.title}"?`)) {
    //   console.log('Delete position:', position);
    // }
    alert("comming soon");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getYearLabel = (year) => {
    const labels = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
    };
    return labels[year] || `${year}th Year`;
  };

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
                  View Positions
                </h1>
                <p className="text-sm text-gray-600">
                  Browse and manage organizational positions
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search positions by title, ID, department, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">All Departments</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">All Types</option>
                  {positionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {filteredPositions.length} of {positions.length} positions
            </div>
          </div>
        </div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPositions.map((position) => (
            <div
              key={position._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {position.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID: {position.position_id}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {position.position_type}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  {position.unit_id.name}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {position.position_count} position
                  {position.position_count !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {position.description}
                  </p>
                </div>

                {/* Requirements Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Min CGPA: {position.requirements.min_cgpa}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {getYearLabel(position.requirements.min_year)}+
                    </span>
                  </div>

                  {position.requirements.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {position.requirements.skills_required
                        .slice(0, 3)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      {position.requirements.skills_required.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{position.requirements.skills_required.length - 3}{" "}
                          more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Created {formatDate(position.created_at)}
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(position)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(position)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(position)}
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
        {filteredPositions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No positions found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Position Details Modal */}
        {showDetails && selectedPosition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedPosition.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      ID: {selectedPosition.position_id}
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
                {/* Basic Information */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Basic Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">
                        {selectedPosition.unit_id.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {selectedPosition.position_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Positions Available:
                      </span>
                      <span className="font-medium">
                        {selectedPosition.position_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {formatDate(selectedPosition.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                    {selectedPosition.description}
                  </p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {selectedPosition.responsibilities.map(
                      (responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700">
                            {responsibility}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Requirements
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum CGPA:</span>
                      <span className="font-medium">
                        {selectedPosition.requirements.min_cgpa}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Year:</span>
                      <span className="font-medium">
                        {getYearLabel(selectedPosition.requirements.min_year)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Required Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPosition.requirements.skills_required.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                            >
                              {skill}
                            </span>
                          ),
                        )}
                      </div>
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

export default ViewPosition;
