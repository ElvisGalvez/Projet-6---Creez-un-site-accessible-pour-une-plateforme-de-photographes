import { getPhotographerById, getPhotographerIdFromUrl } from '/scripts/pages/photographerPage.js';


let mediaList = [];
let currentIndex = 0;

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.classList.add('lightbox');

    const lightboxClose = document.createElement('span');
    lightboxClose.id = 'lightbox_close';
    lightboxClose.classList.add('lightbox_close');
    lightboxClose.innerHTML = '&times;';
    lightbox.appendChild(lightboxClose);

    const lightboxContent = document.createElement('div');
    lightboxContent.classList.add('lightbox_content');
    lightbox.appendChild(lightboxContent);

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
}

function attachLightboxListeners() {
    const lightboxClose = document.getElementById('lightbox_close');
    lightboxClose.addEventListener('click', closeLightbox);

    const lightboxPrev = document.getElementById('lightbox_prev');
    lightboxPrev.addEventListener('click', previousMedia);

    const lightboxNext = document.getElementById('lightbox_next');
    lightboxNext.addEventListener('click', nextMedia);

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                previousMedia();
            } else if (e.key === 'ArrowRight') {
                nextMedia();
            }
        }
    });
}

function updateLightboxContent() {
    const lightbox = document.getElementById('lightbox');
    const content = lightbox.querySelector('.lightbox_content');

    const media = mediaList[currentIndex];
    if (media.image) {
        const img = document.createElement('img');
        img.src = `assets/images/${media.image}`;
        img.alt = media.alt;
        content.innerHTML = '';
        content.appendChild(img);
    } else if (media.video) {
        const video = document.createElement('video');
        video.src = `assets/images/${media.video}`;
        video.controls = true;
        content.innerHTML = '';
        content.appendChild(video);
    }
}

function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();

    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'block';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

function previousMedia() {
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
        currentIndex = newIndex;
        updateLightboxContent();
    }
}

function nextMedia() {
    const newIndex = currentIndex + 1;
    if (newIndex < mediaList.length) {
        openLightbox(newIndex);
    }
}

async function initLightbox() {
    const photographerId = getPhotographerIdFromUrl();
    if (photographerId) {
        const { media } = await getPhotographerById(photographerId);
        mediaList = media;

        createLightbox();

        const mediaGallery = document.querySelector('.media_gallery');
        if (mediaGallery) {
            mediaGallery.addEventListener('click', (e) => {
                const target = e.target.closest('.media_item');
                if (target) {
                    const index = Array.from(mediaGallery.children).indexOf(target);
                    openLightbox(index);
                }
                console.log('Prev button:', prevButton);
                console.log('Next button:', nextButton);
                console.log('Close button:', closeButton);
                console.log('Media gallery:', mediaGallery);
            });
        }

        const prevButton = document.getElementById('lightbox_prev');
        const nextButton = document.getElementById('lightbox_next');
        const closeButton = document.getElementById('lightbox_close');
        prevButton.addEventListener('click', previousMedia);
        nextButton.addEventListener('click', nextMedia);
        closeButton.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                previousMedia();
            } else if (e.key === 'ArrowRight') {
                nextMedia();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
}

initLightbox();