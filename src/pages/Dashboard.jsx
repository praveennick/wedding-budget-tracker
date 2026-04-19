// src/pages/Dashboard.jsx
import React, { useMemo, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import CategoryAccordion from "../components/CategoryAccordion";
import ExpenseItem from "../components/ExpenseItem";
import FilterBar from "../components/FilterBar";
import { formatCurrency } from "../utils/formatCurrency";
import { getGroupedExpensesArray } from "../utils/groupExpenses";
import {
  getExpenseCount,
  getRemainingBudget,
  getTotalSpent,
} from "../utils/calculateTotals";

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

const Dashboard = ({
  expenses = [],
  budget = { totalBudget: 0, currency: "INR" },
  onEditExpense,
  onDeleteExpense,
  onAddExpense,
  categories = [],
}) => {
  const currency = budget?.currency || "INR";
  const totalBudget = Number(budget?.totalBudget || 0);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("date-desc");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");

  const totalSpent = useMemo(() => getTotalSpent(expenses), [expenses]);
  const remainingBudget = useMemo(
    () => getRemainingBudget(totalBudget, totalSpent),
    [totalBudget, totalSpent],
  );
  const expenseCount = useMemo(() => getExpenseCount(expenses), [expenses]);

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

  const groupedExpenses = useMemo(
    () => getGroupedExpensesArray(filteredExpenses),
    [filteredExpenses],
  );

  const recentExpenses = useMemo(
    () => filteredExpenses.slice(0, 5),
    [filteredExpenses],
  );

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Wedding Budget Tracker
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track every wedding expense category-wise.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <SummaryCard
          title="Total Budget"
          value={formatCurrency(totalBudget, currency)}
          subValue="Overall wedding budget"
          icon="💍"
        />

        <SummaryCard
          title="Total Spent"
          value={formatCurrency(totalSpent, currency)}
          subValue={`${expenseCount} ${
            expenseCount === 1 ? "entry" : "entries"
          } added`}
          icon="💸"
        />

        <SummaryCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget, currency)}
          subValue={
            remainingBudget < 0 ? "You are over budget" : "Still available"
          }
          icon={remainingBudget < 0 ? "⚠️" : "✅"}
          bgClass={remainingBudget < 0 ? "bg-red-50" : "bg-emerald-50"}
          borderClass={
            remainingBudget < 0 ? "border-red-200" : "border-emerald-200"
          }
          textClass={remainingBudget < 0 ? "text-red-700" : "text-emerald-700"}
        />
      </div>

      <div className="mt-6">
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
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
          <p className="text-xs text-slate-500">
            {groupedExpenses.length}{" "}
            {groupedExpenses.length === 1 ? "group" : "groups"}
          </p>
        </div>

        {groupedExpenses.length > 0 ? (
          <div className="space-y-3">
            {groupedExpenses.map((group, index) => (
              <CategoryAccordion
                key={group.category}
                category={group.category}
                total={group.total}
                count={group.count}
                items={group.items}
                onEditExpense={onEditExpense}
                onDeleteExpense={onDeleteExpense}
                currency={currency}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-700">
              No matching expenses found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing search text or category filter.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Expenses
          </h2>
          <p className="text-xs text-slate-500">Latest 5 filtered entries</p>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={onEditExpense}
                onDelete={onDeleteExpense}
                currency={currency}
                showCategory
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              No recent expenses to show.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAddExpense}
        className="fixed bottom-24 right-4 z-40 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:scale-95"
      >
        + Add Expense
      </button>
    </div>
  );
};

export default Dashboard;
