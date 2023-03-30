export function mediaFactory(data, normalizedPhotographerName) {
  const { image, video, alt } = data;

  function getMediaDOM() {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media_item");

    if (image) {
      const img = document.createElement("img");
      img.src = `assets/photosVideos/${normalizedPhotographerName}/${image}`;
      img.alt = alt;
      mediaElement.appendChild(img);
    } else if (video) {
      const videoElement = document.createElement("video");
      videoElement.src = `assets/photosVideos/${normalizedPhotographerName}/${video}`;
      videoElement.controls = true;
      mediaElement.appendChild(videoElement);
    }

    return mediaElement;
  }
  console.log("Created media element:", getMediaDOM());
  return { getMediaDOM };
}