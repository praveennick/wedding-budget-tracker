// src/components/MonthlySummarySection.jsx
import React from "react";
import { formatCurrency } from "../utils/formatCurrency";

const MonthlySummarySection = ({ data = [], currency = "INR" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Monthly Summary
        </h2>
        <p className="text-sm text-slate-500">Track spending month by month</p>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No monthly data available.</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.monthKey}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.monthLabel}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.count} {item.count === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(item.total, currency)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Paid {formatCurrency(item.paid, currency)}
                  </p>
                  <p className="text-xs text-red-500">
                    Due {formatCurrency(item.due, currency)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthlySummarySection;
