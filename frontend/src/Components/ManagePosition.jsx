import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  Info,
  Search,
  Filter,
  Calendar,
  Clock4,
  BarChart3,
  ArrowRight,
  X,
  UserCheck,
} from "lucide-react";
import api from "../utils/api";
import { AdminContext } from "../context/AdminContext";
import AddPositionHolder from "./AddPositionHolder";

const categoryThemes = {
  academic: {
    label: "CoSA",
    accentText: "text-amber-700",
    accentDot: "bg-amber-400",
    cardBg: "bg-amber-50/80",
    cardBorder: "border-amber-200",
    requestText: "text-amber-600 hover:text-amber-700",
  },
  cultural: {
    label: "Cult",
    accentText: "text-emerald-700",
    accentDot: "bg-emerald-400",
    cardBg: "bg-emerald-50/80",
    cardBorder: "border-emerald-200",
    requestText: "text-emerald-600 hover:text-emerald-700",
  },
  scitech: {
    label: "SciTech",
    accentText: "text-rose-700",
    accentDot: "bg-rose-400",
    cardBg: "bg-rose-50/80",
    cardBorder: "border-rose-200",
    requestText: "text-rose-600 hover:text-rose-700",
  },
  sports: {
    label: "Sports",
    accentText: "text-sky-700",
    accentDot: "bg-sky-400",
    cardBg: "bg-sky-50/80",
    cardBorder: "border-sky-200",
    requestText: "text-sky-600 hover:text-sky-700",
  },
  independent: {
    label: "Independent",
    accentText: "text-slate-700",
    accentDot: "bg-slate-400",
    cardBg: "bg-slate-50/80",
    cardBorder: "border-slate-200",
    requestText: "text-slate-600 hover:text-slate-700",
  },
  other: {
    label: "Other",
    accentText: "text-gray-700",
    accentDot: "bg-gray-400",
    cardBg: "bg-gray-50/80",
    cardBorder: "border-gray-200",
    requestText: "text-gray-600 hover:text-gray-700",
  },
};

const statusStyles = {
  active: {
    badge: "bg-emerald-500/15 text-emerald-700 border border-emerald-200",
  },
  completed: {
    badge: "bg-blue-500/15 text-blue-700 border border-blue-200",
  },
  terminated: {
    badge: "bg-rose-500/15 text-rose-700 border border-rose-200",
  },
  default: {
    badge: "bg-gray-500/15 text-gray-700 border border-gray-200",
  },
};

const categoryOrder = [
  "academic",
  "cultural",
  "scitech",
  "sports",
  "independent",
  "other",
];

