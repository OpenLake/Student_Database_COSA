import React, { useState } from "react";
import { Eye, Plus } from "lucide-react";
import ViewAchievements from "./ViewAchievements";
import AchievementForm from "./AchievementForm";

const Achievements = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">
            Achievements
          </div>
          <div className="text-gray-600 mt-2">
            Track and showcase your accomplishments
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-black rounded-lg"
        >
          {showForm ? (
            <>
              <Eye className="w-5 h-5" />
              <span>View Achievements</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Add Achievement</span>
            </>
          )}
        </button>
      </div>
      {showForm ? <AchievementForm /> : <ViewAchievements />}
    </div>
  );
};

export default Achievements;
