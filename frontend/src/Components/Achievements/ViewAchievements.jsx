import { Search, Trophy } from "lucide-react";
import AchievementCard from "./AchievementCard";
import { useAchievements } from "../../hooks/useAchievements";
import { FilterSection } from "../Feedback/FilterSection";
// import FilterSection from "./FilterSection";

const ViewAchievements = () => {
  const {
    achievements,
    filteredAchievements,
    loading,
    error,
    categoryFilter,
    setCategoryFilter,
    searchTerm,
    setSearchTerm,
    verificationFilter,
    setVerificationFilter,
    levelFilter,
    setLevelFilter,
    uniqueCategories,
    uniqueLevels,
  } = useAchievements();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading your achievements...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-6 py-2 w-full mx-auto rounded-lg">
      {/* Header */}
      <div className="bg-white rounded-lg">
        <div className="flex-1 relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
          />
        </div>
        {/* Filters */}
        <div className="grid grid-cols-2 gap-6">
          <FilterSection
            label="Filter by Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={uniqueCategories}
          />
          <FilterSection
            label="Filter by Level"
            value={levelFilter}
            onChange={setLevelFilter}
            options={uniqueLevels}
          />
        </div>

        {/* <FilterSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            verificationFilter={verificationFilter}
            setVerificationFilter={setVerificationFilter}
            uniqueCategories={uniqueCategories}
            uniqueLevels={uniqueLevels}
          /> */}

        {/* Results Count */}
        <div className="px-6 py-3">
          <p className="text-sm text-gray-600">
            Showing {filteredAchievements.length} of {achievements.length}{" "}
            achievements
          </p>
        </div>
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No achievements found
          </h3>
          <p className="text-gray-600">
            {achievements.length === 0
              ? "You haven't added any achievements yet."
              : "No achievements match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement._id} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAchievements;
