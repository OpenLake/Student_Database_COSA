import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import Sidebar from "./Sidebar";
import { dashboardComponents } from "../../config/dashboardComponents";

const Dashboard = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const [selected, setSelected] = useState("dashboard"); // default selected

  const SelectedComponent =
    dashboardComponents[selected] || (() => <div>Select something</div>);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFAE2]">
      {/* Sidebar */}
      <Sidebar selected={selected} setSelected={setSelected} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <h2 className="text-[36px] font-semibold mb-4 font-poppins" >
          Welcome to {isUserLoggedIn?.role
  ?.toLowerCase()
  ?.replace(/_/g, " ")
  ?.replace(/^\w/, c => c.toUpperCase())} Dashboard
        </h2>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Left Section */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="bg-gray-100 rounded-md shadow flex-1 overflow-auto">
              <SelectedComponent />
            </div>

            {/* Only show small boxes if dashboard is selected */}
            {selected === "dashboard" && (
              <div className="flex gap-4 h-1/3">
                <div className="bg-gray-100 rounded-md shadow p-4 flex-1">
                  Small box 1
                </div>
                <div className="bg-gray-100 rounded-md shadow p-4 flex-1">
                  Small box 2
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-1/4 flex flex-col gap-4 overflow-auto">
            <div className="bg-gray-100 rounded-md shadow p-4 flex-1">
              Right box 1
            </div>
            <div className="bg-gray-100 rounded-md shadow p-4 flex-1">
              Right box 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
