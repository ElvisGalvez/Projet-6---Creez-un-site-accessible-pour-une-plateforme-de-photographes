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
        link.setAttribute('aria-label', `Voir le profil de ${name}`);
        link.setAttribute('href', `photographer.html?id=${data.id}`);
        const img = link.querySelector('.photographer_image');
        img.setAttribute('src', picture);
        img.setAttribute('alt', `photo de ${name}`);

        const photographerName = link.querySelector('.photographer_name');
        photographerName.textContent = name;

        article.querySelector('.photographer_location').textContent = `${city}, ${country}`;
        article.querySelector('.photographer_price').textContent = `${price}€/jour`;
        article.querySelector('.photographer_tagline').textContent = tagline;

        return article;

        
    }

    return { getUserCardDOM };
}