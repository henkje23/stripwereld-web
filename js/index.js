import { database } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


const lijst = document.getElementById("populaire-strips");


async function laadPopulaireStrips() {

    try {

        // Alle strips ophalen
        const snapshot = await get(
            ref(database, "strips")
        );


        // Geen strips gevonden
        if (!snapshot.exists()) {

            lijst.innerHTML = `
                <div class="geen-strips">
                    <h3>📚 Nog geen strips</h3>
                    <p>Er zijn nog geen strips beschikbaar.</p>
                </div>
            `;

            return;
        }


        // Alle strips omzetten naar een array
        const strips = Object.entries(
            snapshot.val()
        );


        // Voor iedere strip het aantal likes ophalen
        const stripsMetLikes = await Promise.all(

            strips.map(
                async ([id, strip]) => {

                    const likesSnapshot = await get(
                        ref(database, `strips/${id}/likes`)
                    );


                    // Aantal likes rechtstreeks uit Firebase tellen
                    const likesAantal =
                        likesSnapshot.exists()
                            ? Object.keys(
                                likesSnapshot.val()
                            ).length
                            : 0;


                    console.log(
                        `${strip.titel}: ${likesAantal} likes`
                    );


                    return {
                        id: id,
                        ...strip,
                        likesAantal: likesAantal
                    };

                }
            )

        );


        // Sorteren van meeste naar minste likes
        stripsMetLikes.sort(
            (a, b) =>
                b.likesAantal - a.likesAantal
        );


        // Alleen de 2 populairste strips
        const populaireStrips =
            stripsMetLikes.slice(0, 2);


        // Oude inhoud verwijderen
        lijst.innerHTML = "";


        // Populaire strips tonen
        populaireStrips.forEach(
            (strip, index) => {

                const kaart =
                    document.createElement("article");


                kaart.className =
                    "populaire-kaart";


                kaart.innerHTML = `

                    <div class="populair-nummer">
                        #${index + 1}
                    </div>


                    <img
                        src="${strip.cover || ""}"
                        alt="Cover van ${strip.titel || "strip"}"
                        class="populaire-cover"
                    >


                    <div class="populaire-info">

                        <span class="populair-label">
                            🔥 Populair
                        </span>


                        <h3>
                            ${strip.titel || "Zonder titel"}
                        </h3>


                    


                        <a
                            class="knop"
                            href="pages/lezen.html?id=${encodeURIComponent(strip.id)}"
                        >
                            📖 Lezen
                        </a>

                    </div>

                `;


                lijst.appendChild(kaart);

            }
        );


    } catch (fout) {

        console.error(
            "Firebase fout:",
            fout
        );


        lijst.innerHTML = `
            <div class="geen-strips">

                <h3>⚠️ Oeps!</h3>

                <p>
                    De populaire strips konden niet geladen worden.
                </p>

            </div>
        `;

    }

}


// Starten
laadPopulaireStrips();
