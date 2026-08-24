import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const formulier =
    document.getElementById("login-form");

const status =
    document.getElementById("login-status");

const accountMaken =
    document.getElementById("account-maken");

const wachtwoordVergeten =
    document.getElementById("wachtwoord-vergeten");


// Blijf ingelogd totdat de gebruiker zelf uitlogt
await setPersistence(
    auth,
    browserLocalPersistence
);


// INLOGGEN
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


// ACCOUNT AANMAKEN
accountMaken.addEventListener(
    "click",
    async () => {

        const email =
            document.getElementById("email")
                .value
                .trim();

        const wachtwoord =
            document.getElementById("wachtwoord")
                .value;

        if (!email || !wachtwoord) {

            status.textContent =
                "❌ Vul eerst je e-mailadres en wachtwoord in.";

            return;
        }

        status.textContent =
            "⏳ Account maken...";

        try {

            await createUserWithEmailAndPassword(
                auth,
                email,
                wachtwoord
            );

            status.textContent =
                "✅ Account aangemaakt!";

            window.location.href =
                "alle-strips.html";

        } catch (fout) {

            console.error(
                "Account fout:",
                fout
            );

            if (
                fout.code ===
                "auth/email-already-in-use"
            ) {

                status.textContent =
                    "❌ Dit e-mailadres bestaat al.";

            } else if (
                fout.code ===
                "auth/weak-password"
            ) {

                status.textContent =
                    "❌ Het wachtwoord is te zwak.";

            } else {

                status.textContent =
                    "❌ Account kon niet worden aangemaakt.";

            }

        }

    }
);


// WACHTWOORD VERGETEN
wachtwoordVergeten.addEventListener(
    "click",
    async () => {

        const email =
            document.getElementById("email")
                .value
                .trim();

        if (!email) {

            status.textContent =
                "❌ Vul eerst je e-mailadres in.";

            return;
        }

        status.textContent =
            "⏳ Resetmail versturen...";

        try {

            await sendPasswordResetEmail(
                auth,
                email
            );

            status.textContent =
                "✅ Resetmail verstuurd! Controleer je e-mail.";

        } catch (fout) {

            console.error(
                "Wachtwoord reset fout:",
                fout
            );

            status.textContent =
                "❌ Er kon geen resetmail worden verstuurd.";

        }

    }
);
