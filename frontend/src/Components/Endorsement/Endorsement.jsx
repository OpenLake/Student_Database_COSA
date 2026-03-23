import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

import GenSecEndorse from "../GenSec/GenSecEndorse";

const Endorsement = () => {

  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";

  return (
    <div>
      {" "}
      <div className="px-6 pt-6 pb-2 flex flex-col items-start justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div className="">
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Endorsement
            </div>
            <div className="text-gray-600 mt-2">
              Endorse student's Achievements and skills
            </div>
          </div>
        </div>
        
        {userRole !== "STUDENT" && <GenSecEndorse />}
      </div>
    </div>
  );
};

export default Endorsement;
