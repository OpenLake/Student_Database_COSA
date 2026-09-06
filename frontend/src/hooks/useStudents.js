import { useState, useEffect, useCallback, useRef } from "react";
import { fetchStudents, fetchStudentFilterOptions } from "../services/students";

const DEFAULT_LIMIT = 20;

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [batchYear, setBatchYear] = useState("All");
  const [status, setStatus] = useState("All");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    totalPages: 1,
  });

  // Filter dropdown options, sourced from ALL students in the DB
  // (not just the current page) via a dedicated endpoint.
  const [branchOptions, setBranchOptions] = useState(["All"]);
  const [batchYearOptions, setBatchYearOptions] = useState(["All"]);
  const [statusOptions, setStatusOptions] = useState([
    "All",
    "active",
    "inactive",
    "graduated",
  ]);

  // Tracks the most recent request so a slower, older request can't
  // overwrite results from a newer one that resolved first.
  const latestRequestId = useRef(0);

  useEffect(() => {
    const loadFilterOptions = async () => {
      const { data, status: httpStatus } = await fetchStudentFilterOptions();
      if (httpStatus === 200 && data?.success) {
        setBranchOptions(["All", ...(data.filters.branches || [])]);
        setBatchYearOptions(["All", ...(data.filters.batchYears || [])]);
        setStatusOptions(["All", ...(data.filters.statuses || [])]);
      }
    };
    loadFilterOptions();
  }, []);

  const loadStudents = useCallback(async () => {
    const requestId = latestRequestId.current;
    setLoading(true);
    setError("");

    const params = { page, limit: DEFAULT_LIMIT };
    if (search.trim()) params.search = search.trim();
    if (branch !== "All") params.branch = branch;
    if (batchYear !== "All") params.batch_year = batchYear;
    if (status !== "All") params.status = status;

    const { data, status: httpStatus } = await fetchStudents(params);

    // A newer request has since started — discard this stale response.
    if (requestId !== latestRequestId.current) return;

    if (httpStatus === 200 && data?.success) {
      setStudents(data.students || []);
      setPagination(
        data.pagination || {
          total: data.students?.length || 0,
          page: 1,
          limit: DEFAULT_LIMIT,
          totalPages: 1,
        },
      );
    } else {
      setStudents([]);
      setError(data?.message || "Failed to load students.");
    }

    setLoading(false);
  }, [search, branch, batchYear, status, page]);

  useEffect(() => {
    latestRequestId.current += 1;
  }, [search, branch, batchYear, status, page]);
  
  // Debounce search/filter changes, then fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents();
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, branch, batchYear, status, page]);

  // Reset to page 1 whenever a filter/search changes
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, branch, batchYear, status]);

  return {
    students,
    loading,
    error,
    search,
    setSearch,
    branch,
    setBranch,
    batchYear,
    setBatchYear,
    status,
    setStatus,
    branchOptions,
    batchYearOptions,
    statusOptions,
    page,
    setPage,
    pagination,
    refresh: loadStudents,
  };
};