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

// New Theme Color Palette:
// Background: #FDFAE2 (Cream)
// Primary Text: #5E4B3D (Dark Brown)
// Secondary Text: #7D6B5F (Muted Brown)
// Accent: #A98B74 (Warm Tan)
// Accent Hover: #856A5D (Darker Tan)
// Borders: #DCD3C9 (Light Tan)
// Light Backgrounds: #F5F1EC (Light Cream)
// Light Accent Backgrounds: #EAE0D5 (Very Light Tan)

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
    alert("coming soon");
  };

  const handleDelete = (position) => {
    // if (window.confirm(`Are you sure you want to delete the position "${position.title}"?`)) {
    //   console.log('Delete position:', position);
    // }
    alert("coming soon");
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
    <div className="min-h-screen bg-white px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg [#DCD3C9] mb-6">

          {/* Search and Filters */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search positions by title, ID, department, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-black placeholder-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="px-3 py-2 bg-white text-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
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
                  className="px-3 py-2 bg-white text-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
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
            <div className="text-sm text-black">
              Showing {filteredPositions.length} of {positions.length} positions
            </div>
          </div>
        </div>

{/* Positions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPositions.map((position) => (
            <div
              key={position._id}
              className="bg-white rounded-lg border-2 border-black hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Card Header (Removed the extra div wrapper and the bottom border) */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-black pr-2">
                    {position.title}
                  </h4>
                  <span className="flex-shrink-0 px-2 py-1 bg-[#EAE0D5] text-[#856A5D] text-xs rounded-full">
                    {position.position_type}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-black mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{position.unit_id.name}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-black">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {position.position_count} position
                    {position.position_count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Card Actions (This top border now creates the single separator line) */}
              <div className="p-4 border-t border-[#DCD3C9]">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(position)}
                    className="flex-1 px-1 py-2 bg-black text-white text-sm rounded-lg hover:bg-[#856A5D] transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(position)}
                    className="px-3 py-2 bg-[#F5F1EC] text-black text-sm rounded-lg hover:bg-[#EAE0D5] transition-colors"
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
          <div className="bg-white rounded-lg [#DCD3C9] p-12 text-center">
            <Eye className="w-12 h-12 text-black mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              No positions found
            </h3>
            <p className="text-black">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* MODAL START: Redesigned for better layout and professionalism */}
        {showDetails && selectedPosition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-[#DCD3C9] px-6 py-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-black">
                        {selectedPosition.title}
                      </h2>
                      <p className="text-sm text-black">
                        ID: {selectedPosition.position_id}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-[#EAE0D5] text-[#856A5D] text-xs rounded-full">
                      {selectedPosition.position_type}
                    </span>
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
                  {/* Left Column: Key Details & Requirements */}
                  <div className="md:col-span-1 space-y-6">
                    {/* Details Section */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black border-b border-[#DCD3C9] pb-2">
                        Details
                      </h3>
                      <div className="text-sm space-y-2 pt-2">
                        <div className="flex justify-between">
                          <span className="text-black">Department:</span>
                          <span className="font-medium text-black text-right">
                            {selectedPosition.unit_id.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black">Available:</span>
                          <span className="font-medium text-black">
                            {selectedPosition.position_count}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black">Created:</span>
                          <span className="font-medium text-black">
                            {formatDate(selectedPosition.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black border-b border-[#DCD3C9] pb-2">
                        Requirements
                      </h3>
                      <div className="text-sm space-y-2 pt-2">
                        <div className="flex justify-between">
                          <span className="text-black">Min. CGPA:</span>
                          <span className="font-medium text-black">
                            {selectedPosition.requirements.min_cgpa}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black">Min. Year:</span>
                          <span className="font-medium text-black">
                            {getYearLabel(
                              selectedPosition.requirements.min_year,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black border-b border-[#DCD3C9] pb-2">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {selectedPosition.requirements.skills_required.length >
                        0 ? (
                          selectedPosition.requirements.skills_required.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-[#EAE0D5] text-[#856A5D] text-sm rounded"
                              >
                                {skill}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-sm text-black">
                            No specific skills listed.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Description & Responsibilities */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Description Section */}
                    <div>
                      <h3 className="font-semibold text-black mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-black bg-[#F5F1EC] rounded-lg p-4">
                        {selectedPosition.description}
                      </p>
                    </div>

                    {/* Responsibilities Section */}
                    <div>
                      <h3 className="font-semibold text-black mb-2">
                        Responsibilities
                      </h3>
                      <ul className="space-y-2">
                        {selectedPosition.responsibilities.map(
                          (resp, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3"
                            >
                              <span className="w-2 h-2 bg-black rounded-full mt-[7px] flex-shrink-0"></span>
                              <span className="text-sm text-black">
                                {resp}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* MODAL END */}
      </div>
    </div>
  );
};

export default ViewPosition;