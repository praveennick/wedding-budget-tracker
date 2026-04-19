// src/pages/Reports.jsx
import React, { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import { getGroupedExpensesArray } from "../utils/groupExpenses";
import { getTotalSpent } from "../utils/calculateTotals";
import FilterBar from "../components/FilterBar";

const sortExpenses = (expenses, sortType) => {
  const cloned = [...expenses];

  switch (sortType) {
    case "date-asc":
      return cloned.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    case "date-desc":
      return cloned.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    case "amount-asc":
      return cloned.sort(
        (a, b) => Number(a.amount || 0) - Number(b.amount || 0),
      );
    case "amount-desc":
      return cloned.sort(
        (a, b) => Number(b.amount || 0) - Number(a.amount || 0),
      );
    case "name-desc":
      return cloned.sort((a, b) =>
        (b.itemName || "").localeCompare(a.itemName || ""),
      );
    case "name-asc":
    default:
      return cloned.sort((a, b) =>
        (a.itemName || "").localeCompare(b.itemName || ""),
      );
  }
};

const Reports = ({
  expenses = [],
  budget = { totalBudget: 0, currency: "INR" },
  categories = [],
}) => {
  const currency = budget?.currency || "INR";

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("amount-desc");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");

  const filteredExpenses = useMemo(() => {
    const lowerSearch = searchText.trim().toLowerCase();

    let result = [...expenses];

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (selectedPaymentStatus !== "All") {
      result = result.filter(
        (item) => item.paymentStatus === selectedPaymentStatus,
      );
    }

    if (lowerSearch) {
      result = result.filter((item) => {
        return (
          item.itemName?.toLowerCase().includes(lowerSearch) ||
          item.category?.toLowerCase().includes(lowerSearch) ||
          item.vendor?.toLowerCase().includes(lowerSearch) ||
          item.notes?.toLowerCase().includes(lowerSearch) ||
          item.paymentMethod?.toLowerCase().includes(lowerSearch)
        );
      });
    }

    return sortExpenses(result, selectedSort);
  }, [expenses, searchText, selectedCategory, selectedSort]);

  const totalSpent = useMemo(
    () => getTotalSpent(filteredExpenses),
    [filteredExpenses],
  );
  const groupedExpenses = useMemo(
    () => getGroupedExpensesArray(filteredExpenses),
    [filteredExpenses],
  );

  const reportRows = useMemo(() => {
    return groupedExpenses.map((group) => {
      const percentage =
        totalSpent > 0 ? ((group.total / totalSpent) * 100).toFixed(1) : "0.0";

      return {
        ...group,
        percentage,
      };
    });
  }, [groupedExpenses, totalSpent]);

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Category-wise summary of your wedding expenses.
        </p>
      </div>

      <FilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        selectedPaymentStatus={selectedPaymentStatus}
        onPaymentStatusChange={setSelectedPaymentStatus}
        categories={categories}
      />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Overall Summary
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Filtered Total Spent
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(totalSpent, currency)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Filtered Categories
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {groupedExpenses.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Filtered Entries
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {filteredExpenses.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Category Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            {reportRows.length}{" "}
            {reportRows.length === 1 ? "category" : "categories"}
          </p>
        </div>

        {reportRows.length > 0 ? (
          <div className="space-y-3">
            {reportRows.map((row) => (
              <div
                key={row.category}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {row.category}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        {row.count} {row.count === 1 ? "entry" : "entries"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        {row.percentage}% of filtered total
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-emerald-600">
                      {formatCurrency(row.total, currency)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{
                        width: `${Math.min(Number(row.percentage), 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {row.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {item.itemName || "Untitled Item"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.date || "-"}
                        </p>
                      </div>

                      <div className="shrink-0 text-sm font-semibold text-slate-700">
                        {formatCurrency(item.amount, currency)}
                      </div>
                    </div>
                  ))}

                  {row.items.length > 3 ? (
                    <p className="text-xs text-slate-500">
                      + {row.items.length - 3} more{" "}
                      {row.items.length - 3 === 1 ? "entry" : "entries"}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-700">
              No report data available
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing filters or add more expenses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
