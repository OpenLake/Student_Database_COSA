import React, { useMemo } from "react";

import {
  formatMonthlyLineData,
  formatPieData,
  formatBarData,
} from "./commonComponents";
import {
  DashboardCard,
  LineChart,
  BarChart,
  PieChart,
  DoughnutChart,
} from "./commonComponents";

const StudentAnalytics = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return {};

    const engagementScoreData = [
      {
        type: "Positions Held",
        score: data.analytics.engagement.breakdown.positions.score,
      },
      {
        type: "Events Organized",
        score: data.analytics.engagement.breakdown.organized.score,
      },
      {
        type: "Events Participated",
        score: data.analytics.engagement.breakdown.participated.score,
      },
    ];

    const engagementCountData = [
      {
        type: "Positions Held",
        count: data.analytics.engagement.breakdown.positions.count,
      },
      {
        type: "Events Organized",
        count: data.analytics.engagement.breakdown.organized.count,
      },
      {
        type: "Events Participated",
        count: data.analytics.engagement.breakdown.participated.count,
      },
    ];

    return {
      participationTrend: formatMonthlyLineData(
        data.analytics.participationTrend,
        "count",
        "Events Joined",
      ),
      skillCategories: formatPieData(
        data.analytics.skillCategories,
        "category",
        "count",
      ),
      eventPreferences: formatPieData(
        data.analytics.eventPreferences,
        "category",
        "count",
      ),
      achievementStatus: formatPieData(
        data.analytics.achievementStatus,
        "status",
        "count",
      ),
      engagementBreakdownScore: formatBarData(
        engagementScoreData,
        "type",
        "score",
        "Score Contribution",
      ),
      engagementBreakdownCount: formatBarData(
        engagementCountData,
        "type",
        "count",
        "Activity Count",
      ), // <-- NEW
    };
  }, [data]);

  const { analytics } = data;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
        Analytics
      </h3>

      <div className="grid grid-cols-1">
        <DashboardCard
          title="My Engagement Score (Current Tenure)"
          value={analytics.engagement.totalScore}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChart
            title="My Participation Trend (12 Months)"
            data={chartData.participationTrend}
          />
        </div>
        <BarChart
          title="Engagement Breakdown (by Score)"
          data={chartData.engagementBreakdownScore}
        />

        <BarChart
          title="Engagement Breakdown (by Count)"
          data={chartData.engagementBreakdownCount}
        />
        <DoughnutChart
          title="My Skill Categories"
          data={chartData.skillCategories}
        />
        <PieChart
          title="My Event Preferences"
          data={chartData.eventPreferences}
        />

        <div className="lg:col-span-3">
          <PieChart
            title="My Achievement Status"
            data={chartData.achievementStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
