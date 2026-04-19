// src/components/SummaryCard.jsx
import React from "react";

const SummaryCard = ({
  title,
  value,
  subValue,
  icon,
  bgClass = "bg-white",
  textClass = "text-slate-900",
  borderClass = "border-slate-200",
}) => {
  return (
    <div
      className={`rounded-2xl border ${borderClass} ${bgClass} p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h3
            className={`mt-2 break-words text-xl font-bold leading-tight ${textClass}`}
          >
            {value}
          </h3>

          {subValue ? (
            <p className="mt-2 text-sm text-slate-500">{subValue}</p>
          ) : null}
        </div>

        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SummaryCard;
