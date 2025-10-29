import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import LeftColumn from "./QuickStats";
import UpdatesCard from "../common/LatestUpdatesCard";
import Layout from "../common/Layout";
import PresidentAnalytics from "../Analytics/presidentAnalytics";
import StudentAnalytics from "../Analytics/studentAnalytics";
import GensecAnalytics from "../Analytics/gensecAnalytics";
import ClubCoordinatorAnalytics from "../Analytics/coordinatorAnalytics";
import { AdminContext } from "../../context/AdminContext";
import { useAnalyticsData } from "../../hooks/useAnalyticsData";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export const Home = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const role = isUserLoggedIn?.role;

  const { data, loading, error } = useAnalyticsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-lg">
        Loading analytics data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-lg">
        No analytics data available for your role.
      </div>
    );
  }
  const renderAnalyticsComponent = () => {
    if (!role)
      return (
        <div className="flex items-center justify-center h-full text-gray-600 text-lg">
          Loading user data...
        </div>
      );
    if (role == "PRESIDENT") return <PresidentAnalytics data={data} />;
    if (role.startsWith("GENSEC_")) return <GensecAnalytics data={data} />;
    if (role == "CLUB_COORDINATOR")
      return <ClubCoordinatorAnalytics data={data} />;
    if (role == "STUDENT") return <StudentAnalytics data={data} />;
    return (
      <div className="flex items-center justify-center h-full text-red-600 text-lg">
        Unknown role: {role}
      </div>
    );
  };
  return renderAnalyticsComponent();
};

export default Home;

// Inner component that uses the sidebar context
export const DashboardContent = () => {
  const [updates, setUpdates] = useState([]);
  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const response = await api.get("/api/events/latest");
        setUpdates(response.data);
      } catch (error) {
        console.error("Failed to fetch updates:", error);
      }
    };

    fetchLatestUpdates();
  }, []);
  const components = {
    Home: Home,
    LeftColumn: LeftColumn,
    UpdatesCard: UpdatesCard,
  };

  const gridConfig = [
    {
      id: "component-1",
      component: "Home",
      position: {
        colStart: 0,
        colEnd: 14,
        rowStart: 0,
        rowEnd: 11,
      },
    },
    {
      id: "component-2",
      component: "LeftColumn",
      position: {
        colStart: 0,
        colEnd: 6,
        rowStart: 11,
        rowEnd: 16,
      },
      props: {},
    },
    {
      id: "component-3",
      component: "UpdatesCard",
      position: {
        colStart: 14,
        colEnd: 20,
        rowStart: 7,
        rowEnd: 16,
      },
      props: { updates: updates },
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
