import { usePositions } from "../../hooks/usePositions";
import { PositionCard, SearchInput } from "./PositionCard";

const ViewPosition = () => {
  const {
    filteredPositions,
    searchTerm,
    setSearchTerm,
    selectedUnit,
    setSelectedUnit,
    selectedType,
    setSelectedType,
    setSelectedPosition,
    setShowDetails,
    units,
    positionTypes,
  } = usePositions();

  return (
    <div className="min-h-screen bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg mb-6">
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search positions..."
              />
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="px-3 py-2 bg-white text-black border border-[#DCD3C9] rounded-lg"
              >
                <option value="">All Departments</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPositions.map((position) => (
            <PositionCard
              key={position._id}
              position={position}
              onViewDetails={(pos) => {
                setSelectedPosition(pos);
                setShowDetails(true);
              }}
              onEdit={() => alert("Edit coming soon")}
              onDelete={() => alert("Delete coming soon")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPosition