// src/components/VendorSummarySection.jsx
import React from "react";
import { formatCurrency } from "../utils/formatCurrency";

const VendorSummarySection = ({ data = [], currency = "INR" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Vendor Tracking
        </h2>
        <p className="text-sm text-slate-500">
          See how much is spent vendor-wise
        </p>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No vendor data available.</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.count} {item.count === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(item.total, currency)}
                  </p>
                  <p className="text-xs text-emerald-600">
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

export default VendorSummarySection;
