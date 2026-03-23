import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../utils/api";

const DEFAULT_PAGE_SIZE = 20;

export const useBudgetManagement = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });

  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchUnits = useCallback(async () => {
    setIsLoadingUnits(true);
    setError("");

    try {
      const response = await api.get("/api/events/units");
      const fetchedUnits = Array.isArray(response.data) ? response.data : [];
      setUnits(fetchedUnits);

      setSelectedUnitId((prev) => {
        if (prev && fetchedUnits.some((unit) => unit && unit._id === prev)) {
          return prev;
        }
        return fetchedUnits[0] ? fetchedUnits[0]._id : "";
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load units");
      setUnits([]);
      setSelectedUnitId("");
    } finally {
      setIsLoadingUnits(false);
    }
  }, []);

  const fetchBudgetData = useCallback(async (unitId, page = 1) => {
    if (!unitId) {
      setBudget(null);
      setTransactions([]);
      setPagination({ total: 0, page: 1, limit: DEFAULT_PAGE_SIZE });
      return;
    }

    setIsLoadingData(true);
    setError("");

    try {
      const [overviewResponse, transactionResponse] = await Promise.all([
        api.get("/api/budget/overview", { params: { unitId } }),
        api.get("/api/budget/transactions", {
          params: { unitId, page, limit: DEFAULT_PAGE_SIZE },
        }),
      ]);

      setBudget(overviewResponse.data?.budget || null);
      setTransactions(transactionResponse.data?.transactions || []);
      setPagination(
        transactionResponse.data?.pagination || {
          total: 0,
          page,
          limit: DEFAULT_PAGE_SIZE,
        },
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load budget data");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  useEffect(() => {
    fetchBudgetData(selectedUnitId, 1);
  }, [selectedUnitId, fetchBudgetData]);

  const refreshCurrentPage = useCallback(async () => {
    await fetchBudgetData(selectedUnitId, pagination.page || 1);
  }, [fetchBudgetData, selectedUnitId, pagination.page]);

  const submitTransaction = useCallback(
    async ({ endpoint, amount, eventId, description }) => {
      if (!selectedUnitId) {
        return { ok: false, message: "Select an organizational unit first" };
      }

      setIsSubmitting(true);
      setError("");

      try {
        await api.post(endpoint, {
          unitId: selectedUnitId,
          amount,
          eventId: eventId || undefined,
          description: description || "",
        });

        await fetchBudgetData(selectedUnitId, 1);
        return { ok: true, message: "Budget transaction recorded" };
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to submit budget transaction";
        setError(message);
        return { ok: false, message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchBudgetData, selectedUnitId],
  );

  const changePage = useCallback(
    async (nextPage) => {
      const normalized = Math.max(1, Number(nextPage || 1));
      await fetchBudgetData(selectedUnitId, normalized);
    },
    [fetchBudgetData, selectedUnitId],
  );

  const selectedUnit = useMemo(() => {
    return units.find((unit) => unit && unit._id === selectedUnitId) || null;
  }, [units, selectedUnitId]);

  return {
    units,
    selectedUnit,
    selectedUnitId,
    setSelectedUnitId,
    budget,
    transactions,
    pagination,
    isLoadingUnits,
    isLoadingData,
    isSubmitting,
    error,
    submitTransaction,
    changePage,
    refreshCurrentPage,
    reloadUnits: fetchUnits,
  };
};
