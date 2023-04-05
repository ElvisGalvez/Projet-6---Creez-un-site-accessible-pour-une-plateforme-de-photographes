import { mediaFactory } from '/scripts/factories/mediaFactory.js';

async function getData() {
  const response = await fetch('/data/photographers.json');
  const data = await response.json();
  return data;
}

async function getPhotographerById(id) {
  const data = await getData();
  const photographer = data.photographers.find(p => p.id === parseInt(id, 10));
  const media = data.media.filter(m => m.photographerId === parseInt(id, 10));
  return { photographer, media };
}

function getPhotographerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

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
    const likeBox = document.querySelector('#like_box');
    const price = document.querySelector('#price');

    photographerInfo.innerHTML = `
      <h1 class="photographer_name">${photographer.name}</h1>
      <p class="photographer_location">${photographer.city}, ${photographer.country}</p>
      <p class="photographer_tagline">${photographer.tagline}</p>
    `;

    const photographerPortrait = document.createElement('img');
    photographerPortrait.className = 'photographer_portrait';
    photographerPortrait.src = `assets/photographers/${photographer.portrait}`;
    photographerPortrait.alt = `Photo de ${photographer.name}`;
    photographerImg.appendChild(photographerPortrait);

    const mediaGallery = document.querySelector('.media_gallery');
    if (mediaGallery) {
      for (const mediaData of media) {
        const mediaElement = mediaFactory(mediaData, data.photographers);
        mediaGallery.appendChild(mediaElement);
      }

      console.log(media)
    } else {
      console.log('Media gallery element not found');
    }

    if (price) {
      const priceText = document.createTextNode(`${photographer.price}€ / jour`);
      price.appendChild(priceText);
      likeBox.appendChild(price);

      
    } else {
      console.log('Price element not found');
    }

  } else {
    console.log('No photographer ID found in URL');
  }
}

initPhotographer();