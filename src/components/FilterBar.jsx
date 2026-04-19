// src/components/FilterBar.jsx
import React from "react";

const FilterBar = ({
  searchText = "",
  onSearchChange,
  selectedCategory = "All",
  onCategoryChange,
  selectedSort = "date-desc",
  onSortChange,
  selectedPaymentStatus = "All",
  onPaymentStatusChange,
  categories = [],
}) => {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Search
        </label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search item, vendor, notes..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Payment Status
          </label>
          <select
            value={selectedPaymentStatus}
            onChange={(e) => onPaymentStatusChange?.(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Advance Paid">Advance Paid</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Sort By
        </label>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange?.(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
          <option value="name-asc">Item Name A-Z</option>
          <option value="name-desc">Item Name Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
