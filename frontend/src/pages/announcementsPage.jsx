import { useState } from "react";
import Layout from "../Components/common/Layout";
import Announcements from "../Components/Announcements/Announcements";

const announcementsPage = () => {
  const components = {
    Announcements: Announcements,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Announcements",
      position: {
        colStart: 0,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 16,
      },
    },
  ];

  return (
    <Layout
      headerText="Announcements"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default announcementsPage;
