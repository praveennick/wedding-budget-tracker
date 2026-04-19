// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import BottomNav from "./components/BottomNav";
import { deleteExpense, getExpenses } from "./services/expenseService";
import { getBudget } from "./services/budgetService";
import { getGroupedExpensesArray } from "./utils/groupExpenses";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({
    totalBudget: 0,
    currency: "INR",
  });
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const groupedExpenses = useMemo(
    () => getGroupedExpensesArray(expenses),
    [expenses],
  );

  const categoryList = useMemo(() => {
    const groupedCategories = groupedExpenses.map((item) => item.category);

    const defaultCategories = [
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

    return [...new Set([...defaultCategories, ...groupedCategories])];
  }, [groupedExpenses]);

  const loadExpenses = async () => {
    try {
      const expenseData = await getExpenses();
      setExpenses(expenseData);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const loadBudget = async () => {
    try {
      const budgetData = await getBudget();
      setBudget(
        budgetData || {
          totalBudget: 0,
          currency: "INR",
        },
      );
    } catch (error) {
      console.error("Error loading budget:", error);
    }
  };

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadExpenses(), loadBudget()]);
    } catch (error) {
      console.error("Error loading app data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleExpenseSaved = async () => {
    await loadExpenses();
    setSelectedExpense(null);
    setActiveTab("dashboard");
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setSelectedExpense(null);
    setActiveTab("dashboard");
  };

  const handleDeleteExpense = async (expense) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${expense.itemName}"?`,
    );

    if (!isConfirmed) return;

    try {
      await deleteExpense(expense.id);
      await loadExpenses();

      if (selectedExpense?.id === expense.id) {
        setSelectedExpense(null);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleBudgetSaved = async (latestBudget) => {
    if (latestBudget) {
      setBudget(latestBudget);
    } else {
      await loadBudget();
    }

    setActiveTab("dashboard");
  };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            expenses={expenses}
            budget={budget}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddExpense={() => {
              setSelectedExpense(null);
              setActiveTab("add");
            }}
            categories={categoryList}
          />
        );

      case "add":
        return (
          <AddExpense
            selectedExpense={selectedExpense}
            onExpenseSaved={handleExpenseSaved}
            onCancelEdit={handleCancelEdit}
            categories={categoryList}
          />
        );

      case "reports":
        return (
          <Reports
            expenses={expenses}
            budget={budget}
            categories={categoryList}
          />
        );

      case "settings":
        return <Settings budget={budget} onBudgetSaved={handleBudgetSaved} />;

      default:
        return (
          <Dashboard
            expenses={expenses}
            budget={budget}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddExpense={() => {
              setSelectedExpense(null);
              setActiveTab("add");
            }}
            categories={categoryList}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Loading Wedding Tracker
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while your budget data is loading.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {renderPage()}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
