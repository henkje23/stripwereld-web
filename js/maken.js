import { database, auth } from "./firebase-config.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// ===============================
// HTML ELEMENTEN
// ===============================

const form =
    document.getElementById("strip-form");

const titelInput =
    document.getElementById("titel");

const coverInput =
    document.getElementById("cover");

const paginaInput =
    document.getElementById("pagina-bestanden");

const coverPreview =
    document.getElementById("cover-preview");

const paginaPreviews =
    document.getElementById("pagina-previews");

const status =
    document.getElementById("maak-status");

const publiceerKnop =
    document.getElementById("publiceer-knop");


// ===============================
// VARIABELEN
// ===============================

let gebruiker = null;

let paginaBestanden = [];


// ===============================
// FIREBASE LOGIN CONTROLEREN
// ===============================

onAuthStateChanged(
    auth,
    (ingelogdeGebruiker) => {

        gebruiker =
            ingelogdeGebruiker;

        if (gebruiker) {

            console.log(
                "Ingelogd als:",
                gebruiker.email
            );

        } else {

            console.log(
                "Niet ingelogd."
            );

        }

    }
);


// ===============================
// COVER VOORVERTONEN
// ===============================

coverInput.addEventListener(
    "change",
    () => {

        coverPreview.innerHTML = "";

        const bestand =
            coverInput.files[0];

        if (!bestand) {
            return;
        }

        const afbeelding =
            document.createElement("img");

        afbeelding.src =
            URL.createObjectURL(
                bestand
            );

        afbeelding.style.maxWidth =
            "250px";

        afbeelding.style.borderRadius =
            "10px";

        coverPreview.appendChild(
            afbeelding
        );

    }
);


// ===============================
// PAGINA'S KIEZEN
// ===============================

paginaInput.addEventListener(
    "change",
    () => {

        paginaBestanden =
            Array.from(
                paginaInput.files
            );

        toonPaginaPreviews();

    }
);


// ===============================
// PAGINA'S VOORVERtonen
// ===============================

function toonPaginaPreviews() {

    paginaPreviews.innerHTML = "";

    paginaBestanden.forEach(
        (bestand, index) => {

            const kaart =
                document.createElement("div");

            kaart.className =
                "strip-kaart";


            const nummer =
                document.createElement("p");

            nummer.textContent =
                `Pagina ${index + 1}`;


            const afbeelding =
                document.createElement("img");

            afbeelding.src =
                URL.createObjectURL(
                    bestand
                );

            afbeelding.style.maxWidth =
                "200px";

            afbeelding.style.maxHeight =
                "300px";

            afbeelding.style.borderRadius =
                "10px";


            kaart.appendChild(
                nummer
            );

            kaart.appendChild(
                afbeelding
            );


            paginaPreviews.appendChild(
                kaart
            );

        }
    );

}


// ===============================
// BESTAND UPLOADEN
// ===============================
//
// De website stuurt het bestand naar
// jouw Cloudflare Worker.
//
// De Worker handelt de upload verder af.
// ===============================

async function uploadBestand(bestand) {

    const formulier =
        new FormData();


    formulier.append(
        "file",
        bestand
    );


    const antwoord =
        await fetch(
            "https://stripwereld-uploader.hendrikbrouns0.workers.dev/",
            {
                method: "POST",
                body: formulier
            }
        );


    if (!antwoord.ok) {

        throw new Error(
            `Upload mislukt: HTTP ${antwoord.status}`
        );

    }


    const data =
        await antwoord.json();


    if (
        !data.success ||
        !data.url
    ) {

        throw new Error(
            data.error ||
            "Geen afbeeldingslink ontvangen."
        );

    }


    return data.url;

}


// ===============================
// STRIP PUBLICEREN
// ===============================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // -------------------------------
        // LOGIN CONTROLEREN
        // -------------------------------

        if (!gebruiker) {

            status.textContent =
                "❌ Je moet ingelogd zijn.";

            return;

        }


        // -------------------------------
        // GEGEVENS OPHALEN
        // -------------------------------

        const titel =
            titelInput.value.trim();


        const cover =
            coverInput.files[0];


        // -------------------------------
        // CONTROLEREN
        // -------------------------------

        if (!titel) {

            status.textContent =
                "❌ Vul een titel in.";

            return;

        }


        if (!cover) {

            status.textContent =
                "❌ Kies een cover.";

            return;

        }


        if (!paginaBestanden.length) {

            status.textContent =
                "❌ Kies minstens één pagina.";

            return;

        }


        // -------------------------------
        // KNOP UITSCHAKELEN
        // -------------------------------

        publiceerKnop.disabled =
            true;


        try {

            // =================================
            // ALLE BESTANDEN UPLOADEN
            // =================================

            status.textContent =
                "⏳ Afbeeldingen uploaden...";


            // Cover + alle pagina's
            // worden tegelijk geüpload.

            const bestanden =
                [
                    cover,
                    ...paginaBestanden
                ];


            const uploadResultaten =
                await Promise.all(
                    bestanden.map(
                        (bestand) =>
                            uploadBestand(
                                bestand
                            )
                    )
                );


            // Eerste resultaat = cover
            const coverUrl =
                uploadResultaten[0];


            // De rest = pagina's
            const afbeeldingen =
                uploadResultaten.slice(1);


            // =================================
            // OPSLAAN IN FIREBASE
            // =================================

            status.textContent =
                "⏳ Strip opslaan in Firebase...";


            const stripRef =
                push(
                    ref(
                        database,
                        "strips"
                    )
                );


            const stripId =
                stripRef.key;


            await set(
                stripRef,
                {

                    titel:
                        titel,

                    cover:
                        coverUrl,

                    afbeeldingen:
                        afbeeldingen,

                    makerUid:
                        gebruiker.uid

                }
            );


            // =================================
            // GELUKT
            // =================================

            status.textContent =
                "✅ Strip gepubliceerd!";


            // Formulier leegmaken

            form.reset();


            coverPreview.innerHTML =
                "";


            paginaPreviews.innerHTML =
                "";


            paginaBestanden =
                [];


            // =================================
            // NA 1 SECOND NAAR DE STRIP
            // =================================

            setTimeout(
                () => {

                    window.location.href =
                        `lezen.html?id=${encodeURIComponent(
                            stripId
                        )}`;

                },
                1000
            );


        } catch (fout) {

            console.error(
                "Publiceerfout:",
                fout
            );


            status.textContent =
                `❌ ${fout.message}`;


        } finally {

            publiceerKnop.disabled =
                false;

        }

    }
);
