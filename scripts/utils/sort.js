import { getPhotographerById, getPhotographerIdFromUrl } from '/scripts/pages/photographerPage.js';
import { mediaFactory } from '/scripts/factories/mediaFactory.js';
import { getData } from '/scripts/pages/photographerPage.js';
import { updateMediaList } from '/scripts/utils/lightbox.js';

// Exécute le tri des médias dans l'ordre décroissant de leur paramètre de tri et les retourne
function sortMedia(media, sortBy) {
  if (sortBy === "popularity") {
    return media.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "date") {
    return media.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "title") {
    return media.sort((a, b) => a.title.localeCompare(b.title));
  }
  return media;
}


// Supprime la galerie actuelle pour éviter les doublons et la remplace par les médias triés
async function updateMediaGallery(sortedMedia) {
  const mediaGallery = document.querySelector(".media_gallery");
  if (mediaGallery) {
    mediaGallery.innerHTML = "";
    const data = await getData();
    sortedMedia.forEach((mediaData, index) => {
      const mediaElement = mediaFactory(mediaData, data.photographers, index);
      mediaElement.setAttribute("data-index", index);
      mediaGallery.appendChild(mediaElement);
    });
  }
}

// Fonction appelée à chaque tri
async function applySort() {
  // Récupère l'identifiant du photographe via l'URL ainsi que ses médias
  const photographerId = getPhotographerIdFromUrl();
  const { media } = await getPhotographerById(photographerId);

  //Utilise la fonction sortMedia pour trier les médias en fonction d'un critère
  const sortBy = sortButton.getAttribute("data-selected");
  let sortedMedia = sortMedia(media, sortBy);
  console.log('sortedMedia before', sortedMedia);

  // Mappe les éléments pour leur attribuer un nouvel index égal à leur index dans le nouveay tri
  sortedMedia = sortedMedia.map((media, index) => ({
    ...media,
    index,
  }));

  console.log('sortedMedia after', sortedMedia);

  updateMediaList(sortedMedia);
  updateMediaGallery(sortedMedia);
}

// Permets la navigation au clavier à l'intérieur du menu de tri
function trapFocus(event) {
  const isExpanded = sortButton.getAttribute("aria-expanded") === "true";
  if ((event.key === "Tab" || event.keyCode === 9) && isExpanded) {
    event.preventDefault();
    const focusableElements = Array.from(sortOptions.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"));
    const filteredFocusableElements = focusableElements.filter(el => el.id !== sortButton.getAttribute("data-selected"));
    const firstElement = filteredFocusableElements[0];
    const lastElement = filteredFocusableElements[filteredFocusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
      } else {
        const index = filteredFocusableElements.indexOf(document.activeElement);
        filteredFocusableElements[index - 1].focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
      } else {
        const index = filteredFocusableElements.indexOf(document.activeElement);
        filteredFocusableElements[index + 1].focus();
      }
    }
  }
}

const sortButton = document.getElementById("sort_button");
const sortOptions = document.getElementById("sort_options");
const sortArrow = document.querySelector(".sort_arrow");

// Stocke les options du menu à l'exeption de celle actuellement sockée dans 'sortButton'
const optionItems = Array.from(sortOptions.querySelectorAll("li"));

// Supprime "aria-selected" sur toutes les options de tri (empêche que plusieurs options soient sélectionnées en même temps)
function resetAriaSelected() {
  optionItems.forEach((item) => {
    item.removeAttribute("aria-selected");
  });
}

// Affiche ou cache le menu déroulant 'sortOption' en vérifiant si le menu est ouvert ou fermé via 'aria-expanded'
sortButton.addEventListener("click", () => {
  const isExpanded = sortButton.getAttribute("aria-expanded") === "true";
  sortButton.setAttribute("aria-expanded", !isExpanded);
  sortOptions.hidden = !sortOptions.hidden;
  sortArrow.classList.toggle("fa-chevron-down");
  sortArrow.classList.toggle("fa-chevron-up");

  if (!isExpanded) {
    const firstFocusableOption = optionItems.find((item) => item.id !== sortButton.getAttribute("data-selected"));
    if (firstFocusableOption) {
      firstFocusableOption.focus();
    }
    // Ajout de l'écouteur d'événement pour le piégeage du focus
    sortOptions.addEventListener("keydown", trapFocus);
  } else {
    // Suppression de l'écouteur d'événement pour le piégeage du focus lors de la fermeture du menu
    sortOptions.removeEventListener("keydown", trapFocus);
  }
});

// Mets à jour l'état du menu et applique le tri en fonction de l'option sélectionnée
function handleListItemClick(event) {
  const currentItem = event.target.closest("li");
  if (currentItem) {
    resetAriaSelected();
    sortButton.textContent = currentItem.textContent;
    sortButton.setAttribute("data-selected", currentItem.id);
    sortButton.setAttribute("aria-expanded", "false");
    sortOptions.hidden = true;
    sortArrow.classList.toggle("fa-chevron-down");
    sortArrow.classList.toggle("fa-chevron-up");
    currentItem.setAttribute("aria-selected", "true");
    applySort();
  }
}

// Permets l'accessibilité au clavier pour le menu de tri
optionItems.forEach((item) => {
  item.addEventListener("click", handleListItemClick);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleListItemClick(event);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    handleMenuClose();
  }
});

// Si le boutton de tri est ouvert, rends les options du menu focusables avec la touche "TAB"
sortButton.addEventListener("focus", () => {
  const isExpanded = sortButton.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    optionItems.forEach((item) => {
      item.setAttribute("tabindex", "0");
    });
  }
});

// A la fermeture du menu, change "aria-expanded" sur le boutton, masque les options, change la flèche et libère le focus
function handleMenuClose() {
  sortButton.setAttribute("aria-expanded", "false");
  sortOptions.hidden = true;
  sortArrow.classList.toggle("fa-chevron-down");
  sortArrow.classList.toggle("fa-chevron-up");
  sortButton.focus();
  sortOptions.removeEventListener("keydown", trapFocus);
}

// Permettra d'appliquer le tri sur la page du photographe
export { applySort };