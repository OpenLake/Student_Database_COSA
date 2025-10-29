import { useMemo } from "react";

import {
  formatPieData,
  formatBarData,
  formatBudgetDoughnut,
  formatMonthlyLineData,
} from "./commonComponents";
import {
  DashboardCard,
  LineChart,
  HorizontalBarChart,
  PieChart,
  DoughnutChart,
} from "./commonComponents";

const PresidentAnalytics = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return {};
    const demographics = data.summary.userAnalytics.demographics || {};
    return {
      userStatus: formatPieData(
        data.summary.userAnalytics.userStatus,
        "status",
        "count",
      ),
      userProgram: formatPieData(demographics.byProgram, "_id", "count"), // <-- NEW
      userBranch: formatPieData(demographics.byBranch, "_id", "count"),
      userBatch: formatPieData(demographics.byBatchYear, "_id", "count"), // <-- NEW
      eventCategories: formatPieData(
        data.summary.eventAnalytics.eventCategories,
        "_id",
        "count",
      ),
      unitTypes: formatPieData(
        data.summary.organizationalUnitAnalytics.unitTypes,
        "_id",
        "count",
      ),
      unitCategories: formatPieData(
        data.summary.organizationalUnitAnalytics.unitCategories,
        "_id",
        "count",
      ), // <-- NEW
      budget: formatBudgetDoughnut(
        data.summary.organizationalUnitAnalytics.budgetOverview,
      ),
      achievements: formatPieData(
        data.summary.porAnalytics.achievementStatus.map((s) => ({
          ...s,
          status: s.verified ? "Verified" : "Pending",
        })),
        "status",
        "count",
      ),
      participationTrend: formatMonthlyLineData(
        data.involvement.participationTrends,
        "uniqueParticipants",
        "Unique Participants",
      ),
      porDistribution: formatBarData(
        data.involvement.porDistribution.slice(0, 5),
        "_id",
        "count",
        "Active PoRs",
      ),
      topClubs: formatBarData(
        data.involvement.topClubs,
        "name",
        "totalParticipants",
        "Total Participants",
      ),
    };
  }, [data]);

  const { summary } = data;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
        Analytics
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Users"
          value={summary.userAnalytics.totalUsers}
        />
        <DashboardCard
          title="Active PoRs (Tenure)"
          value={summary.porAnalytics.activePORs}
        />
        <DashboardCard
          title="Total Achievements"
          value={summary.porAnalytics.totalAchievements}
        />
        <DashboardCard
          title="Total Units"
          value={summary.organizationalUnitAnalytics.totalUnits}
        />
        <DashboardCard
          title="Done Events (Tenure)"
          value={summary.eventAnalytics.totalCompleted}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChart
            title="Participation Trend (12 Months)"
            data={chartData.participationTrend}
          />
        </div>
        <DoughnutChart title="Overall Budget" data={chartData.budget} />

        <HorizontalBarChart
          title="Top 5 Clubs by Participation"
          data={chartData.topClubs}
        />
        <HorizontalBarChart
          title="Top 5 Units by PoR Count"
          data={chartData.porDistribution}
        />
        <PieChart title="Achievement Status" data={chartData.achievements} />

        <PieChart title="User Status" data={chartData.userStatus} />
        <PieChart title="Unit Types" data={chartData.unitTypes} />
        <PieChart title="Unit Categories" data={chartData.unitCategories} />

        <PieChart
          title="Demographics by Program"
          data={chartData.userProgram}
        />
        <PieChart title="Demographics by Branch" data={chartData.userBranch} />
        <PieChart title="Demographics by Batch" data={chartData.userBatch} />

        <PieChart
          title="Event Categories (Tenure)"
          data={chartData.eventCategories}
        />
      </div>
    </div>
  );
};

export default PresidentAnalytics;
