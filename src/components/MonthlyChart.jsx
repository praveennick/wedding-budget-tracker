import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency } from "../utils/formatCurrency";

const MonthlyChart = ({ data = [], currency = "INR" }) => {
  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      month: item.monthLabel,
      total: Number(item.total || 0),
      paid: Number(item.paid || 0),
      due: Number(item.due || 0),
      entries: Number(item.count || 0),
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const row = payload[0]?.payload;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <div className="mt-2 space-y-1 text-xs">
          <p className="text-slate-700">
            Total: {formatCurrency(row?.total || 0, currency)}
          </p>
          <p className="text-emerald-600">
            Paid: {formatCurrency(row?.paid || 0, currency)}
          </p>
          <p className="text-red-500">
            Due: {formatCurrency(row?.due || 0, currency)}
          </p>
          <p className="text-slate-500">Entries: {row?.entries || 0}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Monthly Trend
        </h2>
        <p className="text-sm text-slate-500">
          Real chart for month-wise spending
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-slate-500">
          No monthly chart data available.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0f172a"
                  fill="#cbd5e1"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="paid"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="due"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyChart;
