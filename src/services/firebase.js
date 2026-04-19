// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// your config (already correct)
const firebaseConfig = {
    apiKey: "AIzaSyBX66aTG8Hmjx86x58VvfwEKKq5X88Rd7w",
    authDomain: "wedding-expense-tracker-480b4.firebaseapp.com",
    projectId: "wedding-expense-tracker-480b4",
    storageBucket: "wedding-expense-tracker-480b4.firebasestorage.app",
    messagingSenderId: "544807967966",
    appId: "1:544807967966:web:4ed5132c52e2847ece764f",
};

// initialize app
const app = initializeApp(firebaseConfig);

// initialize firestore
export const db = getFirestore(app);

// temp user id
export const USER_ID = "praveen-wedding-budget";