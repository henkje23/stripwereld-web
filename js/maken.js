import { database, auth } from "./firebase-config.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


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


let gebruiker = null;

let paginaBestanden = [];



onAuthStateChanged(
    auth,
    (ingelogdeGebruiker) => {

        gebruiker =
            ingelogdeGebruiker;

    }
);



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



function toonPaginaPreviews() {

    paginaPreviews.innerHTML = "";


    paginaBestanden.forEach(
        (bestand, index) => {

            const kaart =
                document.createElement("div");


            kaart.className =
                "strip-kaart";


            const afbeelding =
                document.createElement("img");


            afbeelding.src =
                URL.createObjectURL(
                    bestand
                );


            afbeelding.style.maxWidth =
                "200px";


            const nummer =
                document.createElement("p");


            nummer.textContent =
                `Pagina ${index + 1}`;


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



async function uploadBestand(bestand) {

    const formulier =
        new FormData();


    formulier.append(
        "file",
        bestand
    );


    const antwoord =
        await fetch(
            "http://localhost:5000/upload",
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



form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!gebruiker) {

            status.textContent =
                "❌ Je moet ingelogd zijn.";

            return;

        }


        const titel =
            titelInput.value.trim();


        const cover =
            coverInput.files[0];


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


        publiceerKnop.disabled =
            true;


        try {

            status.textContent =
                "⏳ Cover uploaden...";


            const coverUrl =
                await uploadBestand(
                    cover
                );


            const afbeeldingen =
                [];


            for (
                let i = 0;
                i < paginaBestanden.length;
                i++
            ) {

                status.textContent =
                    `⏳ Pagina ${i + 1} van ${paginaBestanden.length} uploaden...`;


                const url =
                    await uploadBestand(
                        paginaBestanden[i]
                    );


                afbeeldingen.push(
                    url
                );

            }


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

                    titel: titel,

                    cover: coverUrl,

                    afbeeldingen:
                        afbeeldingen,

                    makerUid:
                        gebruiker.uid

                }
            );


            status.textContent =
                "✅ Strip gepubliceerd!";


            form.reset();


            coverPreview.innerHTML =
                "";

            paginaPreviews.innerHTML =
                "";

            paginaBestanden =
                [];


            setTimeout(
                () => {

                    window.location.href =
                        `lezen.html?id=${encodeURIComponent(stripId)}`;

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