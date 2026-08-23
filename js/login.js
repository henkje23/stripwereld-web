import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const formulier =
    document.getElementById("login-form");

const status =
    document.getElementById("login-status");


formulier.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const wachtwoord =
            document.getElementById("wachtwoord")
                .value;


        status.textContent =
            "⏳ Inloggen...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                wachtwoord
            );


            status.textContent =
                "✅ Ingelogd!";


            window.location.href =
                "alle-strips.html";


        } catch (fout) {

            console.error(
                "Login fout:",
                fout
            );


            status.textContent =
                "❌ E-mailadres of wachtwoord is fout.";

        }

    }
);