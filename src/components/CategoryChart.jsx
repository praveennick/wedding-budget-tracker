// src/components/CategoryChart.jsx
import React from "react";
import { formatCurrency } from "../utils/formatCurrency";

const CategoryChart = ({ data = [], currency = "INR" }) => {
  const maxValue = Math.max(...data.map((item) => item.total), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Category Chart
        </h2>
        <p className="text-sm text-slate-500">
          Category-wise spending overview
        </p>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No chart data available.</p>
      ) : (
        <div className="space-y-4">
          {data.slice(0, 8).map((item) => {
            const width =
              maxValue > 0
                ? `${Math.max((item.total / maxValue) * 100, 8)}%`
                : "0%";

            return (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {item.name}
                  </p>
                  <p className="shrink-0 text-xs font-semibold text-slate-600">
                    {formatCurrency(item.total, currency)}
                  </p>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryChart;
