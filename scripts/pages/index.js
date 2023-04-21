async function getPhotographers() {

  // Récupère les données des photographes à partir du json
  // Retourne une promesse qui se résout et stocke les données dans 'data'
  const response = await fetch('/data/photographers.json');
  const data = await response.json();
  console.log(data);
  return data;
}

// Crée et affiche les cartes des photographes en utilisant les données récupérées
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  // Boucle sur les photographes et crée un article pour chacun d'eux en utilisant photographerFactory
  for (const photographer of photographers) {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  }

  
}

async function initIndex() {
  // Récupère les données des photographes et les passe à displayData
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

initIndex();