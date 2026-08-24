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

    const root = document.documentElement;

    root.style.setProperty(
        "--primaire-kleur",
        gekozen.primaireKleur
    );

    root.style.setProperty(
        "--primaire-hover",
        gekozen.primaireHover
    );

    root.style.setProperty(
        "--achtergrond",
        gekozen.achtergrond
    );

    root.style.setProperty(
        "--kaart",
        gekozen.kaart
    );

    root.style.setProperty(
        "--tekst",
        gekozen.tekst
    );

    root.style.setProperty(
        "--subtekst",
        gekozen.subtekst
    );

    root.style.setProperty(
        "--header",
        gekozen.header
    );

    root.style.setProperty(
        "--header-hover",
        gekozen.headerHover
    );

    root.style.setProperty(
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

    const compleetThema = {
        ...standaardThema,
        ...thema
    };

    localStorage.setItem(
        "stripwereldThema",
        JSON.stringify(compleetThema)
    );

    pasThemaToe(
        compleetThema
    );
}


// ============================================
// HUIDIG THEMA OPHALEN
// ============================================

function haalThemaOp() {

    try {

        const opgeslagen =
            localStorage.getItem(
                "stripwereldThema"
            );

        if (opgeslagen) {

            return {
                ...standaardThema,
                ...JSON.parse(opgeslagen)
            };

        }

    } catch (fout) {

        console.error(
            "Thema kon niet opgehaald worden:",
            fout
        );
    }

    return {
        ...standaardThema
    };
}


// ============================================
// DIRECT BIJ HET LADEN TOEPASSEN
// ============================================

laadThema();


// ============================================
// BESCHIKBAAR MAKEN VOOR PROFIEL.JS
// ============================================

window.pasThemaToe = pasThemaToe;
window.bewaarThema = bewaarThema;
window.haalThemaOp = haalThemaOp;
window.standaardThema = standaardThema;
