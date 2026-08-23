import { database } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


const zoekveld =
    document.getElementById("zoekveld");

const resultaten =
    document.getElementById("zoek-resultaten");


let strips = {};



async function laadStrips() {

    try {

        const snapshot =
            await get(
                ref(database, "strips")
            );


        if (snapshot.exists()) {

            strips =
                snapshot.val();

        } else {

            strips = {};

        }


    } catch (fout) {

        console.error(
            "Firebase zoekfout:",
            fout
        );


        resultaten.innerHTML =
            "<p>❌ Strips konden niet geladen worden.</p>";

    }

}



function toonResultaten(zoekterm) {

    const term =
        zoekterm
            .trim()
            .toLowerCase();


    if (!term) {

        resultaten.innerHTML =
            "<p>Vul hierboven een zoekterm in.</p>";

        return;

    }


    const gevonden =
        Object.entries(strips)
            .filter(
                ([, strip]) => {

                    const titel =
                        String(
                            strip.titel || ""
                        ).toLowerCase();

                    return titel.includes(term);

                }
            );


    if (!gevonden.length) {

        resultaten.innerHTML =
            "<p>Geen strips gevonden.</p>";

        return;

    }


    resultaten.innerHTML = "";


    gevonden.forEach(
        ([id, strip]) => {

            const kaart =
                document.createElement("div");


            kaart.className =
                "strip-kaart";


            kaart.innerHTML = `

                <img
                    src="${strip.cover || ""}"
                    alt="Cover"
                >

                <h2>
                    ${escapeHtml(
                        strip.titel ||
                        "Zonder titel"
                    )}
                </h2>

                <p>
                    ❤️ ${
                        strip.likes
                            ? Object.keys(
                                strip.likes
                            ).length
                            : 0
                    } likes
                </p>

                <a
                    class="knop"
                    href="lezen.html?id=${encodeURIComponent(id)}"
                >
                    📖 Lezen
                </a>

            `;


            resultaten.appendChild(
                kaart
            );

        }
    );

}



function escapeHtml(tekst) {

    const element =
        document.createElement("div");

    element.textContent =
        tekst;

    return element.innerHTML;

}



zoekveld.addEventListener(
    "input",
    () => {

        toonResultaten(
            zoekveld.value
        );

    }
);



laadStrips();