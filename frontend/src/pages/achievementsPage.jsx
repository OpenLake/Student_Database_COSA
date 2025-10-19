import Achievements from "../Components/Achievements/Achievements";
import AchievementsStats from "../Components/Achievements/AchievementsStats";
import Certificates from "../Components/Achievements/Certificates";
import Layout from "../Components/common/Layout";

const AchievementsPage = () => {
  const components = {
    Achievements: Achievements,
    Certificates: Certificates,
    AchievementsStats: AchievementsStats,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Achievements",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 16,
      },
    },
    {
      id: "certificates",
      component: "Certificates",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 8,
        rowEnd: 16,
      },
    },
    {
      id: "main",
      component: "AchievementsStats",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 8,
      },
    },
  ];
  return (
    <Layout
      headerText="Achievements"
      gridConfig={gridConfig}
      components={components}
    />
  );
};

export default AchievementsPage;
