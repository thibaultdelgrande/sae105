//Thibault Delgrande 2021
//Script de la page principale

let activeSemester = '1';
let maxSemester = 1;


//Change le bouton qui s'affiche comme actif
function flipButtons()
{
    document.querySelectorAll(".boutons button").forEach(e =>
    {
        if (e.dataset.semester === activeSemester)
        {
            e.classList.add("active");
        }
        else
        {
            e.classList.remove("active");
        }
    });

    showSemester();
}

//Affiche les SAÉ en fonction du semestre
function showSemester() {
    if (activeSemester > 0)
    {
        document.title = "Portfolio : Semestre " + activeSemester;
        if (activeSemester>maxSemester)
        {
            document.querySelector(".content").innerHTML = `<div class = "centrer"><p class = "non-dispo">Semestre non-disponible</p></div>`;
        }
        else
        {
            let liste_sae = ``;
            fetch(`data/S${activeSemester}.json`).then(async d => { 
                const json = await d.json();
                json["sae"].forEach(function (e) {
                    liste_sae += `<a href = "sae.html?sae=${e["number"]}" class = "sae">
                                        <div class = "texte">
                                            <h2>
                                                SAÉ${e["number"]} - ${e["nom"]}
                                            </h2>
                                            <p>
                                                ${e["description"]}
                                            </p>
                                            <p>
                                                ${e["contenu_court"]}
                                            </p>
                                        </div>
                                        <img src = "img/${e["nom_image"]}" alt = "${e["nom"]}" >
                                    </a>`;
                });
                document.querySelector(".content").innerHTML = liste_sae;
            }, e => {
                console.warn(e);
            })
        }
    }
}


window.addEventListener("DOMContentLoaded", () => //Pour afficher après le chargement de la page
{
    document.querySelectorAll(".boutons button").forEach(e => {
        e.addEventListener("click", e => {
            activeSemester = e.target.dataset.semester;
            flipButtons();
        });
    })
    flipButtons();
});