import { mediaFactory } from '/scripts/factories/mediaFactory.js';

function getPhotographerNameFromPage() {
  const photographerNameElement = document.querySelector('.photographer_name');
  return photographerNameElement ? photographerNameElement.textContent : null;
}

function normalizePhotographerName(name) {
  return name.split(' ')[0];
}

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

async function listFilesInDirectory(directoryPath) {
  const response = await fetch(directoryPath);
  const text = await response.text();
  const parser = new DOMParser();
  const document = parser.parseFromString(text, 'text/html');
  const links = Array.from(document.querySelectorAll('a'));
  console.log('Found links:', links);

  const fileNames = links
    .map(link => link.textContent)
    .map(textContent => {
      const match = textContent.match(/^(.+)\.((jpg)|(mp4))/);
      return match ? match[0] : null;
    })
    .filter(fileName => fileName !== null);

  console.log('Found fileNames:', fileNames);

  return fileNames;
}

async function loadMediaForPhotographer(photographerId) {
  const photographer = await getPhotographerById(photographerId);
  const photographerName = getPhotographerNameFromPage();
  const normalizedPhotographerName = photographerName ? normalizePhotographerName(photographerName) : normalizePhotographerName(photographer.name);

  const directoryPath = `/assets/photosVideos/${normalizedPhotographerName}/`;
  const fileNames = await listFilesInDirectory(directoryPath);

  const mediaFiles = fileNames.map(fileName => {
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileExtension === 'jpg') {
      return { image: fileName };
    } else if (fileExtension === 'mp4') {
      return { video: fileName };
    } else {
      return null;
    }
  }).filter(file => file !== null);

  console.log("Loaded media files:", mediaFiles);
  console.log("Media directory path:", directoryPath);
  return mediaFiles;
}


async function initPhotographer() {
  const photographerId = getPhotographerIdFromUrl();

  if (photographerId) {
    console.log(`Photographer ID: ${photographerId}`);
    const photographer = await getPhotographerById(photographerId);
    console.log(photographer);

    const mediaFiles = await loadMediaForPhotographer(photographerId);
    console.log(mediaFiles);

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
  for (const mediaData of mediaFiles) {
    const normalizedPhotographerName = normalizePhotographerName(photographer.name);
    const mediaElement = mediaFactory(mediaData, normalizedPhotographerName).getMediaDOM();
    mediaGallery.appendChild(mediaElement);
  }
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