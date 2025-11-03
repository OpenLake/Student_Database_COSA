import React from "react";
import { useTopSkills } from "../../hooks/useTopSkills";
import { Loader2 } from "lucide-react";

const TopSkills = () => {
  const { topSkills, loading } = useTopSkills();

  // Define the common padding used across the component
  const cardPadding = "px-6";
  // We'll use this constant to pull the card leftwards by this much.
  const negativeMarginLeft = "-ml-6";

  return (
    // Outer container: Base padding for the header (px-6).
    <div
      className={`pt-6 pb-2 flex flex-col items-start justify-between flex-wrap gap-4 h-full overflow-hidden ${cardPadding}`}
    >
      {/* Header */}
      <div className="text-2xl font-bold tracking-tight text-gray-900">
        Top 5 Skills
      </div>

      {/* --- */}

      {/* Loader / Empty / List */}
      {loading ? (
        <div className="flex justify-center items-center flex-1 w-full">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        </div>
      ) : topSkills.length === 0 ? (
        <div className="flex justify-center items-center flex-1 w-full">
          <p className="text-gray-500 text-sm text-center py-4">
            No skills data available yet.
          </p>
        </div>
      ) : (
        // List Container (ul):
        // 1. Removed -mx-6.
        // 2. Used pr-2 only for scrollbar space.
        <ul className="flex flex-col gap-3 flex-1 overflow-y-auto w-full pt-1 pr-2">
          {topSkills.slice(0, 5).map((skill, index) => (
            <li
              key={index}
              // Horizontal Stretch Fix:
              // 1. **-ml-6:** Pulls the card to the left edge of the parent container.
              // 2. **w-[calc(100%+24px)]:** Compensates for the negative left margin (6 units in Tailwind is 1.5rem or 24px)
              //    to ensure the card stretches the full width to the right edge (where the scrollbar sits).
              // 3. **pl-6:** Pushes the internal content (Rank, Name) back to align with the header.
              // 4. **pr-6:** Ensures the badge aligns with the right edge of the header's boundary.
              className={`flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:bg-gray-50 transition-all duration-200 py-2 ${negativeMarginLeft} w-[calc(100%+24px)] pl-6 pr-6`}
            >
              {/* Left side */}
              <div className="flex items-center space-x-3">
                {/* Rank: Reduced width and added consistent right-alignment */}
                <span className="text-lg font-semibold text-indigo-600 w-6 text-right">
                  {index + 1}
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-900 truncate">
                    {skill.skillName}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {skill.type}
                  </span>
                </div>
              </div>

              {/* Right side */}
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full px-2.5 py-0.5 whitespace-nowrap">
                {skill.totalUsers} users
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopSkills;
