// src/utils/exportReport.js
import * as XLSX from "xlsx";
import {
    getCategorySummary,
    getMonthlySummary,
    getPaymentStatusSummary,
    getVendorSummary,
} from "./reportHelpers";

export const exportWeddingReport = (expenses = [], budget = {}) => {
    const workbook = XLSX.utils.book_new();

    const overallRows = [
        { Metric: "Total Budget", Value: Number(budget?.totalBudget || 0) },
        {
            Metric: "Total Spent",
            Value: expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
        },
        {
            Metric: "Total Paid",
            Value: expenses.reduce((sum, item) => sum + Number(item.paidAmount || 0), 0),
        },
        {
            Metric: "Total Due",
            Value: expenses.reduce((sum, item) => sum + Number(item.dueAmount || 0), 0),
        },
        { Metric: "Total Entries", Value: expenses.length },
    ];

    const expenseRows = expenses.map((item) => ({
        Date: item.date || "",
        Item: item.itemName || "",
        Category: item.category || "",
        Vendor: item.vendor || "",
        PaymentStatus: item.paymentStatus || "",
        Amount: Number(item.amount || 0),
        PaidAmount: Number(item.paidAmount || 0),
        DueAmount: Number(item.dueAmount || 0),
        PaymentMethod: item.paymentMethod || "",
        Notes: item.notes || "",
    }));

    const categoryRows = getCategorySummary(expenses).map((item) => ({
        Category: item.name,
        Entries: item.count,
        Total: item.total,
    }));

    const vendorRows = getVendorSummary(expenses).map((item) => ({
        Vendor: item.name,
        Entries: item.count,
        Total: item.total,
        Paid: item.paid,
        Due: item.due,
    }));

    const monthlyRows = getMonthlySummary(expenses).map((item) => ({
        Month: item.monthLabel,
        Entries: item.count,
        Total: item.total,
        Paid: item.paid,
        Due: item.due,
    }));

    const statusRows = getPaymentStatusSummary(expenses).map((item) => ({
        Status: item.name,
        Entries: item.count,
        Total: item.total,
        Paid: item.paid,
        Due: item.due,
    }));

    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(overallRows),
        "Overall Summary"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(expenseRows),
        "All Expenses"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(categoryRows),
        "Category Summary"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(vendorRows),
        "Vendor Summary"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(monthlyRows),
        "Monthly Summary"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(statusRows),
        "Payment Status"
    );

    XLSX.writeFile(workbook, "wedding-budget-report.xlsx");
};