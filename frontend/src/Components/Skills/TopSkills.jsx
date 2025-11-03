import React from "react";
import { useTopSkills } from "../../hooks/useTopSkills";
import { Loader2 } from "lucide-react";

const TopSkills = () => {
  const { topSkills, loading } = useTopSkills();

  return (
    <div className="px-6 pt-6 pb-3 flex flex-col items-start justify-between flex-wrap gap-3 w-full h-full overflow-y-auto">
      {/* Header */}
      <div className="text-2xl font-bold tracking-tight text-gray-900">
        Top 5 Skills
      </div>

      {/* Loader / Empty / List */}
      {loading ? (
        <div className="flex justify-center items-center flex-1 w-full">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : topSkills.length === 0 ? (
        <div className="flex justify-center items-center flex-1 w-full">
          <p className="text-gray-500 text-sm text-center">
            No skills data available yet.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-0.5 flex-1 overflow-y-auto w-full -ml-1">
          {topSkills.slice(0, 5).map((skill, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 rounded-md px-1 py-0.5 border border-gray-200 hover:bg-gray-100 transition-all"
            >
              <div className="flex flex-col text-left">
                <p className="text-[12.5px] font-medium text-gray-800 truncate leading-tight">
                  {index + 1}. {skill.skillName}
                </p>
                <p className="text-[10.5px] text-gray-500 capitalize leading-tight">
                  {skill.type}
                </p>
              </div>
              <span className="text-[10.5px] font-semibold text-indigo-600 whitespace-nowrap">
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
