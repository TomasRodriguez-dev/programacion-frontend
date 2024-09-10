document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.card-cursos, .card-estudiantes, .card-ui');
    cards.forEach((card) => {
        card.classList.add('animate');
    });
});