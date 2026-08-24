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
// VERTALINGEN
// ========================================

const vertalingen = {

    nl: {
        home: "Home",
        alleStrips: "Alle strips",
        zoeken: "Zoeken",
        profielNav: "👤 Profiel",

        badge: "👤 Mijn profiel",
        profielTitel: "Profiel",

        accountLabel: "ACCOUNT",
        accountTitel: "Mijn account",
        accountUitleg:
            "Beheer je StripWereld-account.",

        account: "👤 Account",

        uitloggen: "🚪 Uitloggen",

        appTitel: "📱 StripWereld-app",

        appUitleg:
            "Download de nieuwste versie van de StripWereld-app.",

        download: "📥 Download app (APK)",

        contactTitel: "💬 Contact",

        contactUitleg:
            "Heb je een vraag, idee of iets anders? Neem contact met ons op via WhatsApp.",

        vraag: "❓ Ik heb een vraag",

        idee: "💡 Ik heb een idee",

        anders: "📝 Anders",

        taalTitel: "🌍 Taal",

        taalUitleg:
            "Kies de taal van de StripWereld-interface. De strips zelf worden niet vertaald.",

        footer: "© 2026 StripWereld",

        accountLaden:
            "Accountgegevens laden..."
    },


    en: {
        home: "Home",
        alleStrips: "All comics",
        zoeken: "Search",
        profielNav: "👤 Profile",

        badge: "👤 My profile",
        profielTitel: "Profile",

        accountLabel: "ACCOUNT",
        accountTitel: "My account",
        accountUitleg:
            "Manage your StripWereld account.",

        account: "👤 Account",

        uitloggen: "🚪 Log out",

        appTitel: "📱 StripWereld app",

        appUitleg:
            "Download the latest version of the StripWereld app.",

        download: "📥 Download app (APK)",

        contactTitel: "💬 Contact",

        contactUitleg:
            "Do you have a question, idea or something else? Contact us through WhatsApp.",

        vraag: "❓ I have a question",

        idee: "💡 I have an idea",

        anders: "📝 Other",

        taalTitel: "🌍 Language",

        taalUitleg:
            "Choose the language of the StripWereld interface. The comics themselves are not translated.",

        footer: "© 2026 StripWereld",

        accountLaden:
            "Loading account information..."
    },


    fr: {
        home: "Accueil",
        alleStrips: "Toutes les BD",
        zoeken: "Rechercher",
        profielNav: "👤 Profil",

        badge: "👤 Mon profil",
        profielTitel: "Profil",

        accountLabel: "COMPTE",
        accountTitel: "Mon compte",
        accountUitleg:
            "Gérez votre compte StripWereld.",

        account: "👤 Compte",

        uitloggen: "🚪 Se déconnecter",

        appTitel:
            "📱 Application StripWereld",

        appUitleg:
            "Téléchargez la dernière version de l'application StripWereld.",

        download:
            "📥 Télécharger l'application (APK)",

        contactTitel: "💬 Contact",

        contactUitleg:
            "Vous avez une question, une idée ou autre chose ? Contactez-nous via WhatsApp.",

        vraag: "❓ J'ai une question",

        idee: "💡 J'ai une idée",

        anders: "📝 Autre",

        taalTitel: "🌍 Langue",

        taalUitleg:
            "Choisissez la langue de l'interface StripWereld. Les bandes dessinées elles-mêmes ne sont pas traduites.",

        footer: "© 2026 StripWereld",

        accountLaden:
            "Chargement des informations du compte..."
    }

};


// ========================================
// THEMA'S PER TAAL
// ========================================

const taalThemas = {

    nl: {
        primaireKleur: "#4A90E2",
        primaireHover: "#397FCF"
    },

    en: {
        primaireKleur: "#7B61C9",
        primaireHover: "#684DB4"
    },

    fr: {
        primaireKleur: "#E76F51",
        primaireHover: "#D85C3D"
    }

};


// ========================================
// TAAL INSTELLEN
// ========================================

function zetTaal(taal) {

    if (!vertalingen[taal]) {
        taal = "nl";
    }

    const teksten =
        vertalingen[taal];


    // Taal bewaren

    localStorage.setItem(
        "stripwereld-taal",
        taal
    );


    // HTML taal aanpassen

    document.documentElement.lang =
        taal;


    // ========================================
    // KLEUREN AANPASSEN
    // ========================================

    const thema =
        taalThemas[taal];


    if (
        thema &&
        window.bewaarThema
    ) {

        window.bewaarThema(
            thema
        );

    }


    // Oude taalklassen verwijderen

    document.body.classList.remove(
        "taal-nl",
        "taal-en",
        "taal-fr"
    );


    // Nieuwe taalklasse toevoegen

    document.body.classList.add(
        `taal-${taal}`
    );


    // ========================================
    // TEKSTEN VERTALEN
    // ========================================

    document
        .querySelectorAll("[data-i18n]")
        .forEach(
            (element) => {

                const sleutel =
                    element.dataset.i18n;


                if (
                    teksten[sleutel] !==
                    undefined
                ) {

                    element.textContent =
                        teksten[sleutel];

                }

            }
        );


    // ========================================
    // ACTIEVE TAAL
    // ========================================

    document
        .querySelectorAll(".taal-knop")
        .forEach(
            (knop) => {

                knop.classList.remove(
                    "actief"
                );


                if (
                    knop.dataset.taal ===
                    taal
                ) {

                    knop.classList.add(
                        "actief"
                    );

                }

            }
        );

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

                    zetTaal(
                        knop.dataset.taal
                    );

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
                "Niet ingelogd.";

            accountStatus.textContent =
                "Niet ingelogd.";

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


            // NA UITLOGGEN NAAR INLOGGEN

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


zetTaal(
    opgeslagenTaal
);
