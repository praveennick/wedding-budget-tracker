// src/pages/AddExpense.jsx
import React, { useMemo } from "react";
import ExpenseForm from "../components/ExpenseForm";
import { addExpense, updateExpense } from "../services/expenseService";

const AddExpense = ({
  selectedExpense = null,
  onExpenseSaved,
  onCancelEdit,
  categories = [],
}) => {
  const isEditing = useMemo(
    () => Boolean(selectedExpense?.id),
    [selectedExpense],
  );

  const quickCategories = useMemo(() => {
    return categories.slice(0, 6);
  }, [categories]);

  const handleSubmit = async (payload) => {
    try {
      if (isEditing && selectedExpense?.id) {
        await updateExpense(selectedExpense.id, payload);
      } else {
        await addExpense(payload);
      }

      await onExpenseSaved?.();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditing ? "Edit Expense" : "Add Expense"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isEditing
            ? "Update your wedding expense entry."
            : "Add a new wedding expense entry."}
        </p>
      </div>

      {!isEditing && quickCategories.length > 0 ? (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Popular Categories
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickCategories.map((item) => (
              <div
                key={item}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <ExpenseForm
        initialValues={selectedExpense}
        onSubmit={handleSubmit}
        onCancel={isEditing ? onCancelEdit : undefined}
        isEditing={isEditing}
        submitButtonText={isEditing ? "Update Expense" : "Save Expense"}
        categories={categories?.length ? categories : undefined}
      />

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold text-slate-800">Tips</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>• Add each item separately for better tracking.</li>
          <li>• Use the same category name to group similar expenses.</li>
          <li>• Example: all jewellery items can go under Gold.</li>
          <li>• Use custom category when needed.</li>
        </ul>
      </div>
    </div>
  );
};

export default AddExpense;
