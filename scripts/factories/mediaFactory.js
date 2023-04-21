import { openLightbox } from '/scripts/utils/lightbox.js';

// Renvoie le prénom du photographe en prenant un tableau de photographe et un ID
export function getPhotographerFirstNameById(photographers, id) {
  const photographer = photographers.find((p) => p.id === id);
  return photographer.name.split(' ')[0].replace(' ', '_');
}

// Incrémente les likes d'un médias et mets à jour le total de likes du photographe en lui ajoutant "1"
function incrementLike(mediaLikes) {
  const liked = mediaLikes.getAttribute('data-liked') === 'true';
  if (!liked) {
    const likesCountElement = mediaLikes.querySelector('.likes_count');
    const currentLikes = parseInt(likesCountElement.textContent, 10);
    likesCountElement.textContent = currentLikes + 1;
    mediaLikes.setAttribute('data-liked', 'true');
    updateTotalLikes(1);
  }
}

// Mets à jour le nom de total de likes de la page
function updateTotalLikes(change) {
  const likeCountElement = document.querySelector('#like_count');
  const currentTotalLikes = parseInt(likeCountElement.textContent, 10);
  likeCountElement.textContent = currentTotalLikes + change;
}

// L'index est utilisé pour la navigation entre les médias lorsqu'on ouvre la lightbox
export function mediaFactory(data, photographers, index) {

  const { id, photographerId, title, image, video, likes } = data;

  function getMediaDOM() {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media_item");
    mediaElement.setAttribute('data-index', id);

// Récupère le prénom du photographe pour chercher les médias dans l'explorer
    const photographerFirstName = getPhotographerFirstNameById(photographers, photographerId);
    console.log('Photographer first name:', photographerFirstName);
    const photographerFolderName = photographerFirstName.replace('-', '_');
    console.log('Photographer folder name:', photographerFolderName);
    const mediaSrc = image
      ? `assets/photosVideos/${photographerFolderName}/${image}`
      : `assets/photosVideos/${photographerFolderName}/${video}`;

// Détermine si le média est une image ou une vidéo
    const fileType = image ? "img" : "video";
    console.log("Generated mediaSrc:", mediaSrc);

    // Si c'est une image, un élément img est créé
    if (fileType === 'img') {
      const img = document.createElement('img');
      img.src = mediaSrc;
      img.alt = title;
      img.setAttribute('role', 'image link');
      img.setAttribute('aria-label', `${title}, closeup view`);
      img.setAttribute('tabindex', '0');
      mediaElement.appendChild(img);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      // Si c'est une vidéo, un élément vidéo est créé
    } else if (fileType === 'video') {
      const videoElement = document.createElement('video');
      videoElement.src = mediaSrc;
      videoElement.setAttribute('role', 'image link');
      videoElement.setAttribute('aria-label', `${title}, closeup view`);
      videoElement.setAttribute('tabindex', '0');
      videoElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
      mediaElement.appendChild(videoElement);
    }

// Le wrapper englobe le média, son titre, ses likes
    const mediaWrapper = document.createElement("div");
    mediaWrapper.classList.add("media_wrapper");

    mediaWrapper.appendChild(mediaElement);

    const mediaInfo = document.createElement('div');
    mediaInfo.className = 'media_info';

    const mediaTitle = document.createElement('p');
    mediaTitle.className = 'media_title';
    mediaTitle.textContent = title;
    mediaInfo.appendChild(mediaTitle);

    const mediaLikes = document.createElement('div');
    mediaLikes.className = 'media_likes';
    mediaLikes.setAttribute('data-id', id);

    // Stocke l'état du like
    mediaLikes.setAttribute('data-liked', 'false');
    mediaLikes.innerHTML = `
  <p><span class="likes_count">${likes}</span> <i class="heart_icon fa-solid fa-heart"></i></p>
`;

    const heartIcon = mediaLikes.querySelector('.heart_icon');
    heartIcon.setAttribute('role', 'image');
    heartIcon.setAttribute('aria-label', 'likes');
    heartIcon.setAttribute('tabindex', '0');

    mediaInfo.appendChild(mediaLikes);

    mediaLikes.addEventListener('click', (e) => {
      if (e.target.classList.contains('heart_icon')) {
        incrementLike(mediaLikes);
      }
    });

    // Ecouteur pour l'accessibilité
    heartIcon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        incrementLike(mediaLikes);
      }
    });

    mediaWrapper.appendChild(mediaInfo);

    return mediaWrapper;
  }

  return getMediaDOM();
}

export { updateTotalLikes };