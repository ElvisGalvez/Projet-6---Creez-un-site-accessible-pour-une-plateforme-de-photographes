import { getPhotographerById, getPhotographerIdFromUrl } from '/scripts/pages/photographerPage.js';
import { mediaFactory } from '/scripts/factories/mediaFactory.js';
import { getData } from '/scripts/pages/photographerPage.js';
import { updateMediaList } from '/scripts/utils/lightbox.js';

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

function clearMediaGallery() {
  const mediaGallery = document.querySelector('.media_gallery');
  while (mediaGallery.firstChild) {
    mediaGallery.removeChild(mediaGallery.firstChild);
  }
}

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
    addKeyboardAccessibility();
  }
}


async function applySort() {
  const photographerId = getPhotographerIdFromUrl();
  const { media } = await getPhotographerById(photographerId);

  const sortBy = sortButton.getAttribute("data-selected");
  let sortedMedia = sortMedia(media, sortBy);
  console.log('sortedMedia before', sortedMedia);

  clearMediaGallery();

  sortedMedia = sortedMedia.map((media, index) => ({
    ...media,
    index,
  }));

  console.log('sortedMedia after', sortedMedia);

  updateMediaList(sortedMedia);
  updateMediaGallery(sortedMedia);
}

function addKeyboardAccessibility() {
  const mediaItems = document.querySelectorAll(".media_gallery > *");

  mediaItems.forEach((item, index) => {
    item.setAttribute("tabindex", index === 0 ? "0" : "-1");
    item.addEventListener("keydown", (event) => {
      let newIndex;
      if (event.key === "ArrowRight") {
        newIndex = (index + 1) % mediaItems.length;
      } else if (event.key === "ArrowLeft") {
        newIndex = (index - 1 + mediaItems.length) % mediaItems.length;
      } else {
        return;
      }

      event.preventDefault();
      item.setAttribute("tabindex", "-1");
      mediaItems[newIndex].setAttribute("tabindex", "0");
      mediaItems[newIndex].focus();
    });
  });
}
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
const optionItems = Array.from(sortOptions.querySelectorAll("li"));

function resetAriaSelected() {
  optionItems.forEach((item) => {
    item.removeAttribute("aria-selected");
  });
}

const selectedOptionId = "popularity";

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
optionItems.forEach((item) => {
  item.addEventListener("click", handleListItemClick);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleListItemClick(event);
    }
  });
});

function handleMenuClose() {
  sortButton.setAttribute("aria-expanded", "false");
  sortOptions.hidden = true;
  sortArrow.classList.toggle("fa-chevron-down");
  sortArrow.classList.toggle("fa-chevron-up");
  sortButton.focus();
  sortOptions.removeEventListener("keydown", trapFocus);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    handleMenuClose();
  }
});

sortButton.addEventListener("focus", () => {
  const isExpanded = sortButton.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    optionItems.forEach((item) => {
      item.setAttribute("tabindex", "0");
    });
  }
});



export { applySort };