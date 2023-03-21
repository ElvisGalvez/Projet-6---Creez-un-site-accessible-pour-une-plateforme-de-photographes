function photographerFactory(data) {
    const { name, portrait, city, country, price, tagline } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        // Sélectionne le modèle d'article vide à cloner
        const template = document.querySelector('#photographer-template');

        // Clone le modèle
        const article = template.content.cloneNode(true);

        // Modifie le contenu de l'article cloné
        const link = article.querySelector('.photographer-link');
        link.setAttribute('aria-label', `Voir le profil de ${name}`);
        const img = link.querySelector('.photographer-image');
        img.setAttribute('src', picture);
        img.setAttribute('alt', `photo de ${name}`);

        const photographerName = link.querySelector('.photographer-name');
        photographerName.textContent = name;

        article.querySelector('.photographer-location').textContent = `${city}, ${country}`;
        article.querySelector('.photographer-price').textContent = `${price}€/jour`;
        article.querySelector('.photographer-tagline').textContent = tagline;

        return article;
    }

    return { getUserCardDOM };
}