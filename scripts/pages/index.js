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