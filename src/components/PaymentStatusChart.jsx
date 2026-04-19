import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../utils/formatCurrency";

const STATUS_COLORS = {
  Pending: "#dc2626",
  "Advance Paid": "#2563eb",
  Partial: "#d97706",
  Paid: "#16a34a",
};

const PaymentStatusChart = ({ data = [], currency = "INR" }) => {
  const chartData = data
    .filter((item) => Number(item.total || 0) > 0)
    .map((item) => ({
      name: item.name,
      value: Number(item.total || 0),
      count: Number(item.count || 0),
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const row = payload[0]?.payload;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-900">{row?.name}</p>
        <div className="mt-2 space-y-1 text-xs">
          <p className="text-slate-700">
            Total: {formatCurrency(row?.value || 0, currency)}
          </p>
          <p className="text-slate-500">Entries: {row?.count || 0}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Payment Status Chart
        </h2>
        <p className="text-sm text-slate-500">Visual split by payment status</p>
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-slate-500">
          No payment status data available.
        </p>
      ) : (
        <>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || "#64748b"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: STATUS_COLORS[item.name] || "#64748b",
                    }}
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {item.name}
                  </span>
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {formatCurrency(item.value, currency)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentStatusChart;
