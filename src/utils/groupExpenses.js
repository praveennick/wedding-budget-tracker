// src/utils/groupExpenses.js
export const groupExpensesByCategory = (expenses = []) => {
    return expenses.reduce((acc, expense) => {
        const category = expense.category?.trim() || "Miscellaneous";
        const amount = Number(expense.amount || 0);

        if (!acc[category]) {
            acc[category] = {
                category,
                total: 0,
                count: 0,
                items: [],
            };
        }

        acc[category].total += amount;
        acc[category].count += 1;
        acc[category].items.push(expense);

        return acc;
    }, {});
};

export const getGroupedExpensesArray = (expenses = []) => {
    const grouped = groupExpensesByCategory(expenses);

    return Object.values(grouped).sort((a, b) => b.total - a.total);
};