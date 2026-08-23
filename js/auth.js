import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


onAuthStateChanged(
    auth,
    (gebruiker) => {

        if (gebruiker) {

            console.log(
                "Ingelogd:",
                gebruiker.uid
            );

        } else {

            console.log(
                "Niet ingelogd"
            );

        }

    }
);