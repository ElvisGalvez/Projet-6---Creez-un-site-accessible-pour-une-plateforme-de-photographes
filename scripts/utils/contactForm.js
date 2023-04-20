document.addEventListener("DOMContentLoaded", function () {
  const contactButton = document.getElementById("contact_button");
  contactButton.setAttribute('role', 'buttons');
  document.getElementById("contact_button").addEventListener("click", function () {
    displayModal();
  });

  document.getElementById("close_modal").addEventListener("click", function () {
    closeModal();
  });

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche la soumission du formulaire par défaut

    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    console.log("Prénom:", firstName);
    console.log("Nom:", lastName);
    console.log("Email:", email);
    console.log("Message:", message);
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

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

  function displayModal() {
    console.log("Displaying modal"); // Debug message
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    const modalHeading = document.getElementById("modal-heading");
    const photographerName = document.getElementById("photographer_name_modal").textContent;
    modal.setAttribute("aria-label", `Contactez-moi ${photographerName}`);
    modal.setAttribute("aria-labelledby", modalHeading.id);

    trapFocus(modal);


    const focusableElements = modal.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  } 
  
  function closeModal() {
    console.log("Closing modal"); // Debug message
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
  }

  const closeButton = document.getElementById("close_modal");
  closeButton.setAttribute("role", "button");
  closeButton.setAttribute("aria-label", "close contact form");
});

export function setPhotographerNameInModal(photographerName) {
  const photographerNameElement = document.getElementById('photographer_name_modal');
  photographerNameElement.textContent = photographerName;
}
