//Thibault Delgrande 2021
//Script de la page des SAE


let activeSae = (new URLSearchParams(location.search)).get("sae");
let semester = activeSae[0];


//Change le boutton qui s'affiche comme actif
function flipButtons()
{
    document.querySelectorAll(".boutons button").forEach(e =>
    {
        if (e.dataset.sae === activeSae)
        {
            e.classList.add("active");
        }
        else
        {
            e.classList.remove("active");
        }
    });

    showSae();
}

//Affiche la saé active
function showSae()
{
    document.title = "Semestre 1 : SAÉ" + activeSae;
    fetch(`data/S${semester}.json`).then(async d=> {
        const json = await d.json();
        let lasae = json["sae"].find(sae => {
            return sae.number == activeSae;
        });

        document.querySelector(".content_sae").innerHTML = `    <h3>SAÉ${activeSae} - ${lasae["nom"]}</h3>
                                                                <h4>UE ${lasae["competence"]}</h4>
                                                                <div class = "pas_titre">
                                                                    <div>
                                                                        <img src = "img/${lasae["nom_image"]}" alt = "SAÉ${activeSae} ${lasae["nom"]}">
                                                                        <div>
                                                                            <p>${lasae["description"]}</p>
                                                                            <p>${lasae["contenu"]}</p>
                                                                            <div class = "liens">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <table class = "latable">
                                                                    </table>
                                                                    <h4>Ressources impliquées</h4>
                                                                    <div class = "ressources">
                                                                    </div>
                                                                </div>`;
        liste_liens = ``;
        lasae["liens"].forEach(function (e)
        {
            liste_liens += `<a href = "${e["lien"]}" class = "livrables">${e["nom"]}`;
        });
        document.querySelector(".liens").innerHTML = liste_liens;

        let liste_ac = `<tr>
                            <th>Aprentissage critique</th>
                            <th>Description</th>
                            <th>Validation</th>
                        </tr>`;
        fetch(`data/ac.json`).then(async d=> {
                const acdata = await d.json();
                lasae["ac"].forEach(function (e)
                {
                    let ac = acdata["ac"].find(ac => {
                        return ac.numero == e});
                    let char_valide = '';
                    if (ac["valider"])
                    {
                        char_valide = '🗹';
                    }
                    else
                    {
                        char_valide = '☒';
                    }
                    liste_ac += `   <tr>
                                        <td>AC${e}</td>
                                        <td>${ac["intitule"]}</td>
                                        <td>${char_valide}</td>
                                    </tr>`;
                });
                document.querySelector(".latable").innerHTML = liste_ac;
        });

        let liste_ressources = ``;
        fetch(`data/ressources.json`).then(async d=> {
            const ressourcesdata = await d.json();
            lasae["ressources"].forEach(function (e)
            {
                let ressource = ressourcesdata[`S${semester}`].find(ressources => {
                    return ressources.numero == e});
                liste_ressources += `<p>R${e} : ${ressource["nom"]} avec ${ressource["professeurs"]}</p>`;
            });
            document.querySelector(".ressources").innerHTML = liste_ressources;
        });

    });
}


//Affichage des boutons de SAÉ
window.addEventListener("DOMContentLoaded", () => //Pour afficher après le chargement de la page
{
    let liste_sae = ``;
    fetch(`data/S${semester}.json`).then(async d => { 
        const json = await d.json();
        json["sae"].forEach(function (e) 
        {
            liste_sae += `<button class = "bouton" data-sae = "${e["number"]}">SAÉ${e["number"]}</button>`
        });
        document.querySelector(".boutons").innerHTML = liste_sae;
        document.querySelectorAll(".boutons button").forEach(e => {
            e.addEventListener("click", e => {
                activeSae = e.target.dataset.sae;
                flipButtons();
            });
        })
        flipButtons();
    }, e => {
        console.warn(e);
    });
});