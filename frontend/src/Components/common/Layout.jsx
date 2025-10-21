import React from "react";
import Sidebar from "./Sidebar";
import { useProfile } from "../../hooks/useProfile";
import UserIcon from "./userIcon";
import { useSidebar } from "../../hooks/useSidebar";

const GridLayout = ({ config, components }) => {
  const { isCollapsed } = useSidebar();
  return (
    <div
      className={`grid ${isCollapsed ? "grid-cols-24" : "grid-cols-20"} grid-rows-16 gap-3 w-full h-full transition-all duration-300`}
      style={{
        gridTemplateColumns: `repeat(${isCollapsed ? 25 : 20}, minmax(0, 1fr))`,
      }}
    >
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

const Layout = ({ headerText, gridConfig, components, children = null }) => {
  const { isCollapsed } = useSidebar();
  return (
    <div className="h-screen overflow-hidden bg-[#000]">
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`h-screen p-6 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-56"}`}
      >
        <div className="bg-[#FDFAE2] rounded-[3rem] h-full flex flex-col p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h1 className="text-3xl text-black">
              Welcome to the <span className="font-bold">{headerText}</span>{" "}
              Section
            </h1>
            {/* Profile Section */}
            <UserIcon />
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
