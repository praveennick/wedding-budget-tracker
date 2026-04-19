import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    getCategorySummary,
    getMonthlySummary,
    getPaymentStatusSummary,
    getVendorSummary,
} from "./reportHelpers";

export const exportWeddingPdfReport = (expenses = [], budget = {}) => {
    const doc = new jsPDF();

    const totalSpent = expenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
    );
    const totalPaid = expenses.reduce(
        (sum, item) => sum + Number(item.paidAmount || 0),
        0
    );
    const totalDue = expenses.reduce(
        (sum, item) => sum + Number(item.dueAmount || 0),
        0
    );

    doc.setFontSize(18);
    doc.text("Wedding Budget Report", 14, 18);

    doc.setFontSize(11);
    doc.text(`Total Budget: ${Number(budget?.totalBudget || 0).toLocaleString("en-IN")}`, 14, 28);
    doc.text(`Total Spent: ${totalSpent.toLocaleString("en-IN")}`, 14, 35);
    doc.text(`Total Paid: ${totalPaid.toLocaleString("en-IN")}`, 14, 42);
    doc.text(`Total Due: ${totalDue.toLocaleString("en-IN")}`, 14, 49);
    doc.text(`Total Entries: ${expenses.length}`, 14, 56);

    autoTable(doc, {
        startY: 64,
        head: [["Category", "Entries", "Total"]],
        body: getCategorySummary(expenses).map((item) => [
            item.name,
            item.count,
            Number(item.total || 0).toLocaleString("en-IN"),
        ]),
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Month", "Entries", "Total", "Paid", "Due"]],
        body: getMonthlySummary(expenses).map((item) => [
            item.monthLabel,
            item.count,
            Number(item.total || 0).toLocaleString("en-IN"),
            Number(item.paid || 0).toLocaleString("en-IN"),
            Number(item.due || 0).toLocaleString("en-IN"),
        ]),
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Vendor", "Entries", "Total", "Paid", "Due"]],
        body: getVendorSummary(expenses).map((item) => [
            item.name,
            item.count,
            Number(item.total || 0).toLocaleString("en-IN"),
            Number(item.paid || 0).toLocaleString("en-IN"),
            Number(item.due || 0).toLocaleString("en-IN"),
        ]),
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Status", "Entries", "Total", "Paid", "Due"]],
        body: getPaymentStatusSummary(expenses).map((item) => [
            item.name,
            item.count,
            Number(item.total || 0).toLocaleString("en-IN"),
            Number(item.paid || 0).toLocaleString("en-IN"),
            Number(item.due || 0).toLocaleString("en-IN"),
        ]),
    });

    doc.save("wedding-budget-report.pdf");
};