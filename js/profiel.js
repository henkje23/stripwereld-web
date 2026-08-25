import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// ========================================
// ELEMENTEN
// ========================================

const profielEmail =
    document.getElementById("profiel-email");

const accountStatus =
    document.getElementById("account-status");

const uitloggenKnop =
    document.getElementById("uitloggen-knop");


// ========================================
// ACCOUNT CONTROLEREN
// ========================================

onAuthStateChanged(
    auth,
    (gebruiker) => {

        if (!gebruiker) {

            window.location.href =
                "inloggen.html";

            return;
        }


        const email =
            gebruiker.email ||
            "Ingelogde gebruiker";


        profielEmail.textContent =
            email;

        accountStatus.textContent =
            email;

    }
);


// ========================================
// UITLOGGEN
// ========================================

uitloggenKnop.addEventListener(
    "click",
    async () => {

        try {

            uitloggenKnop.disabled =
                true;

            uitloggenKnop.textContent =
                "⏳ Uitloggen...";


            await signOut(auth);


            window.location.href =
                "inloggen.html";


        } catch (fout) {

            console.error(
                "Uitloggen mislukt:",
                fout
            );


            alert(
                "Uitloggen mislukt. Probeer opnieuw."
            );


            uitloggenKnop.disabled =
                false;

            uitloggenKnop.textContent =
                "🚪 Uitloggen";

        }

    }
);
