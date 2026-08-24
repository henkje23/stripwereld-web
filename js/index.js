import { database } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


const lijst = document.getElementById("populaire-strips");


async function laadPopulaireStrips() {

    try {

        const snapshot = await get(
            ref(database, "strips")
        );


        if (!snapshot.exists()) {

            lijst.innerHTML = `
                <div class="geen-strips">
                    <h3>📚 Nog geen strips</h3>
                    <p>Er zijn nog geen strips beschikbaar.</p>
                </div>
            `;

            return;
        }


        const strips = Object.entries(snapshot.val());


        const stripsMetLikes = await Promise.all(

            strips.map(
                async ([id, strip]) => {

                    const likesSnapshot = await get(
                        ref(database, `strips/${id}/likes`)
                    );


                    const likesAantal =
                        likesSnapshot.exists()
                            ? likesSnapshot.numChildren()
                            : 0;


                    return {
                        id,
                        ...strip,
                        likesAantal
                    };

                }
            )

        );


        const populaireStrips =
            stripsMetLikes
                .sort(
                    (a, b) =>
                        b.likesAantal - a.likesAantal
                )
                .slice(0, 2);


        lijst.innerHTML = "";


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

                        <p class="likes">
                            ❤️ ${strip.likesAantal}
                            ${strip.likesAantal === 1 ? "like" : "likes"}
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


laadPopulaireStrips();
