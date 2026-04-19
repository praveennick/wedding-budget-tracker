// src/components/ExpenseItem.jsx
import React from "react";
import { formatCurrency } from "../utils/formatCurrency";

const getStatusStyles = (status) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-700";
    case "Partial":
      return "bg-amber-100 text-amber-700";
    case "Advance Paid":
      return "bg-blue-100 text-blue-700";
    case "Pending":
    default:
      return "bg-red-100 text-red-700";
  }
};

const ExpenseItem = ({
  expense,
  onEdit,
  onDelete,
  currency = "INR",
  showCategory = true,
}) => {
  const {
    itemName,
    category,
    amount,
    paidAmount,
    dueAmount,
    paymentStatus,
    date,
    paymentMethod,
    vendor,
    notes,
  } = expense;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {itemName || "Untitled Item"}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {showCategory && category ? (
              <span className="rounded-full bg-slate-100 px-2 py-1">
                {category}
              </span>
            ) : null}

            {date ? (
              <span className="rounded-full bg-slate-100 px-2 py-1">
                {date}
              </span>
            ) : null}

            {paymentMethod ? (
              <span className="rounded-full bg-slate-100 px-2 py-1">
                {paymentMethod}
              </span>
            ) : null}

            {paymentStatus ? (
              <span
                className={`rounded-full px-2 py-1 font-medium ${getStatusStyles(
                  paymentStatus,
                )}`}
              >
                {paymentStatus}
              </span>
            ) : null}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <p className="text-slate-600">
              <span className="font-medium text-slate-700">Paid:</span>{" "}
              {formatCurrency(paidAmount || 0, currency)}
            </p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-700">Due:</span>{" "}
              {formatCurrency(dueAmount || 0, currency)}
            </p>
          </div>

          {vendor ? (
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Vendor:</span>{" "}
              {vendor}
            </p>
          ) : null}

          {notes ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{notes}</p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-base font-bold text-emerald-600">
            {formatCurrency(amount, currency)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(expense)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(expense)}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
