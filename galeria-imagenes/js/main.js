// Selectores para poder luego mostrar el modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("texto");

// Selector para seleccionar todas las imagenes de la geleria
const images = document.querySelectorAll(".galeria img");

// Añade el evento click para poder abrir el modal
images.forEach(function(image) {
    image.addEventListener("click", function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    });
});

const closeBtn = document.getElementsByClassName("close")[0];

// Se le añade el evento click para cerrar el modal
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});
