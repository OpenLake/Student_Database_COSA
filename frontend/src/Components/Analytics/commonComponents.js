import React, { memo } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

// --- 1. CHART UTILITY FUNCTIONS ---

//Predefined Tailwind colors for charts.

const CHART_COLORS = {
  backgrounds: [
    "rgba(59, 130, 246, 0.6)", // blue-500
    "rgba(239, 68, 68, 0.6)", // red-500
    "rgba(245, 158, 11, 0.6)", // amber-500
    "rgba(16, 185, 129, 0.6)", // green-500
    "rgba(139, 92, 246, 0.6)", // violet-500
    "rgba(249, 115, 22, 0.6)", // orange-500
    "rgba(236, 72, 153, 0.6)", // pink-500
    "rgba(20, 184, 166, 0.6)", // teal-500
  ],
  borders: [
    "#3B82F6", // blue-500
    "#EF4444", // red-500
    "#F59E0B", // amber-500
    "#10B981", // green-500
    "#8B5CF6", // violet-500
    "#F97316", // orange-500
    "#EC4899", // pink-500
    "#14B8A6", // teal-500
  ],
};

/**
 * Formats data for Pie or Doughnut charts
 */
export const formatPieData = (apiData = [], labelKey, dataKey) => {
  const validData = apiData.filter((item) => item[labelKey] != null); // Filter out null/undefined labels
  const labels = validData.map((item) => item[labelKey]);
  const data = validData.map((item) => item[dataKey]);

  return {
    labels,
    datasets: [
      {
        label: "Count",
        data,
        backgroundColor: CHART_COLORS.backgrounds.slice(0, data.length),
        borderColor: CHART_COLORS.borders.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Formats data for Bar charts
 */
export const formatBarData = (apiData = [], labelKey, dataKey, chartLabel) => {
  const validData = apiData.filter((item) => item[labelKey] != null);
  const labels = validData.map((item) => item[labelKey]);
  const data = validData.map((item) => item[dataKey]);

  return {
    labels,
    datasets: [
      {
        label: chartLabel,
        data,
        backgroundColor:
          CHART_COLORS.backgrounds[0] || "rgba(54, 162, 235, 0.6)",
        borderColor: CHART_COLORS.borders[0] || "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Formats budget data for a Doughnut chart
 */
export const formatBudgetDoughnut = (budgetData = {}) => {
  const {
    totalAllocated = 0,
    totalSpent = 0,
    allocated = 0,
    spent = 0,
  } = budgetData;

  const finalAllocated = totalAllocated || allocated;
  const finalSpent = totalSpent || spent;
  const remaining = finalAllocated - finalSpent;

  return {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [finalSpent, remaining < 0 ? 0 : remaining],
        backgroundColor: [
          CHART_COLORS.backgrounds[1],
          CHART_COLORS.backgrounds[3],
        ],
        borderColor: [CHART_COLORS.borders[1], CHART_COLORS.borders[3]],
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Formats monthly trend data for Line charts
 */
export const formatMonthlyLineData = (apiData = [], dataKey, chartLabel) => {
  const labels = apiData.map((item) => {
    const year = item._id ? item._id.year : item.year;
    const month = item._id ? item._id.month : item.month;
    // Format to "MMM YYYY"
    return new Date(year, month - 1).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
  });

  const data = apiData.map((item) => item[dataKey]);

  return {
    labels,
    datasets: [
      {
        label: chartLabel,
        data,
        fill: false,
        borderColor: CHART_COLORS.borders[0],
        tension: 0.1,
        backgroundColor: CHART_COLORS.backgrounds[0],
      },
    ],
  };
};

// --- 2. COMMON UI COMPONENTS (with Tailwind CSS) ---

/**
 * A simple loading spinner
 */
export const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-4 text-xl text-gray-700 dark:text-gray-300 font-semibold">
      Loading Analytics...
    </span>
  </div>
));

/**
 * A reusable card for displaying KPIs (Key Performance Indicators)
 */
export const DashboardCard = memo(({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 transition-all duration-300 hover:shadow-xl dark:border dark:border-gray-700">
    <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
      {title}
    </h5>
    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
));

/**
 * A reusable container for charts
 */
export const ChartContainer = memo(({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl dark:border dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
      {title}
    </h3>
    {/* Set a fixed height for chart containers to prevent layout shifts */}
    <div className="h-72 md:h-80 relative">{children}</div>
  </div>
));

/**
 * A simple data table component
 */
export const DataTable = memo(({ columns, data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
        No data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// Common options for all charts
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // This is key for fitting charts in containers
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#6b7280", // gray-500
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#6b7280" }, // gray-500
      grid: { color: "rgba(156, 163, 175, 0.1)" }, // gray-400
    },
    y: {
      ticks: { color: "#6b7280" }, // gray-500
      grid: { color: "rgba(156, 163, 175, 0.1)" }, // gray-400
    },
  },
};

// Options for horizontal bar charts
const horizontalChartOptions = {
  ...chartOptions,
  indexAxis: "y", // This makes the bar chart horizontal
};

// Wrapper components for each chart type
export const LineChart = ({ data, title }) => (
  <ChartContainer title={title}>
    <Line data={data} options={chartOptions} />
  </ChartContainer>
);

export const BarChart = ({ data, title }) => (
  <ChartContainer title={title}>
    <Bar data={data} options={chartOptions} />
  </ChartContainer>
);

export const HorizontalBarChart = ({ data, title }) => (
  <ChartContainer title={title}>
    <Bar data={data} options={horizontalChartOptions} />
  </ChartContainer>
);

export const PieChart = ({ data, title }) => (
  <ChartContainer title={title}>
    <Pie data={data} options={{ ...chartOptions, scales: {} }} />
  </ChartContainer>
);

export const DoughnutChart = ({ data, title }) => (
  <ChartContainer title={title}>
    <Doughnut data={data} options={{ ...chartOptions, scales: {} }} />
  </ChartContainer>
);
