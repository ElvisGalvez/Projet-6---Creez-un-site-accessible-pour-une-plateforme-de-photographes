
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


// VERIFCATION PRENOM
  function firstNameCheck() {
    const firstNameInput = document.getElementById("first_name");
    const firstNameValue = firstNameInput.value.trim();
    const errorMessage = firstNameInput.parentNode.querySelector(".error-message");
  
    const regex = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' -]*$/;
    const isValid = regex.test(firstNameValue) && firstNameValue.length >= 2;
  
    if (!isValid) {
      console.log("Prénom invalide");
  
      if (!errorMessage) {
        const newErrorMessage = document.createElement("div");
        newErrorMessage.classList.add("error-message");
        newErrorMessage.textContent =
          "Le prénom est invalide. Il doit comporter au moins deux caractères sans chiffres ni espaces.";
        firstNameInput.parentNode.appendChild(newErrorMessage);
      }
      return false;
    } else {
      if (errorMessage) {
        errorMessage.remove();
      }
      return true;
    }
  }


  //VERIFICATION NOM
  function lastNameCheck() {
    const lastNameInput = document.getElementById("last_name");
    const lastNameValue = lastNameInput.value.trim();
    const errorMessage = lastNameInput.parentNode.querySelector(".error-message");
  
    const regex = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' -]*$/;
    const isValid = regex.test(lastNameValue) && lastNameValue.length >= 2;
  
    if (!isValid) {
      console.log("Nom invalide");
  
      if (!errorMessage) {
        const newErrorMessage = document.createElement("div");
        newErrorMessage.classList.add("error-message");
        newErrorMessage.textContent =
          "Le nom est invalide. Il doit comporter au moins deux caractères sans chiffres ni espaces.";
        lastNameInput.parentNode.appendChild(newErrorMessage);
      }
      return false;
    } else {
      if (errorMessage) {
        errorMessage.remove();
      }
      return true;
    }
  }

// VERIFICATION DU MAIL
function emailCheck() {
  const emailInput = document.getElementById("email");
  const emailValue = emailInput.value.trim();
  const errorMessage = emailInput.parentNode.querySelector(".error-message");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(emailValue);

  if (!isValid) {
    console.log("Email invalide");

    if (!errorMessage) {
      const newErrorMessage = document.createElement("div");
      newErrorMessage.classList.add("error-message");
      newErrorMessage.textContent = "L'adresse e-mail est invalide.";
      emailInput.parentNode.appendChild(newErrorMessage);
    }
    return false;
  } else {
    console.log("Email valide");

    if (errorMessage) {
      errorMessage.remove();
    }
    return true;
  }
}


  //VERIFICATION DU MESSAGE
  
  function messageCheck() {
    const messageInput = document.getElementById("message");
    const messageValue = messageInput.value.trim();
    const errorMessage = messageInput.parentNode.querySelector(".error-message");
  
    const isValid = messageValue !== '';
  
    if (!isValid) {
      console.log("Message vide");
  
      if (!errorMessage) {
        const newErrorMessage = document.createElement("div");
        newErrorMessage.classList.add("error-message");
        newErrorMessage.textContent = "Vous devez écrire quelque chose.";
        messageInput.parentNode.appendChild(newErrorMessage);
      }
      return false;
    } else {
      console.log("Message non vide");
  
      if (errorMessage) {
        errorMessage.remove();
      }
      return true;
    }
  }
  
  document.querySelector("form").addEventListener("submit", (event) => {
    const isValidFirstName = firstNameCheck();
    const isValidLastName = lastNameCheck();
    const isValidEmail = emailCheck();
    const isValidMessage = messageCheck();
  
    if (!isValidFirstName || !isValidLastName || !isValidEmail || !isValidMessage) {
      event.preventDefault();
      return;
    }
  
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
  
    console.log("Prénom:", firstName);
    console.log("Nom:", lastName);
    console.log("Email:", email);
    console.log("Message:", message);
  
    // ferme la modale après la soumission d'un formulaire valide
    closeModal();
  
    event.preventDefault(); // Ajouté pour empêcher le rechargement de la page lors de la soumission du formulaire
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

  function resetForm() {
    const form = document.querySelector("form");
    form.reset();
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((message) => {
      message.remove();
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
    resetForm();


// Permets de naviguer dans la modale à l'aide de 'TAB'
    const focusableElements = modal.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  } 
  
  function closeModal() {
    const modal = document.getElementById("contact_modal");
    if (modal) {
      modal.style.display = "none";
    }
  }
  
  function initModalCloseListener() {
    const closeBtn = document.getElementById("close_modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
  }
  
  initModalCloseListener();

  const closeButton = document.getElementById("close_modal");
  closeButton.setAttribute("role", "button");
  closeButton.setAttribute("aria-label", "close contact form");
  resetForm();

});

// Mets à jour le nom du photographe dans la modale en utilisant son ID
export function setPhotographerNameInModal(photographerName) {
  const photographerNameElement = document.getElementById('photographer_name_modal');
  photographerNameElement.textContent = photographerName;
}
