import { useMemo } from "react";
import {
  formatBudgetDoughnut,
  formatBarData,
  formatMonthlyLineData,
  formatPieData,
} from "./commonComponents";
import {
  DashboardCard,
  LineChart,
  HorizontalBarChart,
  DoughnutChart,
  PieChart,
} from "./commonComponents";

const GensecAnalytics = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return {};
    return {
      budget: formatBudgetDoughnut(data.budgetManagement.overall),
      topClubsParticipation: formatBarData(
        data.engagement.topClubsByParticipation,
        "name",
        "totalParticipants",
        "Total Participants",
      ),
      topClubsActivity: formatBarData(
        data.engagement.topClubsByActivity,
        "name",
        "eventCount",
        "Events Organized",
      ),
      topEvents: formatBarData(
        data.engagement.topEventsByParticipation,
        "title",
        "participantCount",
        "Participants",
      ), // <-- NEW
      participationTrend: formatMonthlyLineData(
        data.trends.participationOverTime,
        "uniqueParticipants",
        "Unique Participants",
      ),
      eventPipeline: formatPieData(data.trends.eventPipeline, "_id", "count"),
      clubBudgets: formatBarData(
        data.budgetManagement.clubWise.map((c) => ({
          name: c.name,
          spent: c.budget.spent_amount,
        })),
        "name",
        "spent",
        "Budget Spent",
      ),
    };
  }, [data]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
        Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Clubs in Domain"
          value={data.atAGlance.totalClubs}
        />
        <DashboardCard
          title="Completed Events (Tenure)"
          value={data.atAGlance.totalEventsCompleted}
        />
        <DashboardCard
          title="Total Participation (Tenure)"
          value={data.atAGlance.totalParticipation.toLocaleString()}
        />
        <DashboardCard
          title="Domain Budget Spent"
          value={`₹${data.budgetManagement.overall.totalSpent.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChart
            title="Domain Participation Trend"
            data={chartData.participationTrend}
          />
        </div>
        <DoughnutChart title="Domain Budget Overview" data={chartData.budget} />

        <HorizontalBarChart
          title="Top 5 Clubs by Participation"
          data={chartData.topClubsParticipation}
        />
        <HorizontalBarChart
          title="Top 5 Clubs by Activity"
          data={chartData.topClubsActivity}
        />
        <HorizontalBarChart
          title="Top Events by Participation"
          data={chartData.topEvents}
        />

        <div className="lg:col-span-2">
          <HorizontalBarChart
            title="Club-wise Budget Spending"
            data={chartData.clubBudgets}
          />
        </div>
        <PieChart
          title="Event Pipeline (Current Tenure)"
          data={chartData.eventPipeline}
        />
      </div>
    </div>
  );
};

export default GensecAnalytics;
