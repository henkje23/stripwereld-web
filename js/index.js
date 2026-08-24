import { database } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const lijst = document.getElementById("populaire-strips");

async function laadPopulaireStrips() {
    if (!lijst) {
        console.error("Element #populaire-strips bestaat niet.");
        return;
    }

    try {
        const snapshot = await get(ref(database, "strips"));

        if (!snapshot.exists()) {
            lijst.innerHTML = `
                <div class="geen-strips">
                    <h3>📚 Nog geen strips</h3>
                    <p>Er zijn nog geen strips beschikbaar.</p>
                </div>
            `;
            return;
        }

        const data = snapshot.val();

        const strips = Object.entries(data);

        const stripsMetLikes = await Promise.all(
            strips.map(async ([id, strip]) => {

                // Haal ALLE likes van deze strip op
                const likesRef = ref(
                    database,
                    `strips/${id}/likes`
                );

                const likesSnapshot = await get(likesRef);

                let likesAantal = 0;

                if (likesSnapshot.exists()) {
                    likesAantal = likesSnapshot.numChildren();
                }

                console.log(
                    "Strip:",
                    strip.titel,
                    "Likes:",
                    likesAantal
                );

                return {
                    id: id,
                    ...strip,
                    likesAantal: likesAantal
                };
            })
        );

        // Sorteer van meeste naar minste likes
        stripsMetLikes.sort(
            (a, b) => b.likesAantal - a.likesAantal
        );

        // Alleen de beste 2
        const populaireStrips =
            stripsMetLikes.slice(0, 2);

        lijst.innerHTML = "";

        populariseer(populaireStrips);

    } catch (fout) {
        console.error("Firebase fout:", fout);

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


function populariseer(strips) {

    strips.forEach((strip, index) => {

        const kaart =
            document.createElement("article");

        kaart.className = "populaire-kaart";

        const aantal =
            strip.likesAantal;

        const likeTekst =
            aantal === 1
                ? "like"
                : "likes";

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

                <p class="likes">
                    ❤️ ${aantal} ${likeTekst}
                </p>

                <a
                    class="knop"
                    href="pages/lezen.html?id=${encodeURIComponent(strip.id)}"
                >
                    📖 Lezen
                </a>

            </div>
        `;

        lijst.appendChild(kaart);
    });
}


laadPopulaireStrips();
