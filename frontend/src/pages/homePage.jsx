import QuickStats from "../Components/Dashboard/QuickStats";
import UpdatesCard from "../Components/common/LatestUpdatesCard";
import Layout from "../Components/common/Layout";
import Home from "../Components/Dashboard/Home";
import Calendar from "../Components/common/Calendar";
import { useSidebar } from "../hooks/useSidebar";

export const HomePage = () => {
  const { isCollapsed } = useSidebar();

  const components = {
    Home: Home,
    QuickStats: QuickStats,
    UpdatesCard: UpdatesCard,
    Calendar: Calendar,
  };

  const gridConfig = [
    {
      id: "hero",
      component: "Home",
      position: {
        colStart: 0,
        colEnd: isCollapsed ? 18 : 14,
        rowStart: 0,
        rowEnd: 10,
      },
    },
    {
      id: "stats",
      component: "QuickStats",
      position: {
        colStart: 0,
        colEnd: isCollapsed ? 5 : 5,
        rowStart: 10,
        rowEnd: 16,
      },
      props: {},
    },
    {
      id: "updates",
      component: "UpdatesCard",
      position: {
        colStart: isCollapsed ? 18 : 14,
        colEnd: isCollapsed ? 25 : 20,
        rowStart: 7,
        rowEnd: 16,
      },
    },
    {
      id: "calendar",
      component: "Calendar",
      position: {
        colStart: isCollapsed ? 18 : 14,
        colEnd: isCollapsed ? 25 : 20,
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
