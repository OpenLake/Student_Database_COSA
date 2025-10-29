import React, { useState, useEffect, useMemo } from "react";
import { formatBudgetDoughnut, formatBarData } from "./commonComponents";
import {
  DashboardCard,
  DataTable,
  BarChart,
  DoughnutChart,
} from "./commonComponents";

const ClubCoordinatorAnalytics = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return {};
    return {
      budget: formatBudgetDoughnut(data.atAGlance.budget),
      eventPerformance: formatBarData(
        data.eventPerformance.participantsPerEvent.slice(0, 5).reverse(), // Show last 5
        "title",
        "participants",
        "Participants",
      ),
    };
  }, [data]);

  const tableData = useMemo(() => {
    if (!data) return { upcomingEventsData: [], teamData: [] };
    return {
      upcomingEventsData: data.eventPerformance.upcomingEvents.map((e) => ({
        title: e.title,
        date: new Date(e.schedule.start).toLocaleDateString(),
        status: e.status,
      })),
      teamData: data.teamManagement.currentPositionHolders,
    };
  }, [data]);

  const { atAGlance, teamManagement } = data;
  const upcomingEventsCols = [
    { header: "Event Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
  ];
  const teamCols = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Position", accessor: "position" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
        {" "}
        Analytics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <DashboardCard
          title="Events (Current Tenure)"
          value={atAGlance.coreStats.currentTenure.totalEvents}
        />
        <DashboardCard
          title="Members (Current Tenure)"
          value={atAGlance.coreStats.currentTenure.totalActiveMembers}
        />
        <DashboardCard
          title="Events (All Time)"
          value={atAGlance.coreStats.allTime.totalEvents}
        />
        <DashboardCard
          title="Members (All Time)"
          value={atAGlance.coreStats.allTime.totalActiveMembers}
        />
        <DashboardCard
          title="Open Positions"
          value={teamManagement.openPositions}
        />
        <DashboardCard
          title="Budget Remaining"
          value={`₹${atAGlance.budget.remaining.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChart
            title="Event Performance (Last 5 Events)"
            data={chartData.eventPerformance}
          />
        </div>
        <DoughnutChart title="Budget Overview" data={chartData.budget} />

        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Upcoming Events
          </h3>
          <DataTable
            columns={upcomingEventsCols}
            data={tableData.upcomingEventsData}
          />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Current Team
          </h3>
          <DataTable columns={teamCols} data={tableData.teamData} />
        </div>
      </div>
    </div>
  );
};

export default ClubCoordinatorAnalytics;
