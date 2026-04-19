// src/components/CategoryAccordion.jsx
import React, { useState } from "react";
import ExpenseItem from "./ExpenseItem";
import { formatCurrency } from "../utils/formatCurrency";

const CategoryAccordion = ({
  category,
  total,
  count,
  items = [],
  onEditExpense,
  onDeleteExpense,
  currency = "INR",
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left active:scale-[0.995]"
      >
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {category || "Miscellaneous"}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-1">
              {count} {count === 1 ? "entry" : "entries"}
            </span>

            <span className="rounded-full bg-slate-100 px-2 py-1">
              Category total
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-base font-bold text-emerald-600">
            {formatCurrency(total, currency)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isOpen ? "Hide" : "Show"}
          </p>
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-slate-50 p-3">
          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={onEditExpense}
                  onDelete={onDeleteExpense}
                  currency={currency}
                  showCategory={false}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
                No expenses found in this category.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CategoryAccordion;
