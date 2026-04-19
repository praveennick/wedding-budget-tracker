// src/utils/formatCurrency.js
export const formatCurrency = (amount, currency = "INR") => {
    const numericAmount = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(numericAmount);
};