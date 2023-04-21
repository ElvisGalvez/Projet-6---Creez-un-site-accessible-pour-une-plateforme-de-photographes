import { getData } from '/scripts/pages/photographerPage.js';
import { getPhotographerById, getPhotographerIdFromUrl } from '/scripts/pages/photographerPage.js';

// Liste des médias initialisée dans initLightbox à l'aide de getPhotographerById sur photographerPage.js
let mediaList = [];

// Stocke l'indice du média actuellement affiché dans la lightbox.
let currentIndex = 0;

// Obtiens le prénom du photographe pour construire le bon chemin d'accès aux médias dans l'explorer
function getPhotographerFirstNameById(photographers, id) {
  const photographer = photographers.find((p) => p.id === id);
  if (photographer) {
    return photographer.name.split(' ')[0].replace(' ', '_');
  } else {
    console.error(`Photographer not found for ID: ${id}`);
    return 'unknown';
  }
}

// Retourne le chemin d'accès approprié pour les médias à l'aide du prénom
function getMediaPath(media, photographerFirstName) {
  const { image, video } = media;
  const photographerFolderName = photographerFirstName.replace('-', '_');
  const mediaFileName = image || video;
  return `assets/photosVideos/${photographerFolderName}/${mediaFileName}`;
}

// Crée la modale d'affichage des médias
function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.classList.add('lightbox');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'image closeup view');
  lightbox.setAttribute('tabindex', '-1');


  const lightboxClose = document.createElement('button');
  lightboxClose.id = 'lightbox_close';
  lightboxClose.classList.add('lightbox_close');
  lightboxClose.setAttribute('role', 'button');
  lightboxClose.setAttribute('aria-label', 'Close dialog');
  lightboxClose.innerHTML = '&times;';
  lightbox.appendChild(lightboxClose);

  const lightboxContentWrapper = document.createElement('div');
  lightboxContentWrapper.classList.add('lightbox_content_wrapper');
  lightbox.appendChild(lightboxContentWrapper);

  const lightboxContent = document.createElement('div');
  lightboxContent.classList.add('lightbox_content');
  lightboxContentWrapper.appendChild(lightboxContent);

  const lightboxTitle = document.createElement('div');
  lightboxTitle.id = 'lightbox_title';
  lightboxTitle.classList.add('lightbox_title');
  lightbox.appendChild(lightboxTitle);



  const lightboxPrev = document.createElement('a');
  lightboxPrev.id = 'lightbox_prev';
  lightboxPrev.classList.add('lightbox_prev');
  lightboxPrev.setAttribute('role', 'link');
  lightboxPrev.setAttribute('aria-label', 'previous image');
  const lightboxPrevIcon = document.createElement('i');
  lightboxPrevIcon.classList.add('fas', 'fa-chevron-left');
  lightboxPrev.appendChild(lightboxPrevIcon);
  lightbox.appendChild(lightboxPrev);

  const lightboxNext = document.createElement('a');
  lightboxNext.id = 'lightbox_next';
  lightboxNext.classList.add('lightbox_next');
  lightboxNext.setAttribute('role', 'link');
  lightboxNext.setAttribute('aria-label', 'next image');
  const lightboxNextIcon = document.createElement('i');
  lightboxNextIcon.classList.add('fas', 'fa-chevron-right');
  lightboxNext.appendChild(lightboxNextIcon);
  lightbox.appendChild(lightboxNext);

  document.body.appendChild(lightbox);

  const lightboxContainer = document.getElementById('lightbox');
  lightboxContainer.appendChild(lightboxClose);
  lightboxContainer.appendChild(lightboxContent);
  lightboxContainer.appendChild(lightboxPrev);
  lightboxContainer.appendChild(lightboxNext);
  lightboxContentWrapper.appendChild(lightboxTitle);
}

