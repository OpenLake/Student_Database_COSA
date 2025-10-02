import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  Search,
  Filter,
  Calendar,
  BarChart3,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Clock4,
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
  const [expandedCardId, setExpandedCardId] = useState(null);

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

  const handleToggleCard = (cardId) => {
    setExpandedCardId((prev) => (prev === cardId ? null : cardId));
  };

  const renderPositionCard = (position, theme) => {
    const cardId = position._id ?? position.por_id;
    const statusLabel =
      position.status?.charAt(0).toUpperCase() + position.status?.slice(1);
    const timeline = getTimelineDetails(position);
    const isExpanded = expandedCardId === cardId;

    const appointedBy =
      position.appointment_details?.appointed_by?.personal_info?.name ||
      position.appointment_details?.appointed_by?.username ||
      "Not specified";

    const appointmentDate = position.appointment_details?.appointment_date;

    const eventsOrganized = position.performance_metrics?.events_organized ?? 0;
    const budgetUtilized = position.performance_metrics?.budget_utilized ?? 0;
    const feedback = position.performance_metrics?.feedback;

    return (
      <div
        key={cardId}
        className={`group rounded-3xl border ${theme.cardBorder} ${theme.cardBg} p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {position.position_id?.unit_id?.name || "Organizational Unit"}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-gray-900">
              {position.position_id?.title || "Unknown Position"}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
              position.status,
            )}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-700">
          {position.tenure_year && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 shadow-sm">
              <Clock4 className="h-3.5 w-3.5 text-gray-400" />
              {position.tenure_year}
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {timeline.start} — {timeline.end}
          </span>
          {timeline.duration && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
              <Clock4 className="h-3.5 w-3.5 text-gray-400" />
              {timeline.duration}
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              Events organized
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {eventsOrganized}
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              Budget utilized
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {formatCurrency(budgetUtilized)}
            </p>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Feedback
            </p>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              {feedback}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => handleToggleCard(cardId)}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
        >
          {isExpanded
            ? "Hide appointment & timeline"
            : "View appointment & timeline"}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-inner">
            <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Appointed by
                </p>
                <p className="mt-1 font-medium text-gray-900">{appointedBy}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Appointment date
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {formatDateLabel(appointmentDate)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 border-t border-white/70 pt-3 text-xs text-gray-500">
              <span>Created: {formatDateLabel(position.created_at)}</span>
              {position.updated_at &&
                position.updated_at !== position.created_at && (
                  <span>Updated: {formatDateLabel(position.updated_at)}</span>
                )}
            </div>
          </div>
        )}
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
          <div key={categoryKey} className="mb-10">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
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
            <div className="grid gap-6 lg:grid-cols-2">
              {items.map((item) => renderPositionCard(item, theme))}
            </div>
          </div>
        );
      });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-6">
        <div className="rounded-3xl border border-indigo-100 bg-white/70 px-6 py-4 text-indigo-600 shadow-lg">
          Loading your positions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-slate-100 px-6">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-white bg-white/80 p-8 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-black/90 p-3 text-white shadow-lg">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Dashboard
                </p>
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Your PORs
                </h1>
                <p className="mt-2 text-sm text-gray-600 md:text-base">
                  Track and manage your current and past positions of
                  responsibility.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-gray-900"
              >
                + Add a position
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total Positions
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {statusSummary.total}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Active
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {statusSummary.active}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Completed
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {statusSummary.completed}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Other status
              </p>
              <p className="mt-2 text-2xl font-bold text-rose-600">
                {statusSummary.terminated + statusSummary.other}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-10 rounded-3xl border border-white bg-white/80 p-6 shadow-xl backdrop-blur">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by position, unit or year"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 text-sm font-medium text-gray-700 shadow-inner focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <Filter className="h-4 w-4 text-gray-400" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-inner focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tenure year
              </label>
              <select
                value={tenureFilter}
                onChange={(event) => setTenureFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-inner focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
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

        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Current positions
              </h2>
              <p className="text-sm text-gray-600">
                Roles you&apos;re actively serving in right now.
              </p>
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {currentPositions.length} active
            </span>
          </div>

          {currentPositions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center shadow-inner">
              <UserCheck className="mx-auto h-14 w-14 text-emerald-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {allCurrentCount === 0
                  ? "No active positions yet"
                  : "No active positions match your filters"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {allCurrentCount === 0
                  ? "When you&apos;re appointed to a role, it will appear here."
                  : "Try adjusting the filters to see your active roles."}
              </p>
            </div>
          ) : (
            renderCategorySections(currentPositions)
          )}
        </section>

        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Past positions
              </h2>
              <p className="text-sm text-gray-600">
                Completed or inactive roles you&apos;ve held before.
              </p>
            </div>
            <span className="text-sm font-semibold text-gray-500">
              {pastPositions.length} archived
            </span>
          </div>

          {pastPositions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white/60 p-10 text-center shadow-inner">
              <UserCheck className="mx-auto h-14 w-14 text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {allPastCount === 0
                  ? "No past positions recorded"
                  : "No past positions match your filters"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {allPastCount === 0
                  ? "Once you complete a role, it will be archived here."
                  : "Clear your filters to revisit your earlier roles."}
              </p>
            </div>
          ) : (
            renderCategorySections(pastPositions)
          )}
        </section>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
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
    </div>
  );
};

export default ManagePositions;
