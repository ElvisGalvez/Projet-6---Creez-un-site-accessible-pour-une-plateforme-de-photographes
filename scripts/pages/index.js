/*async function getPhotographers() {
    // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet, 
    // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".
    let photographers = [
        {
            "name": "Ma data test",
            "id": 1,
            "city": "Paris",
            "country": "France",
            "tagline": "Ceci est ma data test",
            "price": 400,
            "portrait": "account.png"
        },
        {
            "name": "Autre data test",
            "id": 2,
            "city": "Londres",
            "country": "UK",
            "tagline": "Ceci est ma data test 2",
            "price": 500,
            "portrait": "account.png"
        },
    ]
    // et bien retourner le tableau photographers seulement une fois récupéré
    return ({
        photographers: [...photographers, ...photographers, ...photographers]})
}
*/



async function getPhotographers() {

    // Récupère les données des photographes
    // Retourne une promesse qui se résout et stocke les données dans 'data'
    const response = await fetch('/data/photographers.json');
    const data = await response.json();
    console.log(data);
    return data;
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");
  
    // Boucle sur les photographes et crée un article pour chacun d'eux
    for (const photographer of photographers) {
      const photographerModel = photographerFactory(photographer);
      const userCardDOM = photographerModel.getUserCardDOM();
      photographersSection.appendChild(userCardDOM);
    }
  }
  
  async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
  }
  
  init();

