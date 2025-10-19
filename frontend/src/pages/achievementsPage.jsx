import Achievements from "../Components/Achievements/Achievements";
import Layout from "../Components/common/Layout";

const AchievementsPage = () => {
  const components = {
    Achievements: Achievements,
  };
  const gridConfig = [
    {
      id: "main",
      component: "Achievements",
      position: {
        colStart: 0,
        colEnd: 15,
        rowStart: 0,
        rowEnd: 16,
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
