import {
    auth
} from "./firebase-config.js";

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
// TAAL
// ========================================

const vertalingen = {

    nl: {
        profiel: "Profiel",
        account: "Mijn account",
        beheer: "Beheer je StripWereld-account.",
        uitloggen: "🚪 Uitloggen",
        laden: "Account laden...",
        geenAccount: "Je bent niet ingelogd.",
        vraag: "❓ Ik heb een vraag",
        idee: "💡 Ik heb een idee",
        anders: "📝 Anders",
        taal: "🌍 Taal",
        taalUitleg:
            "Kies de taal van de StripWereld-interface. De strips zelf worden niet vertaald."
    },

    en: {
        profiel: "Profile",
        account: "My account",
        beheer: "Manage your StripWereld account.",
        uitloggen: "🚪 Log out",
        laden: "Loading account...",
        geenAccount: "You are not logged in.",
        vraag: "❓ I have a question",
        idee: "💡 I have an idea",
        anders: "📝 Other",
        taal: "🌍 Language",
        taalUitleg:
            "Choose the language of the StripWereld interface. The comics themselves are not translated."
    },

    fr: {
        profiel: "Profil",
        account: "Mon compte",
        beheer: "Gérez votre compte StripWereld.",
        uitloggen: "🚪 Se déconnecter",
        laden: "Chargement du compte...",
        geenAccount: "Vous n'êtes pas connecté.",
        vraag: "❓ J'ai une question",
        idee: "💡 J'ai une idée",
        anders: "📝 Autre",
        taal: "🌍 Langue",
        taalUitleg:
            "Choisissez la langue de l'interface StripWereld. Les bandes dessinées elles-mêmes ne sont pas traduites."
    }

};


// ========================================
// TAAL INSTELLEN
// ========================================

function zetTaal(taal) {

    const vertaling =
        vertalingen[taal] ||
        vertalingen.nl;


    localStorage.setItem(
        "stripwereld-taal",
        taal
    );


    document.documentElement.lang =
        taal;


    const profielTitel =
        document.querySelector(
            ".hero h1"
        );

    if (profielTitel) {
        profielTitel.textContent =
            vertaling.profiel;
    }


    const accountTitel =
        document.querySelector(
            ".sectie-kop h2"
        );

    if (accountTitel) {
        accountTitel.textContent =
            vertaling.account;
    }


    const accountUitleg =
        document.querySelector(
            ".sectie-kop p"
        );

    if (accountUitleg) {
        accountUitleg.textContent =
            vertaling.beheer;
    }


    if (uitloggenKnop) {
        uitloggenKnop.textContent =
            vertaling.uitloggen;
    }


    const taalTitel =
        document.querySelector(
            ".strip-kaart:nth-of-type(4) h3"
        );

    if (taalTitel) {
        taalTitel.textContent =
            vertaling.taal;
    }


    const taalUitleg =
        document.querySelector(
            ".strip-kaart:nth-of-type(4) p"
        );

    if (taalUitleg) {
        taalUitleg.textContent =
            vertaling.taalUitleg;
    }


    const vraagKnop =
        document.querySelector(
            'a[href*="Ik%20heb%20een%20vraag"]'
        );

    if (vraagKnop) {
        vraagKnop.textContent =
            vertaling.vraag;
    }


    const ideeKnop =
        document.querySelector(
            'a[href*="Ik%20heb%20een%20idee"]'
        );

    if (ideeKnop) {
        ideeKnop.textContent =
            vertaling.idee;
    }


    const andersKnop =
        document.querySelector(
            'a[href="https://wa.me/32469629062?text="]'
        );

    if (andersKnop) {
        andersKnop.textContent =
            vertaling.anders;
    }
}


// ========================================
// TAALKNOPPEN
// ========================================

document
    .querySelectorAll(".taal-knop")
    .forEach(
        (knop) => {

            knop.addEventListener(
                "click",
                () => {

                    const taal =
                        knop.dataset.taal;

                    zetTaal(taal);

                }
            );

        }
    );


// ========================================
// ACCOUNT CONTROLEREN
// ========================================

onAuthStateChanged(
    auth,
    (gebruiker) => {

        if (!gebruiker) {

            profielEmail.textContent =
                "Je bent niet ingelogd.";

            accountStatus.textContent =
                "Je bent niet ingelogd.";

            return;
        }


        profielEmail.textContent =
            gebruiker.email ||
            "Ingelogde gebruiker";


        accountStatus.textContent =
            gebruiker.email ||
            "Ingelogde gebruiker";

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

            await signOut(auth);

            window.location.href =
                "../login.html";

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
        }

    }
);


// ========================================
// OPGESLAGEN TAAL LADEN
// ========================================

const opgeslagenTaal =
    localStorage.getItem(
        "stripwereld-taal"
    ) || "nl";


zetTaal(opgeslagenTaal);
