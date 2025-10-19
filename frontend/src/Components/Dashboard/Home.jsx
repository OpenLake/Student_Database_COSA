import React, { useEffect, useState } from "react";
import { PieChart, AreaChart, Users } from "lucide-react";
import api from "../../utils/api";
import LeftColumn from "./LeftColumn";
import UpdatesCard from "./Cards/Common/LatestUpdatesCard";
import Layout from "../common/Layout";

const Home = () => {
  return (
    // <div className="p-6 bg-gray-50 min-h-screen">
    // <header className="mb-8">
    //   <h1 className="text-3xl font-bold text-slate-800">Dashboard Home</h1>
    //   <p className="text-slate-500 mt-1">
    //     Welcome! A high-level overview of all activity will be displayed here soon.
    //   </p>
    // </header>

    <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-12 bg-white">
      <div className="flex justify-center items-center gap-4 text-gray-400 mb-4">
        <PieChart size={48} strokeWidth={1.5} />
        <AreaChart size={48} strokeWidth={1.5} />
        <Users size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold text-slate-700">
        Analytics Coming Soon
      </h2>
      <p className="text-slate-500 mt-2">
        Detailed analytics of the dashboard will be shown here.
      </p>
    </div>
    // </div>
  );
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
