import LeftColumn from "../Components/Dashboard/LeftColumn";
import UpdatesCard from "../Components/common/LatestUpdatesCard";
import Layout from "../Components/common/Layout";
import Home from "../Components/Dashboard/Home";
import Calendar from "../Components/common/Calendar";

export const HomePage = () => {
  const components = {
    Home: Home,
    LeftColumn: LeftColumn,
    UpdatesCard: UpdatesCard,
    Calendar: Calendar,
  };

  const gridConfig = [
    {
      id: "hero",
      component: "Home",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 10,
      },
    },
    {
      id: "stats",
      component: "LeftColumn",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 10,
        rowEnd: 16,
      },
      props: {},
    },
    {
      id: "updates",
      component: "UpdatesCard",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 7,
        rowEnd: 16,
      },
    },
    {
      id: "calendar",
      component: "Calendar",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 0,
        rowEnd: 7,
      },
    },
  ];

  return (
    <Layout
      headerText="Dashboard"
      gridConfig={gridConfig}
      components={components}
    />
  );
};
