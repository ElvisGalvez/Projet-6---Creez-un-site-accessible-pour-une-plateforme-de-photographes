async function getPhotographerById(id) {
  const response = await fetch('/data/photographers.json');
  const data = await response.json();
  const photographer = data.photographers.find(p => p.id === parseInt(id, 10));
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

    const photographerInfo = document.querySelector('.photographer_info');

    photographerInfo.innerHTML = `
      <h1 class="photographer_name">${photographer.name}</h1>
      <p class="photographer_location">${photographer.city}, ${photographer.country}</p>
      <p class="photographer_tagline">${photographer.tagline}</p>
    `;

    const photographerPortrait = document.createElement("img");
    photographerPortrait.className = "photographer_portrait";
    photographerPortrait.src = `assets/photographers/${photographer.portrait}`;
    photographerPortrait.alt = `Photo de ${photographer.name}`;
    photographerInfo.appendChild(photographerPortrait);
  } else {
    console.log('No photographer ID found in URL');
  }
}

init();