// src/components/PaymentStatusSummarySection.jsx
import React from "react";
import { formatCurrency } from "../utils/formatCurrency";

const getCardStyle = (status) => {
  switch (status) {
    case "Paid":
      return "border-emerald-200 bg-emerald-50";
    case "Partial":
      return "border-amber-200 bg-amber-50";
    case "Advance Paid":
      return "border-blue-200 bg-blue-50";
    case "Pending":
    default:
      return "border-red-200 bg-red-50";
  }
};

const PaymentStatusSummarySection = ({ data = [], currency = "INR" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Payment Status Summary
        </h2>
        <p className="text-sm text-slate-500">
          Track paid, pending and partial payments
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {data.map((item) => (
          <div
            key={item.name}
            className={`rounded-xl border p-3 ${getCardStyle(item.name)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
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
                <p className="text-xs text-slate-600">
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
    </div>
  );
};

export default PaymentStatusSummarySection;
