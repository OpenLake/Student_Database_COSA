import React from "react";
import { AdminContext } from "../context/AdminContext";
import ViewPositionHolder from "./Positions/ViewPositionHolder";

const ManagePositions = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);

  if (!isUserLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black">
        Please login to view your positions.
      </div>
    );
  }

  return (
    <div className="px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className=" pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center justify-between">
          <div className="">
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Your PORs
            </div>
          </div>
        </div>
        <div className="w-full h-[2px] bg-gray-300"></div>
      </div>
      <ViewPositionHolder />
    </div>
  );
};

export default ManagePositions;
