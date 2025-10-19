import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import CreateOrgUnit from "./CreateOrgUnit";

const Organization = () => {
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
              Organizational Units
            </div>
            <div className="text-gray-600 mt-2">
              Every Club, Committee, & Council within CoSA
            </div>
          </div>
        </div>
        <CreateOrgUnit />
      </div>
    </div>
  );
};

export default Organization;
