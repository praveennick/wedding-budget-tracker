// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { getBudget, saveBudget, updateBudget } from "../services/budgetService";
import { formatCurrency } from "../utils/formatCurrency";

const Settings = ({
  budget = { totalBudget: 0, currency: "INR" },
  onBudgetSaved,
}) => {
  const [totalBudget, setTotalBudget] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingBudget, setHasExistingBudget] = useState(false);

  useEffect(() => {
    setTotalBudget(budget?.totalBudget ? String(budget.totalBudget) : "");
    setCurrency(budget?.currency || "INR");
    setHasExistingBudget(Number(budget?.totalBudget || 0) > 0);
  }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const payload = {
        totalBudget: Number(totalBudget || 0),
        currency,
      };

      if (hasExistingBudget) {
        await updateBudget(payload);
      } else {
        await saveBudget(payload);
      }

      const latestBudget = await getBudget();
      setHasExistingBudget(Number(latestBudget?.totalBudget || 0) > 0);

      await onBudgetSaved?.(latestBudget);
      alert("Budget saved successfully.");
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set and update your overall wedding budget.
        </p>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Current Budget
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          {formatCurrency(budget?.totalBudget || 0, budget?.currency || "INR")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Currency: {budget?.currency || "INR"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Total Wedding Budget
          </label>
          <input
            type="number"
            min="0"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            placeholder="Enter total budget"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Saving..."
            : hasExistingBudget
              ? "Update Budget"
              : "Save Budget"}
        </button>
      </form>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold text-slate-800">Tips</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>• Set your full wedding budget here.</li>
          <li>
            • Dashboard will automatically show spent and remaining balance.
          </li>
          <li>• You can update this anytime.</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
