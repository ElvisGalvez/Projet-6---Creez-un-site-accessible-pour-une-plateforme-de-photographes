import { getPhotographerById, getPhotographerIdFromUrl } from '/scripts/pages/photographerPage.js';
import { mediaFactory } from '/scripts/factories/mediaFactory.js';
import { getData } from '/scripts/pages/photographerPage.js'; 

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

async function updateMediaGallery(sortedMedia) {
    const mediaGallery = document.querySelector(".media_gallery");
    if (mediaGallery) {
      mediaGallery.innerHTML = "";
      const data = await getData(); 
      sortedMedia.forEach((mediaData, index) => {
        const mediaElement = mediaFactory(mediaData, data.photographers, index);
        mediaGallery.appendChild(mediaElement);
      });
    }
  }

export async function applySort() {
  const photographerId = getPhotographerIdFromUrl();
  const { media } = await getPhotographerById(photographerId);

  const sortBy = sortButton.getAttribute("data-selected");
  const sortedMedia = sortMedia(media, sortBy);

  updateMediaGallery(sortedMedia);
}

const sortButton = document.getElementById("sort_button");
const sortOptions = document.getElementById("sort_options");
const sortArrow = document.querySelector(".sort_arrow");
const optionItems = Array.from(sortOptions.querySelectorAll("li"));

sortButton.addEventListener("click", () => {
  const isExpanded = sortButton.getAttribute("aria-expanded") === "true";
  sortButton.setAttribute("aria-expanded", !isExpanded);
  sortOptions.hidden = !sortOptions.hidden;
  sortArrow.classList.toggle("fa-chevron-down");
  sortArrow.classList.toggle("fa-chevron-up");

  const selectedOptionId = sortButton.getAttribute("data-selected");
  optionItems.forEach((item) => {
    if (item.id === selectedOptionId) {
      item.setAttribute("aria-selected", "true");
    } else {
      item.setAttribute("aria-selected", "false");
    }
  });
});

sortOptions.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (li) {
    const selectedOption = optionItems.find((item) => item.id === li.id);
    sortButton.textContent = selectedOption.textContent;
    sortButton.setAttribute("data-selected", selectedOption.id);
    sortButton.setAttribute("aria-expanded", "false");
    sortOptions.hidden = true;
    sortArrow.classList.toggle("fa-chevron-down");
    sortArrow.classList.toggle("fa-chevron-up");
    optionItems.forEach(item => {
      item.addEventListener('click', () => {
        applySort();
      });
    });
    selectedOption.setAttribute("aria-selected", "true");
    applySort();
  }
  applySort();
});

// accessibilité avec le clavier
sortOptions.addEventListener("keydown", (event) => {
  const currentItem = event.target.closest("li");
  if (currentItem) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      sortButton.textContent = currentItem.textContent;
      sortButton.setAttribute("data-selected", currentItem.id);
      sortButton.setAttribute("aria-expanded", "false");
      sortOptions.hidden = true;
      sortArrow.classList.toggle("fa-chevron-down");
      sortArrow.classList.toggle("fa-chevron-up");
      optionItems.forEach(item => {
        item.addEventListener('click', () => {
          applySort();
        });
      });
      currentItem.setAttribute("aria-selected", "true");
      applySort();

    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousItem = currentItem.previousElementSibling || optionItems[optionItems.length - 1];
      currentItem.setAttribute("tabindex", "-1");
      previousItem.setAttribute("tabindex", "0");
      previousItem.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextItem = currentItem.nextElementSibling || optionItems[0];
      currentItem.setAttribute("tabindex", "-1");
      nextItem.setAttribute("tabindex", "0");
      nextItem.focus();
    }
  }
  applySort(); 
});