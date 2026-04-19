import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_CATEGORIES = [
  "Gold",
  "Clothes",
  "Venue",
  "Food",
  "Decoration",
  "Photography",
  "Makeup",
  "Travel",
  "Gifts",
  "Invitations",
  "Miscellaneous",
];

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Bank Transfer"];
const CUSTOM_CATEGORY_VALUE = "__custom__";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const initialFormState = {
  itemName: "",
  category: "",
  amount: "",
  paidAmount: "",
  paymentStatus: "Pending",
  date: getTodayDate(),
  paymentMethod: "Cash",
  vendor: "",
  notes: "",
};

const formatNumberWithCommas = (value) => {
  if (value === "" || value === null || value === undefined) return "";

  const number = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(number)) return "";

  return number.toLocaleString("en-IN");
};

const removeCommas = (value) => {
  return String(value).replace(/,/g, "");
};

const ExpenseForm = ({
  initialValues = null,
  onSubmit,
  onCancel,
  isEditing = false,
  submitButtonText,
  categories = DEFAULT_CATEGORIES,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [categoryMode, setCategoryMode] = useState("select");
  const [customCategory, setCustomCategory] = useState("");

  const mergedCategories = useMemo(() => {
    const safeCategories = categories?.length ? categories : DEFAULT_CATEGORIES;
    return [...new Set(safeCategories.filter(Boolean))];
  }, [categories]);

  useEffect(() => {
    if (initialValues) {
      const incomingCategory = initialValues.category || "";
      const isExistingCategory = mergedCategories.includes(incomingCategory);

      setFormData({
        itemName: initialValues.itemName || "",
        category: incomingCategory,
        amount:
          initialValues.amount !== undefined && initialValues.amount !== null
            ? String(initialValues.amount)
            : "",
        paidAmount:
          initialValues.paidAmount !== undefined &&
          initialValues.paidAmount !== null
            ? String(initialValues.paidAmount)
            : "",
        paymentStatus: initialValues.paymentStatus || "Pending",
        date: initialValues.date || getTodayDate(),
        paymentMethod: initialValues.paymentMethod || "Cash",
        vendor: initialValues.vendor || "",
        notes: initialValues.notes || "",
      });

      if (incomingCategory && !isExistingCategory) {
        setCategoryMode("custom");
        setCustomCategory(incomingCategory);
      } else {
        setCategoryMode("select");
        setCustomCategory("");
      }
    } else {
      setFormData(initialFormState);
      setCategoryMode("select");
      setCustomCategory("");
    }
  }, [initialValues, mergedCategories]);

  const getPaymentStatus = (amountValue, paidAmountValue) => {
    const amount = Number(amountValue || 0);
    const paidAmount = Number(paidAmountValue || 0);

    if (paidAmount <= 0) return "Pending";
    if (amount > 0 && paidAmount >= amount) return "Paid";
    if (paidAmount > 0 && paidAmount < amount) return "Partial";
    return "Pending";
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "amount" || field === "paidAmount") {
        next.paymentStatus = getPaymentStatus(next.amount, next.paidAmount);
      }

      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFormattedNumberChange = (field, value) => {
    const rawValue = removeCommas(value);

    if (!/^\d*$/.test(rawValue)) return;

    handleChange(field, rawValue);
  };

  const handleCategorySelect = (value) => {
    if (value === CUSTOM_CATEGORY_VALUE) {
      setCategoryMode("custom");
      setFormData((prev) => ({
        ...prev,
        category: "",
      }));
      return;
    }

    setCategoryMode("select");
    setCustomCategory("");
    handleChange("category", value);
  };

  const handleCustomCategoryChange = (value) => {
    setCustomCategory(value);
    handleChange("category", value);
  };

  const validateForm = () => {
    const newErrors = {};
    const amount = Number(formData.amount || 0);
    const paidAmount = Number(formData.paidAmount || 0);

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.amount || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (paidAmount < 0) {
      newErrors.paidAmount = "Paid amount cannot be negative";
    }

    if (paidAmount > amount) {
      newErrors.paidAmount = "Paid amount cannot be greater than total amount";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setCategoryMode("select");
    setCustomCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const amount = Number(formData.amount || 0);
      const paidAmount = Number(formData.paidAmount || 0);

      const payload = {
        ...formData,
        itemName: formData.itemName.trim(),
        category: formData.category.trim(),
        amount,
        paidAmount,
        paymentStatus: getPaymentStatus(amount, paidAmount),
        vendor: formData.vendor.trim(),
        notes: formData.notes.trim(),
      };

      await onSubmit?.(payload);

      if (!isEditing) {
        resetForm();
      }
    } catch (error) {
      console.error("Expense form submit error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCategoryValue =
    categoryMode === "custom" ? CUSTOM_CATEGORY_VALUE : formData.category || "";

  const dueAmount = Math.max(
    Number(formData.amount || 0) - Number(formData.paidAmount || 0),
    0,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Item Name
        </label>
        <input
          type="text"
          value={formData.itemName}
          onChange={(e) => handleChange("itemName", e.target.value)}
          placeholder="Enter item name"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
            errors.itemName
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-slate-500"
          }`}
        />
        {errors.itemName ? (
          <p className="mt-1 text-xs text-red-500">{errors.itemName}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Category
        </label>

        <select
          value={selectedCategoryValue}
          onChange={(e) => handleCategorySelect(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
            errors.category
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-slate-500"
          }`}
        >
          <option value="">Select category</option>
          {mergedCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value={CUSTOM_CATEGORY_VALUE}>Custom Category</option>
        </select>

        {categoryMode === "custom" ? (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => handleCustomCategoryChange(e.target.value)}
            placeholder="Enter custom category"
            className={`mt-3 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
              errors.category
                ? "border-red-400 focus:border-red-500"
                : "border-slate-300 focus:border-slate-500"
            }`}
          />
        ) : null}

        {errors.category ? (
          <p className="mt-1 text-xs text-red-500">{errors.category}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Total Amount
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberWithCommas(formData.amount)}
          onChange={(e) =>
            handleFormattedNumberChange("amount", e.target.value)
          }
          placeholder="Enter total amount"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
            errors.amount
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-slate-500"
          }`}
        />
        {errors.amount ? (
          <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Paid Amount
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberWithCommas(formData.paidAmount)}
          onChange={(e) =>
            handleFormattedNumberChange("paidAmount", e.target.value)
          }
          placeholder="Enter paid amount"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
            errors.paidAmount
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-slate-500"
          }`}
        />
        {errors.paidAmount ? (
          <p className="mt-1 text-xs text-red-500">{errors.paidAmount}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Payment Status</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formData.paymentStatus}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Due Amount</p>
          <p className="mt-1 text-sm font-semibold text-red-600">
            ₹{formatNumberWithCommas(dueAmount)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
              errors.date
                ? "border-red-400 focus:border-red-500"
                : "border-slate-300 focus:border-slate-500"
            }`}
          />
          {errors.date ? (
            <p className="mt-1 text-xs text-red-500">{errors.date}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => handleChange("paymentMethod", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Vendor
        </label>
        <input
          type="text"
          value={formData.vendor}
          onChange={(e) => handleChange("vendor", e.target.value)}
          placeholder="Enter vendor name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add notes"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : submitButtonText ||
              (isEditing ? "Update Expense" : "Save Expense")}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default ExpenseForm;
