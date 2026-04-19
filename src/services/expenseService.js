// src/services/expenseService.js
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db, USER_ID } from "./firebase";

const expensesRef = collection(db, "users", USER_ID, "expenses");

// Add new expense
export const addExpense = async (expenseData) => {
    try {
        const totalAmount = Number(expenseData.amount || 0);
        const paidAmount = Number(expenseData.paidAmount || 0);

        const payload = {
            itemName: expenseData.itemName?.trim() || "",
            category: expenseData.category?.trim() || "Miscellaneous",
            amount: totalAmount,
            paidAmount,
            dueAmount: Math.max(totalAmount - paidAmount, 0),
            paymentStatus: expenseData.paymentStatus || "Pending",
            date: expenseData.date || new Date().toISOString().split("T")[0],
            paymentMethod: expenseData.paymentMethod || "Cash",
            notes: expenseData.notes?.trim() || "",
            vendor: expenseData.vendor?.trim() || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(expensesRef, payload);
        return { id: docRef.id, ...payload };
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
};

// Get all expenses
export const getExpenses = async () => {
    try {
        const q = query(expensesRef, orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
        }));
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;
    }
};

// Update expense
export const updateExpense = async (expenseId, updatedData) => {
    try {
        const expenseDocRef = doc(db, "users", USER_ID, "expenses", expenseId);

        const amount =
            updatedData.amount !== undefined
                ? Number(updatedData.amount || 0)
                : undefined;

        const paidAmount =
            updatedData.paidAmount !== undefined
                ? Number(updatedData.paidAmount || 0)
                : undefined;

        const payload = {
            ...updatedData,
            amount,
            paidAmount,
            updatedAt: serverTimestamp(),
        };

        if (amount !== undefined || paidAmount !== undefined) {
            const safeAmount = amount ?? 0;
            const safePaidAmount = paidAmount ?? 0;
            payload.dueAmount = Math.max(safeAmount - safePaidAmount, 0);
        }

        Object.keys(payload).forEach((key) => {
            if (payload[key] === undefined) {
                delete payload[key];
            }
        });

        await updateDoc(expenseDocRef, payload);
        return true;
    } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
    }
};

// Delete expense
export const deleteExpense = async (expenseId) => {
    try {
        const expenseDocRef = doc(db, "users", USER_ID, "expenses", expenseId);
        await deleteDoc(expenseDocRef);
        return true;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
};