import { SidebarProvider } from "../hooks/useSidebar";
import Layout from "../Components/common/Layout";
import { useState } from "react";
import PORs from "../Components/Positions/PORs";

const PORsPage = () => {
  const components = {
    PORs: PORs,
  };
  const gridConfig = [
    {
      id: "main",
      component: "PORs",
      position: {
        colStart: 0,
        colEnd: 15,
        rowStart: 0,
        rowEnd: 12,
      },
    },
  ];
  return (
    <Layout headerText="PORs" gridConfig={gridConfig} components={components} />
  );
};

export default PORsPage;
