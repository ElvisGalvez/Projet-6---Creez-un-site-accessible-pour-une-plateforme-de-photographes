export function mediaFactory(data, photographers, photographer) {
  const { id, photographerId, title, image, video, likes, date, price } = data;

  function getPhotographerFirstNameById(photographers, id) {
    const photographer = photographers.find((p) => p.id === id);
    return photographer.name.split(' ')[0].replace(' ', '_');
  }

  function getMediaDOM() {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media_item");
  
    const photographerFirstName = getPhotographerFirstNameById(photographers, photographerId);
    const photographerFolderName = photographerFirstName.replace('-', '_');
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
  
    return mediaElement;
  }

  return getMediaDOM();
}