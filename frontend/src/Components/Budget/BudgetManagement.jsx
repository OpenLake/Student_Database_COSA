import React, { useMemo, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useBudgetManagement } from "../../hooks/useBudgetManagement";

const REVIEW_ROLES = new Set([
  "PRESIDENT",
  "GENSEC_SCITECH",
  "GENSEC_ACADEMIC",
  "GENSEC_CULTURAL",
  "GENSEC_SPORTS",
]);

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `INR ${amount.toLocaleString()}`;
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

const BudgetManagement = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const role = (isUserLoggedIn && isUserLoggedIn.role) || "";

  const {
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
  } = useBudgetManagement();

  const [form, setForm] = useState({
    amount: "",
    eventId: "",
    description: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const canAllocate = REVIEW_ROLES.has(role);

  const remaining = useMemo(() => {
    const allocated = Number(budget && budget.allocated ? budget.allocated : 0);
    const spent = Number(budget && budget.spent ? budget.spent : 0);
    return Math.max(0, allocated - spent);
  }, [budget]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const runAction = async (endpoint) => {
    setStatusMessage("");

    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setStatusMessage("Amount must be a positive number");
      return;
    }

    const result = await submitTransaction({
      endpoint,
      amount,
      eventId: form.eventId.trim(),
      description: form.description.trim(),
    });

    setStatusMessage(result.message);
    if (result.ok) {
      setForm({ amount: "", eventId: "", description: "" });
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil((pagination.total || 0) / (pagination.limit || 20)),
  );

  return (
    <div className="h-full p-4 md:p-6 overflow-y-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Budget Management
          </h2>
          <p className="text-sm text-gray-600">
            Track allocation, spending, refunds, and transaction history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            value={selectedUnitId}
            onChange={(event) => setSelectedUnitId(event.target.value)}
            disabled={isLoadingUnits || units.length === 0}
          >
            {units.length === 0 ? (
              <option value="">No units available</option>
            ) : (
              units.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))
            )}
          </select>

          <button
            type="button"
            onClick={refreshCurrentPage}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100"
            disabled={isLoadingData}
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Allocated
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(budget && budget.allocated)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Spent</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(budget && budget.spent)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Remaining
          </p>
          <p className="text-2xl font-semibold text-emerald-700">
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Add Transaction
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            name="eventId"
            type="text"
            placeholder="Event ID (optional)"
            value={form.eventId}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            name="description"
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {canAllocate ? (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
              onClick={() => runAction("/api/budget/allocate")}
              disabled={isSubmitting || !selectedUnit}
            >
              Allocate
            </button>
          ) : null}

          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-60"
            onClick={() => runAction("/api/budget/spend")}
            disabled={isSubmitting || !selectedUnit}
          >
            Record Expense
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
            onClick={() => runAction("/api/budget/refund")}
            disabled={isSubmitting || !selectedUnit}
          >
            Record Refund
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Transaction History {selectedUnit ? `- ${selectedUnit.name}` : ""}
        </h3>

        {isLoadingData ? (
          <p className="text-sm text-gray-600">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-600">
            No transactions found for this unit.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2 pr-3">Event</th>
                  <th className="py-2 pr-3">Balance After</th>
                  <th className="py-2 pr-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item._id} className="border-b last:border-b-0">
                    <td className="py-2 pr-3">
                      {formatDateTime(item.created_at)}
                    </td>
                    <td className="py-2 pr-3">{item.type}</td>
                    <td className="py-2 pr-3">{formatCurrency(item.amount)}</td>
                    <td className="py-2 pr-3">
                      {item.event_id && item.event_id.title
                        ? item.event_id.title
                        : "-"}
                    </td>
                    <td className="py-2 pr-3">
                      {formatCurrency(item.balance_after)}
                    </td>
                    <td className="py-2 pr-3">{item.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50"
            disabled={pagination.page <= 1 || isLoadingData}
            onClick={() => changePage((pagination.page || 1) - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {pagination.page || 1} of {totalPages}
          </span>
          <button
            type="button"
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50"
            disabled={(pagination.page || 1) >= totalPages || isLoadingData}
            onClick={() => changePage((pagination.page || 1) + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetManagement;
