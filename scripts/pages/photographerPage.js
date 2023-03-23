

async function getPhotographerById(id) {
  const response = await fetch('/data/photographers.json');
  const data = await response.json();
  const photographer = data.photographers.find(p => p.id === id);
  return photographer;
}

function getPhotographerIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


async function init() {
    const photographerId = getPhotographerIdFromUrl();
  
    if (photographerId) {
      console.log(`Photographer ID: ${photographerId}`);
      const photographer = await getPhotographerById(photographerId);
      console.log(photographer);
      // Afficher les données du photographe sur la page photographe
    } else {
      console.log('No photographer ID found in URL');
    }
  }
  
  init();