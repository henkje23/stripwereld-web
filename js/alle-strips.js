import { database, auth } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";



const lijst =
document.getElementById("strip-lijst");



async function laadStrips(){


    try {


        const snapshot =
        await get(
            ref(database, "strips")
        );



        if(!snapshot.exists()){


            lijst.innerHTML =
            `
            <p>
            Nog geen strips gevonden.
            </p>
            `;


            return;

        }



        lijst.innerHTML = "";



        const strips =
        snapshot.val();



        Object.entries(strips)
        .reverse()
        .forEach(
            ([id, strip]) => {



            const kaart =
            document.createElement("div");


            kaart.className =
            "strip-kaart";



            kaart.innerHTML = `

                <img 
                src="${strip.cover || ''}"
                alt="Cover">


                <h2>
                ${strip.titel || "Zonder titel"}
                </h2>


                <p>
                ❤️ ${
                    strip.likes
                    ? Object.keys(strip.likes).length
                    : 0
                }
                likes
                </p>


                <a class="knop"
                href="lezen.html?id=${id}">
                📖 Lezen
                </a>

            `;



            lijst.appendChild(kaart);



        });



    }
    catch(fout){


        console.error(
            "Firebase fout:",
            fout
        );


        lijst.innerHTML =
        `
        <p>
        ❌ Strips laden mislukt.
        </p>
        `;


    }


}



onAuthStateChanged(
    auth,
    (gebruiker) => {

        if (!gebruiker) {

            window.location.href =
                "login.html";

            return;
        }

        laadStrips();

    }
);