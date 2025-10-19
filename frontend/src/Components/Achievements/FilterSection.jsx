import { Filter, Search } from "lucide-react";

const FilterSection = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  verificationFilter,
  setVerificationFilter,
  uniqueCategories,
  uniqueLevels,
}) => (
  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search achievements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <select
        value={levelFilter}
        onChange={(e) => setLevelFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
      >
        <option value="all">All Levels</option>
        {uniqueLevels.map((level) => (
          <option key={level} value={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
      </select>

      {/* Verification Filter */}
      <select
        value={verificationFilter}
        onChange={(e) => setVerificationFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
      >
        <option value="all">All Status</option>
        <option value="verified">Verified</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  </div>
);
export default FilterSection;
