import { mediaFactory, updateTotalLikes } from '/scripts/factories/mediaFactory.js';
import { setPhotographerNameInModal } from '/scripts/utils/contactForm.js';

//récupère les données des photographes et de leurs médias à partir du JSON
async function getData() {
  const response = await fetch('/data/photographers.json');
  const data = await response.json();
  return data;
}

//récupère les données et retourne un objet contenant le photographe et ses médias
async function getPhotographerById(id) {
  const data = await getData();
  const photographer = data.photographers.find(p => p.id === parseInt(id, 10));
  const media = data.media.filter(m => m.photographerId === parseInt(id, 10));
  return { photographer, media };
}

//récupère l'ID du photographe à partir de l'URL de la page photographer.html
function getPhotographerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

//appelle la fonction de tri de sort.js
function initSort() {
  import('/scripts/utils/sort.js')
    .then(({ applySort }) => {
      applySort();
    })
    .catch((error) => {
      console.error('Error importing applySort:', error);
    });
}

//mets à jour la page photographer.html avec les données du photographe et de ses médias
async function initPhotographer() {
  const photographerId = getPhotographerIdFromUrl();
  if (photographerId) {
    console.log(`Photographer ID: ${photographerId}`);
    const data = await getData();
    const { photographer, media } = await getPhotographerById(photographerId);
    console.log(photographer);
    const photographerInfo = document.querySelector('.photographer_info');
    const photographerImg = document.querySelector('.photographer_img');
    const likeCount = document.querySelector('#like_count');
    const price = document.querySelector('#price');

    let photographerName = document.querySelector('.photographer_name');
    setPhotographerNameInModal(photographer.name);
    photographerInfo.innerHTML = `
    <h1 class="photographer_name">${photographer.name}</h1>
    <p class="photographer_location">${photographer.city}, ${photographer.country}</p>
    <p class="photographer_tagline">${photographer.tagline}</p>
`;
    photographerName = document.querySelector('.photographer_name');
    photographerName.setAttribute('role', 'heading');
    photographerName.setAttribute('aria-level', '1');


    const photographerLocation = document.querySelector('.photographer_location');
    photographerLocation.setAttribute('role', 'text');

    const photographerTagline = document.querySelector('.photographer_tagline');
    photographerTagline.setAttribute('role', 'text');

    const photographerPortrait = document.createElement('img');
    photographerPortrait.className = 'photographer_portrait';
    photographerPortrait.src = `assets/photographers/${photographer.portrait}`;
    photographerPortrait.alt = `Photo de ${photographer.name}`;
    photographerPortrait.setAttribute('role', 'image');
    photographerImg.appendChild(photographerPortrait);
    const mediaGallery = document.querySelector('.media_gallery');

    let totalLikes = 0;

    if (mediaGallery) {
      for (let index = 0; index < media.length; index++) {
        const mediaData = media[index];
        const mediaElement = mediaFactory(mediaData, data.photographers);
        mediaGallery.appendChild(mediaElement);
        totalLikes += mediaData.likes;
      }
      console.log(media);
      updateTotalLikes(totalLikes - parseInt(likeCount.textContent, 10));
    } else {
      console.log('Media gallery element not found');
    }

    if (likeCount) {
      likeCount.setAttribute('role', 'text');
    } else {
      console.log('Like count element not found');
    }

    if (price) {
      price.textContent = `${photographer.price}€ / jour`;
      price.setAttribute('role', 'text');
    } else {
      console.log('Price element not found');
    }

    likeCount.textContent = totalLikes;
  } else {
    console.log('No photographer ID found in URL');
  }

  initSort();
}


export { getData, getPhotographerById, getPhotographerIdFromUrl, initPhotographer };
initPhotographer();