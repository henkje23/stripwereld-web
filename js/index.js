import { database } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


const lijst = document.getElementById("populaire-strips");
const heroBanner = document.querySelector(".hero");


// ========================================
// RUSTIGE STANDAARD HERO
// ========================================

function rustigeHeroKleuren() {

    if (!heroBanner) {
        return;
    }

    heroBanner.style.setProperty(
        "--hero-cover",
        "none"
    );

    heroBanner.style.setProperty(
        "--hero-kleur-1",
        "#e8f7ff"
    );

    heroBanner.style.setProperty(
        "--hero-kleur-2",
        "#ffffff"
    );

    heroBanner.style.setProperty(
        "--hero-kleur-3",
        "#fff4d6"
    );
}


// ========================================
// HERO AANPASSEN AAN POPULAIRSTE STRIP
// ========================================

function veranderHeroAanStrip(coverUrl) {

    if (!heroBanner || !coverUrl) {
        rustigeHeroKleuren();
        return;
    }


    // De cover wordt heel subtiel als achtergrond gebruikt.
    // De CSS zorgt ervoor dat hij wazig en rustig blijft.

    heroBanner.style.setProperty(
        "--hero-cover",
        `url("${coverUrl}")`
    );


    // Zachte neutrale kleuren zodat de tekst altijd leesbaar blijft.
    heroBanner.style.setProperty(
        "--hero-kleur-1",
        "#eaf7ff"
    );

    heroBanner.style.setProperty(
        "--hero-kleur-2",
        "#ffffff"
    );

    heroBanner.style.setProperty(
        "--hero-kleur-3",
        "#fff3d6"
    );
}


// ========================================
// POPULAIRE STRIPS LADEN
// ========================================

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

            rustigeHeroKleuren();

            return;
        }


        // Firebase omzetten naar array
        const strips = Object.entries(
            snapshot.val()
        );


        // Likes van iedere strip ophalen
        const stripsMetLikes = await Promise.all(

            strips.map(
                async ([id, strip]) => {

                    const likesSnapshot =
                        await get(
                            ref(
                                database,
                                `strips/${id}/likes`
                            )
                        );


                    // Likes tellen
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


        // Meeste likes eerst
        stripsMetLikes.sort(
            (a, b) =>
                b.likesAantal -
                a.likesAantal
        );


        // Alleen nummer 1 en 2 tonen
        const populaireStrips =
            stripsMetLikes.slice(0, 2);


        // ========================================
        // HERO AANPASSEN AAN #1
        // ========================================

        if (
            populaireStrips.length > 0 &&
            populaireStrips[0].cover
        ) {

            console.log(
                "Populairste strip:",
                populaireStrips[0].titel
            );

            veranderHeroAanStrip(
                populaireStrips[0].cover
            );

        } else {

            rustigeHeroKleuren();

        }


        // Oude inhoud verwijderen
        lijst.innerHTML = "";


        // ========================================
        // POPULAIRE STRIPS TONEN
        // ========================================

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


        rustigeHeroKleuren();
    }
}


// ========================================
// START
// ========================================

laadPopulaireStrips();
