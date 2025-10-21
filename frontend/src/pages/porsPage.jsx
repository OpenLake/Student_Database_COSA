import { SidebarProvider } from "../hooks/useSidebar";
import Layout from "../Components/common/Layout";
import { useState } from "react";
import PORs from "../Components/Positions/PORs";
import WorkAssigned from "../Components/Positions/WorkAssigned";
import ClubPoints from "../Components/Positions/ClubPoints";

const PORsPage = () => {
  const components = {
    PORs: PORs,
    WorkAssigned: WorkAssigned,
    ClubPoints: ClubPoints,
  };
  const gridConfig = [
    {
      id: "main",
      component: "PORs",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 16,
      },
    },
    {
      id: "work",
      component: "WorkAssigned",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 8,
      },
    },
    {
      id: "points",
      component: "ClubPoints",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 8,
        rowEnd: 16,
      },
    },
  ];
  return (
    <Layout headerText="PORs" gridConfig={gridConfig} components={components} />
  );
};

export default PORsPage;
