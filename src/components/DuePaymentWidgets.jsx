import React, { useMemo } from "react";
import { formatCurrency } from "../utils/formatCurrency";

const DuePaymentWidgets = ({ expenses = [], currency = "INR" }) => {
  const summary = useMemo(() => {
    const dueItems = expenses.filter((item) => Number(item.dueAmount || 0) > 0);

    const totalDue = dueItems.reduce(
      (sum, item) => sum + Number(item.dueAmount || 0),
      0,
    );

    const pendingCount = dueItems.filter(
      (item) => item.paymentStatus === "Pending",
    ).length;

    const partialCount = dueItems.filter(
      (item) => item.paymentStatus === "Partial",
    ).length;

    const topDueItems = [...dueItems]
      .sort((a, b) => Number(b.dueAmount || 0) - Number(a.dueAmount || 0))
      .slice(0, 3);

    return {
      totalDue,
      dueItemsCount: dueItems.length,
      pendingCount,
      partialCount,
      topDueItems,
    };
  }, [expenses]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-red-500">
            Total Due
          </p>
          <p className="mt-1 text-xl font-bold text-red-700">
            {formatCurrency(summary.totalDue, currency)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-amber-600">
              Pending Items
            </p>
            <p className="mt-1 text-lg font-bold text-amber-700">
              {summary.pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-blue-600">
              Partial Items
            </p>
            <p className="mt-1 text-lg font-bold text-blue-700">
              {summary.partialCount}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Top Due Payments
        </h2>
        <p className="mb-3 text-sm text-slate-500">
          Highest due expenses to follow up
        </p>

        {summary.topDueItems.length === 0 ? (
          <p className="text-sm text-slate-500">No due payments found.</p>
        ) : (
          <div className="space-y-3">
            {summary.topDueItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.itemName || "Untitled Item"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.vendor || "No Vendor"} •{" "}
                      {item.paymentStatus || "Pending"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">
                      {formatCurrency(item.dueAmount || 0, currency)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Total {formatCurrency(item.amount || 0, currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DuePaymentWidgets;
