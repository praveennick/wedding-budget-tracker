import React, { useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import MonthlySummarySection from "../components/MonthlySummarySection";
import VendorSummarySection from "../components/VendorSummarySection";
import PaymentStatusSummarySection from "../components/PaymentStatusSummarySection";
import { formatCurrency } from "../utils/formatCurrency";
import { getTotalSpent } from "../utils/calculateTotals";
import {
  getCategorySummary,
  getMonthlySummary,
  getPaymentStatusSummary,
  getVendorSummary,
} from "../utils/reportHelpers";
import { exportWeddingReport } from "../utils/exportReport";
import { exportWeddingPdfReport } from "../utils/exportPdfReport";

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
  }, [
    expenses,
    searchText,
    selectedCategory,
    selectedSort,
    selectedPaymentStatus,
  ]);

  const totalSpent = useMemo(
    () => getTotalSpent(filteredExpenses),
    [filteredExpenses],
  );
  const totalPaid = useMemo(
    () =>
      filteredExpenses.reduce(
        (sum, item) => sum + Number(item.paidAmount || 0),
        0,
      ),
    [filteredExpenses],
  );
  const totalDue = useMemo(
    () =>
      filteredExpenses.reduce(
        (sum, item) => sum + Number(item.dueAmount || 0),
        0,
      ),
    [filteredExpenses],
  );

  const categorySummary = useMemo(
    () => getCategorySummary(filteredExpenses),
    [filteredExpenses],
  );

  const monthlySummary = useMemo(
    () => getMonthlySummary(filteredExpenses),
    [filteredExpenses],
  );

  const vendorSummary = useMemo(
    () => getVendorSummary(filteredExpenses),
    [filteredExpenses],
  );

  const paymentStatusSummary = useMemo(
    () => getPaymentStatusSummary(filteredExpenses),
    [filteredExpenses],
  );

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Category, monthly, vendor and payment insights.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => exportWeddingReport(filteredExpenses, budget)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Excel
          </button>
          <button
            type="button"
            onClick={() => exportWeddingPdfReport(filteredExpenses, budget)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            PDF
          </button>
        </div>
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

      <div className="mt-6 grid grid-cols-1 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Filtered Total Spent
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatCurrency(totalSpent, currency)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Total Paid
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-600">
            {formatCurrency(totalPaid, currency)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Total Due
          </p>
          <p className="mt-1 text-xl font-bold text-red-600">
            {formatCurrency(totalDue, currency)}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <CategoryChart data={categorySummary} currency={currency} />
        <MonthlyChart data={monthlySummary} currency={currency} />
        <MonthlySummarySection data={monthlySummary} currency={currency} />
        <VendorSummarySection data={vendorSummary} currency={currency} />
        <PaymentStatusSummarySection
          data={paymentStatusSummary}
          currency={currency}
        />
      </div>
    </div>
  );
};

export default Reports;
