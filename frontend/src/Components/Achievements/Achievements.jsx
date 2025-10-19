import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Eye, Plus } from "lucide-react";
import ViewAchievements from "./ViewUserAchievements";
import AchievementForm from "./AddUserAchievements";
import AchievementsEndorsementTab from "../GenSec/AchievementsEndorsementTab";

const Achievements = () => {
  const [add, setAdd] = useState(false);
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";

  return (
    <div>
      {" "}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div className="">
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Achievements
            </div>
            <div className="text-gray-600 mt-2">Everything you've achieved</div>
          </div>
        </div>
        {userRole === "STUDENT" && (
          <button
            onClick={() => setAdd(!add)}
            className="flex items-center gap-2 bg-[#A98B74] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#856A5D] transition-colors"
          >
            {add ? (
              <div className="flex gap-2">
                <Plus className="w-6 h-6" /> <span>Add Achievementss</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Eye />
                <span>View Achievementss</span>
              </div>
            )}
          </button>
        )}
        {userRole === "STUDENT" ? (
          add ? (
            <AchievementForm />
          ) : (
            <ViewAchievements />
          )
        ) : (
          <AchievementsEndorsementTab />
        )}
      </div>
    </div>
  );
  //   return (
  //     <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
  //       <div className="flex items-center justify-between">
  //         <div className="">
  //           <div className="text-2xl font-bold tracking-tight text-gray-900">
  //             Manage Positions
  //           </div>
  //         </div>
  //       </div>
  //       <button
  //         onClick={() => setAdd(!add)}
  //         className="flex items-center gap-2 bg-[#A98B74] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#856A5D] transition-colors"
  //       >
  //         {add ? (
  //           <div className="flex gap-2">
  //             <Plus className="w-6 h-6" /> <span>Add Position</span>
  //           </div>
  //         ) : (
  //           <div className="flex gap-2">
  //             <Eye className="w-6 h-6" /> <span>View Position</span>
  //           </div>
  //         )}
  //       </button>
  //       {add ? <CreateTenure /> : <ViewTenure />}
  //     </div>
  //   );
};

export default Achievements;
