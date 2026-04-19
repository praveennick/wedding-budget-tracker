// src/utils/calculateTotals.js
export const getTotalSpent = (expenses = []) => {
    return expenses.reduce((sum, item) => {
        return sum + Number(item.amount || 0);
    }, 0);
};

export const getRemainingBudget = (totalBudget = 0, totalSpent = 0) => {
    return Number(totalBudget || 0) - Number(totalSpent || 0);
};

export const getExpenseCount = (expenses = []) => {
    return expenses.length;
};