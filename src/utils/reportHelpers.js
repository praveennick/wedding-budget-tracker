// src/utils/reportHelpers.js

export const getMonthKey = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Unknown";

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const getMonthLabel = (monthKey) => {
    if (!monthKey || monthKey === "Unknown") return "Unknown";
    const [year, month] = monthKey.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);

    return date.toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
    });
};

export const getCategorySummary = (expenses = []) => {
    const grouped = {};

    expenses.forEach((item) => {
        const category = item.category || "Miscellaneous";
        const amount = Number(item.amount || 0);

        if (!grouped[category]) {
            grouped[category] = {
                name: category,
                total: 0,
                count: 0,
            };
        }

        grouped[category].total += amount;
        grouped[category].count += 1;
    });

    return Object.values(grouped).sort((a, b) => b.total - a.total);
};

export const getVendorSummary = (expenses = []) => {
    const grouped = {};

    expenses.forEach((item) => {
        const vendor = item.vendor?.trim() || "No Vendor";
        const amount = Number(item.amount || 0);
        const paidAmount = Number(item.paidAmount || 0);
        const dueAmount = Number(item.dueAmount || 0);

        if (!grouped[vendor]) {
            grouped[vendor] = {
                name: vendor,
                total: 0,
                paid: 0,
                due: 0,
                count: 0,
            };
        }

        grouped[vendor].total += amount;
        grouped[vendor].paid += paidAmount;
        grouped[vendor].due += dueAmount;
        grouped[vendor].count += 1;
    });

    return Object.values(grouped).sort((a, b) => b.total - a.total);
};

export const getMonthlySummary = (expenses = []) => {
    const grouped = {};

    expenses.forEach((item) => {
        const monthKey = getMonthKey(item.date);
        const amount = Number(item.amount || 0);
        const paidAmount = Number(item.paidAmount || 0);
        const dueAmount = Number(item.dueAmount || 0);

        if (!grouped[monthKey]) {
            grouped[monthKey] = {
                monthKey,
                monthLabel: getMonthLabel(monthKey),
                total: 0,
                paid: 0,
                due: 0,
                count: 0,
            };
        }

        grouped[monthKey].total += amount;
        grouped[monthKey].paid += paidAmount;
        grouped[monthKey].due += dueAmount;
        grouped[monthKey].count += 1;
    });

    return Object.values(grouped).sort((a, b) =>
        a.monthKey < b.monthKey ? 1 : -1
    );
};

export const getPaymentStatusSummary = (expenses = []) => {
    const summary = {
        Pending: { name: "Pending", count: 0, total: 0, paid: 0, due: 0 },
        "Advance Paid": { name: "Advance Paid", count: 0, total: 0, paid: 0, due: 0 },
        Partial: { name: "Partial", count: 0, total: 0, paid: 0, due: 0 },
        Paid: { name: "Paid", count: 0, total: 0, paid: 0, due: 0 },
    };

    expenses.forEach((item) => {
        const status = item.paymentStatus || "Pending";
        const amount = Number(item.amount || 0);
        const paidAmount = Number(item.paidAmount || 0);
        const dueAmount = Number(item.dueAmount || 0);

        if (!summary[status]) {
            summary[status] = {
                name: status,
                count: 0,
                total: 0,
                paid: 0,
                due: 0,
            };
        }

        summary[status].count += 1;
        summary[status].total += amount;
        summary[status].paid += paidAmount;
        summary[status].due += dueAmount;
    });

    return Object.values(summary);
};