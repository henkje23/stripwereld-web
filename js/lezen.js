import { database, auth } from "./firebase-config.js";

import {
    ref,
    get,
    set,
    remove,
    push
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const stripId =
    new URLSearchParams(location.search).get("id");

const titel =
    document.getElementById("strip-titel");

const afbeelding =
    document.getElementById("strip-afbeelding");

const paginaInfo =
    document.getElementById("pagina-info");

const vorige =
    document.getElementById("vorige-knop");

const volgende =
    document.getElementById("volgende-knop");

const likeKnop =
    document.getElementById("like-knop");

const likeAantal =
    document.getElementById("like-aantal");

const reacties =
    document.getElementById("reacties");

const reactieForm =
    document.getElementById("reactie-form");

const reactieTekst =
    document.getElementById("reactie-tekst");

const reactieStatus =
    document.getElementById("reactie-status");


let gebruiker = null;
let pagina = 0;
let afbeeldingen = [];


onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    gebruiker = user;

    await laadStrip();
    await laadLikes();
    await laadReacties();

    likeKnop.disabled = false;

});


async function laadStrip() {

    const snapshot =
        await get(
            ref(database, `strips/${stripId}`)
        );

    if (!snapshot.exists()) {

        titel.textContent =
            "Strip niet gevonden.";

        return;
    }

    const strip =
        snapshot.val();

    titel.textContent =
        strip.titel || "Zonder titel";


    if (Array.isArray(strip.afbeeldingen)) {

        afbeeldingen =
            strip.afbeeldingen;

    } else if (strip.afbeeldingen) {

        afbeeldingen =
            Object.values(strip.afbeeldingen);

    } else {

        afbeeldingen = [];

    }


    if (
        afbeeldingen.length === 0 &&
        strip.cover
    ) {
        afbeeldingen = [strip.cover];
    }


    toonPagina();

}



function toonPagina() {

    if (!afbeeldingen.length) {

        afbeelding.style.display =
            "none";

        paginaInfo.textContent =
            "Geen afbeeldingen.";

        return;
    }


    afbeelding.style.display =
        "block";

    afbeelding.src =
        afbeeldingen[pagina];

    paginaInfo.textContent =
        `Pagina ${pagina + 1} van ${afbeeldingen.length}`;

    vorige.disabled =
        pagina === 0;

    volgende.disabled =
        pagina === afbeeldingen.length - 1;

}



vorige.onclick = () => {

    if (pagina > 0) {

        pagina--;

        toonPagina();

    }

};



volgende.onclick = () => {

    if (
        pagina <
        afbeeldingen.length - 1
    ) {

        pagina++;

        toonPagina();

    }

};



async function laadLikes() {

    const likesRef =
        ref(
            database,
            `strips/${stripId}/strips/${stripId}/likes`
        );


    const snapshot =
        await get(likesRef);


    const likes =
        snapshot.exists()
            ? snapshot.val()
            : {};


    likeAantal.textContent =
        Object.keys(likes).length;


    const geliked =
        gebruiker &&
        likes[gebruiker.uid] === true;


    likeKnop.innerHTML =
        geliked
            ? `❤️ <span id="like-aantal">${Object.keys(likes).length}</span> likes`
            : `🤍 <span id="like-aantal">${Object.keys(likes).length}</span> likes`;


    likeKnop.dataset.geliked =
        geliked ? "true" : "false";

}



likeKnop.onclick = async () => {

    if (!gebruiker) {
        return;
    }


    likeKnop.disabled = true;


    const likeRef =
        ref(
            database,
            `strips/${stripId}/strips/${stripId}/likes/${gebruiker.uid}`
        );


    try {

        const snapshot =
            await get(likeRef);


        if (snapshot.exists()) {

            await remove(likeRef);

        } else {

            await set(
                likeRef,
                true
            );

        }


        await laadLikes();


    } catch (fout) {

        console.error(
            "Like fout:",
            fout
        );

    }


    likeKnop.disabled = false;

};



async function laadReacties() {

    const reactiesRef =
        ref(
            database,
            `strips/${stripId}/strips/${stripId}/reacties`
        );


    const snapshot =
        await get(reactiesRef);


    reacties.innerHTML = "";


    if (!snapshot.exists()) {

        reacties.innerHTML =
            "<p>Nog geen reacties.</p>";

        return;
    }


    const lijst =
        Object.entries(
            snapshot.val()
        );


    lijst.sort(
        ([, a], [, b]) =>
            (b.gemaaktOp || 0) -
            (a.gemaaktOp || 0)
    );


    lijst.forEach(
        ([id, reactie]) => {

            const div =
                document.createElement("div");


            div.className =
                "strip-kaart";


            const tekst =
                document.createElement("p");


            tekst.textContent =
                `💬 ${reactie.tekst || ""}`;


            div.appendChild(
                tekst
            );


            reacties.appendChild(
                div
            );

        }
    );

}



reactieForm.onsubmit =
    async (event) => {

        event.preventDefault();


        if (!gebruiker) {
            return;
        }


        const tekst =
            reactieTekst.value.trim();


        if (!tekst) {
            return;
        }


        reactieStatus.textContent =
            "⏳ Plaatsen...";


        try {

            const reactiesRef =
                ref(
                    database,
                    `strips/${stripId}/strips/${stripId}/reacties`
                );


            const nieuweRef =
                push(
                    reactiesRef
                );


            await set(
                nieuweRef,
                {
                    tekst: tekst,

                    userUid:
                        gebruiker.uid,

                    gemaaktOp:
                        Date.now()
                }
            );


            reactieTekst.value =
                "";


            reactieStatus.textContent =
                "✅ Geplaatst";


            await laadReacties();


        } catch (fout) {

            console.error(
                "Reactie fout:",
                fout
            );


            reactieStatus.textContent =
                "❌ Kon reactie niet plaatsen.";

        }

    };
