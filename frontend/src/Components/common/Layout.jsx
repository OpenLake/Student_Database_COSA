import React from "react";
import Sidebar from "./Sidebar";
import { useProfile } from "../../hooks/useProfile";

const GridLayout = ({ config, components }) => {
  return (
    <div className="grid grid-cols-20 grid-rows-16 gap-3 w-full h-full">
      {config.map((item, index) => {
        const Component = components[item.component];

        if (!Component) {
          console.warn(`Component "${item.component}" not found`);
          return null;
        }

        const colStart = item.position.colStart + 1;
        const colEnd = item.position.colEnd + 1;
        const rowStart = item.position.rowStart + 1;
        const rowEnd = item.position.rowEnd + 1;

        return (
          <div
            key={item.id || index}
            style={{
              gridColumnStart: colStart,
              gridColumnEnd: colEnd,
              gridRowStart: rowStart,
              gridRowEnd: rowEnd,
            }}
            className="bg-white rounded-2xl shadow-sm overflow-auto"
          >
            <Component {...item.props} />
          </div>
        );
      })}
    </div>
  );
};

const Layout = ({ headerText, gridConfig, components, children }) => {
  const { profile } = useProfile();
  const details =
    profile?.academic_info?.batch_year +
    " | " +
    profile?.academic_info?.program +
    " | " +
    profile?.user_id;

  return (
    <div className="h-screen overflow-hidden bg-[#000]">
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-56 h-screen p-6">
        <div className="bg-[#f5f1e8] rounded-[3rem] h-full flex flex-col p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h1 className="text-3xl text-black">
              Welcome to the <span className="font-bold">{headerText}</span>
            </h1>

            {/* Profile Section */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-base font-semibold text-black">
                  {profile?.personal_info?.name || "Profile Name"}
                </div>
                <div className="text-xs text-black/60">
                  {details || "Profile Details"}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                {profile?.personal_info?.profilePic ? (
                  <img
                    src={profile?.personal_info.profilePic}
                    alt={profile?.personal_info.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-400 text-white font-semibold text-sm">
                    {profile?.personal_info?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Area - Grid or Children */}
          <div className="flex-1 min-h-0">
            {gridConfig && components ? (
              <GridLayout config={gridConfig} components={components} />
            ) : (
              <div className="bg-white/50 rounded-3xl p-4 h-full overflow-auto">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
