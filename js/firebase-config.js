import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyACIvSATz1W-C9ouYnmN1IdKLNhfwUteK8",
    authDomain: "stripwereld-fb41c.firebaseapp.com",
    databaseURL: "https://stripwereld-fb41c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stripwereld-fb41c",
    storageBucket: "stripwereld-fb41c.firebasestorage.app",
    messagingSenderId: "83121315337",
    appId: "1:83121315337:web:78ac00cd62beec0835e2d8",
    measurementId: "G-YD5M8G6RRM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);