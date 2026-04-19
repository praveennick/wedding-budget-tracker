// src/services/budgetService.js
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, USER_ID } from "./firebase";

const budgetDocRef = doc(db, "users", USER_ID, "settings", "budget");

// Save budget for first time or overwrite
export const saveBudget = async (budgetData) => {
    try {
        const payload = {
            totalBudget: Number(budgetData.totalBudget || 0),
            currency: budgetData.currency || "INR",
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
        };

        await setDoc(budgetDocRef, payload);
        return payload;
    } catch (error) {
        console.error("Error saving budget:", error);
        throw error;
    }
};

// Get current budget
export const getBudget = async () => {
    try {
        const snapshot = await getDoc(budgetDocRef);

        if (!snapshot.exists()) {
            return {
                totalBudget: 0,
                currency: "INR",
            };
        }

        return {
            id: snapshot.id,
            ...snapshot.data(),
        };
    } catch (error) {
        console.error("Error fetching budget:", error);
        throw error;
    }
};

// Update only the fields you pass
export const updateBudget = async (updatedData) => {
    try {
        const payload = {
            ...updatedData,
            totalBudget:
                updatedData.totalBudget !== undefined
                    ? Number(updatedData.totalBudget || 0)
                    : undefined,
            updatedAt: serverTimestamp(),
        };

        Object.keys(payload).forEach((key) => {
            if (payload[key] === undefined) {
                delete payload[key];
            }
        });

        await updateDoc(budgetDocRef, payload);
        return true;
    } catch (error) {
        console.error("Error updating budget:", error);
        throw error;
    }
};