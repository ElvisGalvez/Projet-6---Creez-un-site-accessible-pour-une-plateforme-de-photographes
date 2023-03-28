function photographerFactory(data) {
    const { name, portrait, city, country, price, tagline } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        // Sélectionne le modèle d'article vide à cloner
        const template = document.querySelector('#photographer_template');
      
        // Clone le modèle
        const article = template.content.cloneNode(true);
      
        // Modifie le contenu de l'article cloné
        const link = article.querySelector('.photographer_link');
        link.setAttribute('aria-label', `Voir le profil de ${data.name}`);
        link.setAttribute('href', `photographer.html?id=${data.id}`);
        const img = link.querySelector('.photographer_image');
        img.setAttribute('src', `assets/photographers/${data.portrait}`);
        img.setAttribute('alt', `photo de ${data.name}`);
      
        article.querySelector('.photographer_name').textContent = data.name;
        article.querySelector('.photographer_location').textContent = `${data.city}, ${data.country}`;
        article.querySelector('.photographer_price').textContent = `${data.price}€/jour`;
        article.querySelector('.photographer_tagline').textContent = data.tagline;
      
        return article;
      }

    return { getUserCardDOM };
}

function mediaFactory(data) {
  const { id, photographerId, title, image, video, alt, likes, date, price } = data;

  function getMediaDOM() {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media_item");

    if (image) {
      const img = document.createElement("img");
      img.src = `assets/images/${image}`;
      img.alt = alt;
      mediaElement.appendChild(img);
    } else if (video) {
      const videoElement = document.createElement("video");
      videoElement.src = `assets/videos/${video}`;
      videoElement.controls = true;
      mediaElement.appendChild(videoElement);
    }

    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("media_info");
    mediaInfo.innerHTML = `
      <p class="media_title">${title}</p>
      <p class="media_likes">${likes}</p>
      <p class="media_price">${price}€</p>
    `;
    mediaElement.appendChild(mediaInfo);

    return mediaElement;
  }

  return {
    id,
    photographerId,
    title,
    image,
    video,
    alt,
    likes,
    date,
    price,
    getMediaDOM
  }
}