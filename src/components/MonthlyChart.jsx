import React from "react";
import { formatCurrency } from "../utils/formatCurrency";

const MonthlyChart = ({ data = [], currency = "INR" }) => {
  const maxValue = Math.max(...data.map((item) => item.total), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Monthly Chart
        </h2>
        <p className="text-sm text-slate-500">Month-wise spending trend</p>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500">
          No monthly chart data available.
        </p>
      ) : (
        <div className="space-y-4">
          {data
            .slice()
            .reverse()
            .map((item) => {
              const width =
                maxValue > 0
                  ? `${Math.max((item.total / maxValue) * 100, 6)}%`
                  : "0%";

              return (
                <div key={item.monthKey}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-800">
                      {item.monthLabel}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      {formatCurrency(item.total, currency)}
                    </p>
                  </div>

                  <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{ width }}
                    />
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {item.count} {item.count === 1 ? "entry" : "entries"}
                    </span>
                    <span>Due {formatCurrency(item.due, currency)}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MonthlyChart;
