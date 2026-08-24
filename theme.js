// ============================================
// STRIPWERELD THEMA SYSTEEM
// ============================================

const standaardThema = {
    primaireKleur: "#4A90E2",
    primaireHover: "#397FCF",
    achtergrond: "#F4F7FB",
    kaart: "#FFFFFF",
    tekst: "#252A30",
    subtekst: "#68727D",
    header: "#252A30",
    headerHover: "#3A424B",
    rand: "#D5E2EF"
};


// ============================================
// THEMA TOEPASSEN
// ============================================

function pasThemaToe(thema) {

    const gekozen = {
        ...standaardThema,
        ...thema
    };


    document.documentElement.style.setProperty(
        "--primaire-kleur",
        gekozen.primaireKleur
    );


    document.documentElement.style.setProperty(
        "--primaire-hover",
        gekozen.primaireHover
    );


    document.documentElement.style.setProperty(
        "--achtergrond",
        gekozen.achtergrond
    );


    document.documentElement.style.setProperty(
        "--kaart",
        gekozen.kaart
    );


    document.documentElement.style.setProperty(
        "--tekst",
        gekozen.tekst
    );


    document.documentElement.style.setProperty(
        "--subtekst",
        gekozen.subtekst
    );


    document.documentElement.style.setProperty(
        "--header",
        gekozen.header
    );


    document.documentElement.style.setProperty(
        "--header-hover",
        gekozen.headerHover
    );


    document.documentElement.style.setProperty(
        "--rand",
        gekozen.rand
    );
}


// ============================================
// THEMA LADEN
// ============================================

function laadThema() {

    try {

        const opgeslagen =
            localStorage.getItem(
                "stripwereldThema"
            );


        if (opgeslagen) {

            pasThemaToe(
                JSON.parse(opgeslagen)
            );

        } else {

            pasThemaToe(
                standaardThema
            );

        }

    } catch (fout) {

        console.error(
            "Thema kon niet geladen worden:",
            fout
        );

        pasThemaToe(
            standaardThema
        );

    }

}


// ============================================
// THEMA OPSLAAN
// ============================================

function bewaarThema(thema) {

    localStorage.setItem(
        "stripwereldThema",
        JSON.stringify(thema)
    );


    pasThemaToe(thema);
}


// Meteen laden
laadThema();


// Beschikbaar maken voor profiel.js
window.pasThemaToe = pasThemaToe;
window.bewaarThema = bewaarThema;
window.standaardThema = standaardThema;
