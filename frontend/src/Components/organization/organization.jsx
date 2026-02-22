import React, { useState } from "react";
import { Eye, Plus } from "lucide-react";
import CreateOrgUnit from "./CreateOrgUnit";
import ViewClubs from "./ViewClubs";

const Organization = () => {
  const [add, setAdd] = useState(false);


  return (
    <div>
      {" "}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div className="">
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Organizational Units
            </div>
            <div className="text-gray-600 mt-2">
              Every Club, Committee, & Council within CoSA
            </div>
          </div>
        </div>

        <button
          onClick={() => setAdd(!add)}
          className="flex items-center gap-2 text-black text-sm transition-colors"
        >
          {add ? (
            <div className="flex gap-2">
              <Eye className="w-6 h-6" /> <span>View All Clubs</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <Plus className="w-6 h-6" />
              <span>Add Organizational units</span>
            </div>
          )}
        </button>
      </div>
      {add ? <CreateOrgUnit /> : <ViewClubs />}
    </div>
  );
};

export default Organization;
