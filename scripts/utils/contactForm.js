
// Appelle la fonction displayModal au click sur le boutton 
document.addEventListener("DOMContentLoaded", function () {
  const contactButton = document.getElementById("contact_button");
  contactButton.setAttribute('role', 'buttons');
  document.getElementById("contact_button").addEventListener("click", function () {
    displayModal();
  });

  // Appelle la fonction closeModal au clic sur la croix
  document.getElementById("close_modal").addEventListener("click", function () {
    closeModal();
  });

  // Empêche l'évènement par défaut du formulaire et récupère les valeurs des champs remplis
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); 

    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    console.log("Prénom:", firstName);
    console.log("Nom:", lastName);
    console.log("Email:", email);
    console.log("Message:", message);
  });

  // Permets de fermer le formulaire avec 'échap'
  document.addEventListener("keyup", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });


  // gère le focus des éléments de la modale
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", (event) => {
      if (event.key === "Tab" || event.keyCode === 9) {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
          }
        }
      }
    });
  }

  // Permets d'afficher la modale
  function displayModal() {
    console.log("Displaying modal"); 
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    const modalHeading = document.getElementById("modal-heading");
    const photographerName = document.getElementById("photographer_name_modal").textContent;
    modal.setAttribute("aria-label", `Contactez-moi ${photographerName}`);
    modal.setAttribute("aria-labelledby", modalHeading.id);

    trapFocus(modal);

// Permets de naviguer dans la modale à l'aide de 'TAB'
    const focusableElements = modal.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  } 
  
  function closeModal() {
    console.log("Closing modal"); 
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
  }

  const closeButton = document.getElementById("close_modal");
  closeButton.setAttribute("role", "button");
  closeButton.setAttribute("aria-label", "close contact form");
});

// Mets à jour le nom du photographe dans la modale en utilisant son ID
export function setPhotographerNameInModal(photographerName) {
  const photographerNameElement = document.getElementById('photographer_name_modal');
  photographerNameElement.textContent = photographerName;
}
