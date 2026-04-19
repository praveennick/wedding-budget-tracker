// src/components/BottomNav.jsx
import React from "react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: "🏠" },
  { key: "add", label: "Add", icon: "➕" },
  { key: "reports", label: "Reports", icon: "📊" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

const BottomNav = ({ activeTab = "dashboard", onChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange?.(item.key)}
              className={`flex min-w-[72px] flex-col items-center justify-center rounded-2xl px-3 py-2 text-xs font-medium transition active:scale-95 ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
