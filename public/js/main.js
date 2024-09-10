document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.persona, .card-cursos, .card-estudiantes, .card-ui');
    cards.forEach((card) => {
        card.classList.add('animate');
    });
});