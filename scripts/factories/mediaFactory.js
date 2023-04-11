export function getPhotographerFirstNameById(photographers, id) {
  const photographer = photographers.find((p) => p.id === id);
  return photographer.name.split(' ')[0].replace(' ', '_');
}

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

function updateTotalLikes(change) {
  const likeCountElement = document.querySelector('#like_count');
  const currentTotalLikes = parseInt(likeCountElement.textContent, 10);
  likeCountElement.textContent = currentTotalLikes + change;
}

export function mediaFactory(data, photographers, index) {
  const { id, photographerId, title, image, video, likes, date, price } = data;

  function getMediaDOM() {
    const mediaElement = document.createElement("div");
mediaElement.classList.add("media_item");
mediaElement.setAttribute('data-index', index);
  
    const photographerFirstName = getPhotographerFirstNameById(photographers, photographerId);
    console.log('Photographer first name:', photographerFirstName);
    const photographerFolderName = photographerFirstName.replace('-', '_');
    console.log('Photographer folder name:', photographerFolderName);
    const mediaSrc = image
  ? `assets/photosVideos/${photographerFolderName}/${image}`
  : `assets/photosVideos/${photographerFolderName}/${video}`;
    const fileType = image ? "img" : "video";
    console.log("Generated mediaSrc:", mediaSrc);
  
    if (fileType === 'img') {
      const img = document.createElement('img');
      img.src = mediaSrc;
      img.alt = title;
      mediaElement.appendChild(img);
    } else if (fileType === 'video') {
      const videoElement = document.createElement('video');
      videoElement.src = mediaSrc;
      videoElement.controls = true;
      mediaElement.appendChild(videoElement);
    }
  
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
    mediaLikes.setAttribute('data-liked', 'false');
    mediaLikes.innerHTML = `
      <p><span class="likes_count">${likes}</span> <i class="heart_icon fa-solid fa-heart"></i></p>
    `;
    mediaInfo.appendChild(mediaLikes);

    //ecouteur
    mediaLikes.addEventListener('click', (e) => {
      if (e.target.classList.contains('heart_icon')) {
        incrementLike(mediaLikes);
      }
    });

    mediaWrapper.appendChild(mediaInfo);

    return mediaWrapper;
  }

  return getMediaDOM();
}

export { updateTotalLikes };