// Récupère le média avec l'index actuel dans la liste des médias
async function updateLightboxContent() {
  const lightbox = document.getElementById('lightbox');
  const content = lightbox.querySelector('.lightbox_content');

  const media = mediaList[currentIndex];
  if (!media || !media.photographerId) {
    console.error('Invalid media object:', media);
    return;
  }

  // Récupère les informations du photographe pour retrouver son prénom à partir de l'ID
  const data = await getData();
  const photographerFirstName = getPhotographerFirstNameById(
    data.photographers,
    media.photographerId
  );

  // Génère le chemin d'accès approprié pour le média
  const mediaPath = getMediaPath(media, photographerFirstName);
  console.log(mediaPath);


  if (media.image) {
    const img = document.createElement('img');
    img.src = mediaPath;
    img.alt = media.alt;
    img.setAttribute('role', 'image');
    img.setAttribute('aria-label', media.title);
    content.innerHTML = '';
    content.appendChild(img);
  } else if (media.video) {
    const video = document.createElement('video');
    video.src = mediaPath;
    video.controls = true;
    video.setAttribute('preload', 'metadata');
    video.setAttribute('role', 'video');
    video.setAttribute('aria-label', media.title);
    content.innerHTML = '';
    
    content.appendChild(video);
  }

  // Récupère et affiche le titre approprié du média affiché
  const lightboxTitle = document.createElement('div');
  lightboxTitle.id = 'lightbox_title';
  lightboxTitle.classList.add('lightbox_title');
  lightboxTitle.setAttribute('role', 'text');
  lightboxTitle.textContent = media.title;
  content.appendChild(lightboxTitle);
}

// Ouvre la lightbox en cas de click sur un média en appelant updateLightboxContent pour afficher le média correspondant à l'index
export function openLightbox(index) {
  if (index >= 0 && index < mediaList.length) {
    currentIndex = index;
    updateLightboxContent();

    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'block';
  } else {
    console.error(`Invalid index: ${index}`);
  }
}

// Affiche les médias de la lightbox en fonction du critère de tri
function sortMedia(media, sortBy) {
  switch (sortBy) {
    case 'likes':
      return media.sort((a, b) => b.likes - a.likes);
    case 'date':
      return media.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'title':
      return media.sort((a, b) => a.title.localeCompare(b.title));
    default:
      console.error(`Invalid sort criterion: ${sortBy}`);
      return media;
  }
}

// Récupère l'identifiant du photographe depuis l'URL ainsi que ses médias, puis fait un triage avec sortMedia
async function initLightbox() {
  const photographerId = getPhotographerIdFromUrl();
  if (photographerId) {
    const { media } = await getPhotographerById(photographerId);

    const sortedMedia = sortMedia(media, 'likes');

    mediaList = sortedMedia;

    createLightbox();

    const mediaGallery = document.querySelector('.media_gallery');
    if (mediaGallery) {
      mediaGallery.addEventListener("click", (e) => {
        const target = e.target.closest(".media_item");
        if (target) {
          const mediaId = parseInt(target.getAttribute("data-index"), 10);
          console.log("Clicked media ID:", mediaId);
          const sortedIndex = mediaList.findIndex((item) => item.id === mediaId);
          openLightbox(sortedIndex);
        }
      });
    }

    // Permets la navigation au clavier
    const prevButton = document.getElementById('lightbox_prev');
    const nextButton = document.getElementById('lightbox_next');
    const closeButton = document.getElementById('lightbox_close');
    prevButton.addEventListener('click', () => {
      const newIndex = currentIndex - 1;
      if (newIndex >= 0) {
        currentIndex = newIndex;
        updateLightboxContent();
      }
    });
    nextButton.addEventListener('click', () => {
      const newIndex = currentIndex + 1;
      if (newIndex < mediaList.length) {
        currentIndex = newIndex;
        updateLightboxContent();
      }
    });
    closeButton.addEventListener('click', () => {
      const lightbox = document.getElementById('lightbox');
      lightbox.style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = currentIndex - 1;
        if (newIndex >= 0) {
          currentIndex = newIndex;
          updateLightboxContent();
        }
      } else if (e.key === 'ArrowRight') {
        const newIndex = currentIndex + 1;
        if (newIndex < mediaList.length) {
          currentIndex = newIndex;
          updateLightboxContent();
        }

      } else if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
      }
    });
  }
}

initLightbox();

// SortMedia dans sort.js a besoin de la liste des médias actuels pour gérer le tri
export function updateMediaList(newMediaList) {
  mediaList = newMediaList;
}