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



