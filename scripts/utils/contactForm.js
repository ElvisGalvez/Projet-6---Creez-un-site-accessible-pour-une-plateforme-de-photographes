

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact_button").addEventListener("click", function () {
      displayModal();
    });
  
    document.getElementById("close_modal").addEventListener("click", function () {
      closeModal();
    });
  
    // Ajouter un gestionnaire d'événements pour l'événement 'submit' du formulaire
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
  
    function displayModal() {
      console.log("Displaying modal"); // Debug message
      const modal = document.getElementById("contact_modal");
      modal.style.display = "block";
    }
  
    function closeModal() {
      console.log("Closing modal"); // Debug message
      const modal = document.getElementById("contact_modal");
      modal.style.display = "none";
    }
  });

  export function setPhotographerNameInModal(photographerName) {
    const photographerNameElement = document.getElementById('photographer_name_modal');
    photographerNameElement.textContent = photographerName;
  }

  
  