const ManagePositions = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tenureFilter, setTenureFilter] = useState("all");

  useEffect(() => {
    const fetchMyPositions = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/positions/${isUserLoggedIn._id}`);
        setPositions(response.data);
        setFilteredPositions(response.data);
      } catch (fetchError) {
        console.error("Error fetching positions:", fetchError);
        setError(
          "We couldn't load your positions right now. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoggedIn?._id) {
      fetchMyPositions();
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    let filtered = positions;

    if (searchTerm) {
      filtered = filtered.filter((position) => {
        const title = position.position_id?.title ?? "";
        const unitName = position.position_id?.unit_id?.name ?? "";
        const tenureYear = position.tenure_year ?? "";
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenureYear.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (position) => position.status?.toLowerCase() === statusFilter,
      );
    }

    if (tenureFilter !== "all") {
      filtered = filtered.filter(
        (position) => position.tenure_year === tenureFilter,
      );
    }

    setFilteredPositions(filtered);
  }, [positions, searchTerm, statusFilter, tenureFilter]);

  const currentPositions = useMemo(
    () => filteredPositions.filter((position) => position.status === "active"),
    [filteredPositions],
  );

  const pastPositions = useMemo(
    () => filteredPositions.filter((position) => position.status !== "active"),
    [filteredPositions],
  );

  const allCurrentCount = useMemo(
    () => positions.filter((position) => position.status === "active").length,
    [positions],
  );

  const allPastCount = useMemo(
    () => positions.filter((position) => position.status !== "active").length,
    [positions],
  );

  const visiblePositions = useMemo(
    () => (activeTab === "current" ? currentPositions : pastPositions),
    [activeTab, currentPositions, pastPositions],
  );

  const uniqueTenureYears = useMemo(
    () =>
      [...new Set(positions.map((position) => position.tenure_year))].sort(),
    [positions],
  );

  const statusSummary = useMemo(() => {
    const summary = {
      total: filteredPositions.length,
      active: 0,
      completed: 0,
      terminated: 0,
      other: 0,
    };

    filteredPositions.forEach((position) => {
      const statusKey = position.status?.toLowerCase();
      if (statusKey && summary[statusKey] !== undefined) {
        summary[statusKey] += 1;
      } else {
        summary.other += 1;
      }
    });

    return summary;
  }, [filteredPositions]);

  const getCategoryTheme = (category) => {
    if (!category) return categoryThemes.other;
    const key = category.toLowerCase();
    return categoryThemes[key] ?? categoryThemes.other;
  };

  const getStatusBadgeClass = (status) => {
    const key = status?.toLowerCase();
    return (statusStyles[key] ?? statusStyles.default).badge;
  };

  const formatDateLabel = (dateString, fallback = "—") => {
    if (!dateString) return fallback;
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return fallback;
    return parsed.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }

    const totalMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      (endDate.getDate() - startDate.getDate()) / 30;

    const roundedMonths = Math.max(1, Math.round(totalMonths));

    if (roundedMonths < 12) {
      return `${roundedMonths} month${roundedMonths === 1 ? "" : "s"}`;
    }

    const years = roundedMonths / 12;
    if (Number.isInteger(years)) {
      return `${years} year${years === 1 ? "" : "s"}`;
    }

    return `${years.toFixed(1)} years`;
  };

  const getTimelineDetails = (position) => {
    const statusKey = position.status?.toLowerCase();
    const startRaw =
      position.appointment_details?.appointment_date || position.created_at;
    const endRaw =
      statusKey === "active"
        ? new Date().toISOString()
        : position.updated_at || position.created_at;

    return {
      start: formatDateLabel(startRaw),
      end: statusKey === "active" ? "Present" : formatDateLabel(endRaw),
      duration: startRaw ? calculateDuration(startRaw, endRaw) : null,
    };
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const groupByCategory = (items) =>
    items.reduce((accumulator, position) => {
      const key =
        position.position_id?.unit_id?.category?.toLowerCase() || "other";
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(position);
      return accumulator;
    }, {});

  const renderPositionCard = (position, theme) => {
    const cardId = position._id ?? position.por_id;
    const statusLabel =
      position.status?.charAt(0).toUpperCase() + position.status?.slice(1);
    const timeline = getTimelineDetails(position);

    const eventsOrganized = position.performance_metrics?.events_organized ?? 0;
    const budgetUtilized = position.performance_metrics?.budget_utilized ?? 0;

    return (
      <div
        key={cardId}
        className={`group w-full rounded-3xl border ${theme.cardBorder} ${theme.cardBg} p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              {position.position_id?.unit_id?.name || "Organizational Unit"}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900">
              {position.position_id?.title || "Unknown Position"}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(
              position.status,
            )}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-700">
          {position.tenure_year && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/70 px-3 py-1 font-medium text-gray-600 shadow-sm">
              <Clock4 className="h-3 w-3 text-gray-400" />
              {position.tenure_year}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/70 px-3 py-1 font-medium text-gray-700 shadow-sm">
            <Calendar className="h-3 w-3 text-gray-400" />
            {timeline.start} — {timeline.end}
          </span>
          {timeline.duration && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/70 px-3 py-1 font-medium text-gray-700 shadow-sm">
              <Clock4 className="h-3 w-3 text-gray-400" />
              {timeline.duration}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-3 text-sm font-semibold text-gray-900">
            <span>{eventsOrganized} Events</span>
            <span className="text-gray-400">•</span>
            <span>{formatCurrency(budgetUtilized)}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPosition(position)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderCategorySections = (positionsToRender) => {
    const groups = groupByCategory(positionsToRender);

    return categoryOrder
      .filter((categoryKey) => groups[categoryKey]?.length)
      .map((categoryKey) => {
        const theme = getCategoryTheme(categoryKey);
        const items = groups[categoryKey];

        return (
          <div key={categoryKey} className="mb-12">
            <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${theme.accentDot}`}
                ></span>
                <h3 className={`text-lg font-semibold ${theme.accentText}`}>
                  {theme.label}
                </h3>
                <span className="text-sm text-gray-500">
                  {items.length} position{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className={`text-sm font-semibold transition-colors ${theme.requestText}`}
              >
                Request change
              </button>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {items.map((item) => renderPositionCard(item, theme))}
            </div>
          </div>
        );
      });
  };

  const emptyStateCopy =
    activeTab === "current"
      ? {
          title:
            allCurrentCount === 0
              ? "You don't have active positions yet"
              : "No active positions match your filters",
          subtitle:
            allCurrentCount === 0
              ? "Once you're onboarded into a role, it will appear here."
              : "Adjust the filters or clear them to reveal active positions.",
        }
      : {
          title:
            allPastCount === 0
              ? "No past positions recorded"
              : "No past positions match your filters",
          subtitle:
            allPastCount === 0
              ? "Completed roles will surface in this view automatically."
              : "Modify the filters to review archived positions.",
        };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f2] px-6">
        <div className="rounded-3xl border border-amber-100 bg-white/80 px-6 py-4 text-amber-600 shadow-lg">
          Loading your positions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f2] px-6">
        <div className="max-w-md rounded-3xl border border-rose-100 bg-white/80 p-6 text-center shadow-lg">
          <h2 className="text-lg font-semibold text-rose-600">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f9] py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-black p-3 text-white shadow-md">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-400">
                  Dashboard
                </p>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Your PORs
                  </h1>
                  <Info className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 max-w-xl text-sm text-gray-600">
                  A curated snapshot of every position of responsibility
                  you&apos;ve held with CoSA. Filter by status or tenure,
                  request updates, and drill into rich details without leaving
                  this page.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition ${
                  showFilters
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-gray-900"
              >
                + Add position
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-[#fdf6e6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                Total positions
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {statusSummary.total}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#eaf8f0] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Active
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {statusSummary.active}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#eaf1ff] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Completed
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {statusSummary.completed}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#fceef1] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
                Other status
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {statusSummary.terminated + statusSummary.other}
              </p>
            </div>
          </div>
        </header>

        {showFilters && (
          <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
            <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, unit or year"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 text-sm font-medium text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                  Tenure year
                </label>
                <select
                  value={tenureFilter}
                  onChange={(event) => setTenureFilter(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="all">All years</option>
                  {uniqueTenureYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full bg-white p-1 shadow-inner">
              {[
                { id: "current", label: "Current" },
                { id: "past", label: "Past" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "rounded-full bg-black text-white shadow"
                      : "rounded-full text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs text-gray-400">
                    {tab.id === "current"
                      ? currentPositions.length
                      : pastPositions.length}
                  </span>
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-500">
              Showing {visiblePositions.length} of{" "}
              {activeTab === "current" ? allCurrentCount : allPastCount}{" "}
              positions
            </span>
          </div>

          <div className="mt-8">
            {visiblePositions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white/80 p-10 text-center">
                <UserCheck className="mx-auto h-14 w-14 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {emptyStateCopy.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {emptyStateCopy.subtitle}
                </p>
              </div>
            ) : (
              renderCategorySections(visiblePositions)
            )}
          </div>
        </section>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 text-2xl text-gray-400 transition hover:text-gray-600"
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>
            <AddPositionHolder onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 py-8 sm:items-center">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              className="absolute right-5 top-5 text-gray-400 transition hover:text-gray-600"
              onClick={() => setSelectedPosition(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid gap-6 sm:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  {selectedPosition.position_id?.unit_id?.name ||
                    "Organizational Unit"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {selectedPosition.position_id?.title || "Unknown Position"}
                </h2>
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {formatDateLabel(
                      selectedPosition.appointment_details?.appointment_date ||
                        selectedPosition.created_at,
                    )}
                    <span className="text-gray-400">→</span>
                    {selectedPosition.status === "active"
                      ? "Present"
                      : formatDateLabel(
                          selectedPosition.updated_at ||
                            selectedPosition.created_at,
                        )}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                    <Clock4 className="h-4 w-4 text-gray-500" />
                    Tenure {selectedPosition.tenure_year}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Appointment details
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between gap-2">
                      <dt>Appointed by</dt>
                      <dd className="font-medium text-gray-900">
                        {selectedPosition.appointment_details?.appointed_by
                          ?.personal_info?.name ||
                          selectedPosition.appointment_details?.appointed_by
                            ?.username ||
                          "Not specified"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt>Appointment date</dt>
                      <dd className="font-medium text-gray-900">
                        {formatDateLabel(
                          selectedPosition.appointment_details
                            ?.appointment_date,
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt>Status</dt>
                      <dd className="font-medium text-gray-900 capitalize">
                        {selectedPosition.status}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-[#fef6ff] p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
                    <BarChart3 className="h-4 w-4" />
                    Performance metrics
                  </div>
                  <dl className="mt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <dt>Events organized</dt>
                      <dd className="font-semibold text-gray-900">
                        {selectedPosition.performance_metrics
                          ?.events_organized ?? 0}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Budget utilized</dt>
                      <dd className="font-semibold text-gray-900">
                        {formatCurrency(
                          selectedPosition.performance_metrics
                            ?.budget_utilized ?? 0,
                        )}
                      </dd>
                    </div>
                  </dl>
                  {selectedPosition.performance_metrics?.feedback && (
                    <div className="mt-3 rounded-xl bg-white/70 p-3 text-sm text-gray-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                        Feedback
                      </p>
                      <p className="mt-1 leading-relaxed">
                        {selectedPosition.performance_metrics.feedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-500">
                  <p>Created: {formatDateLabel(selectedPosition.created_at)}</p>
                  {selectedPosition.updated_at &&
                    selectedPosition.updated_at !==
                      selectedPosition.created_at && (
                      <p className="mt-1">
                        Updated: {formatDateLabel(selectedPosition.updated_at)}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePositions;
