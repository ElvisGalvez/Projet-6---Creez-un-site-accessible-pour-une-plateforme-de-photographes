import { getData } from '/scripts/pages/photographerPage.js';
import { getPhotographerById, getPhotographerIdFromUrl } from '/scripts/pages/photographerPage.js';

let mediaList = [];
let currentIndex = 0;

function normalizeDirectoryName(name) {
    return name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
}

function getPhotographerFirstNameById(photographers, id) {
    const photographer = photographers.find((p) => p.id === id);
    if (photographer) {
      return photographer.name.split(' ')[0].replace(' ', '_');
    } else {
      console.error(`Photographer not found for ID: ${id}`);
      return 'unknown';
    }
}

function getMediaPath(media, photographerFirstName) {
    const { image, video } = media;
    const photographerFolderName = photographerFirstName.replace('-', '_');
    const mediaFileName = image || video;
    return `assets/photosVideos/${photographerFolderName}/${mediaFileName}`;
}

  

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.classList.add('lightbox');

    const lightboxClose = document.createElement('span');
    lightboxClose.id = 'lightbox_close';
    lightboxClose.classList.add('lightbox_close');
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
    lightbox.appendChild(lightboxTitle); // Déplacer cette ligne ici

    

    const lightboxPrev = document.createElement('a');
    lightboxPrev.id = 'lightbox_prev';
    lightboxPrev.classList.add('lightbox_prev');
    lightboxPrev.innerHTML = '&#10094;';
    lightbox.appendChild(lightboxPrev);

    const lightboxNext = document.createElement('a');
    lightboxNext.id = 'lightbox_next';
    lightboxNext.classList.add('lightbox_next');
    lightboxNext.innerHTML = '&#10095;';
    lightbox.appendChild(lightboxNext);

    document.body.appendChild(lightbox);

    const lightboxContainer = document.getElementById('lightbox');
    lightboxContainer.appendChild(lightboxClose);
    lightboxContainer.appendChild(lightboxContent);
    lightboxContainer.appendChild(lightboxPrev);
    lightboxContainer.appendChild(lightboxNext);
    lightboxContentWrapper.appendChild(lightboxTitle);
}


async function updateLightboxContent() {
    const lightbox = document.getElementById('lightbox');
    const content = lightbox.querySelector('.lightbox_content');
  
    const media = mediaList[currentIndex];
    if (!media || !media.photographerId) {
      console.error('Invalid media object:', media);
      return;
    }
  
    const data = await getData();
    const photographerFirstName = getPhotographerFirstNameById(
      data.photographers,
      media.photographerId
    );
    const mediaPath = getMediaPath(media, photographerFirstName);
  
    console.log(mediaPath);

    if (media.image) {
        const img = document.createElement('img');
        img.src = mediaPath;
        img.alt = media.alt;
        content.innerHTML = '';
        content.appendChild(img);
      } else if (media.video) {
        const video = document.createElement('video');
        video.src = mediaPath;
        video.controls = true;
        video.setAttribute('preload', 'metadata'); 
        content.innerHTML = '';
        content.appendChild(video);
    }
    const lightboxTitle = document.getElementById('lightbox_title');
    lightboxTitle.textContent = media.title;
}

function openLightbox(index) {
    if (index >= 0 && index < mediaList.length) {
      currentIndex = index;
      updateLightboxContent();
  
      const lightbox = document.getElementById('lightbox');
      lightbox.style.display = 'block';
    } else {
      console.error(`Invalid index: ${index}`);
    }
  }

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