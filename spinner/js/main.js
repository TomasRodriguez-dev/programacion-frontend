const splashScreen = document.getElementById('splash-screen');
const mostrarSpinnerButton = document.getElementById('mostrar-spinner');

mostrarSpinnerButton.addEventListener('click', function() {
    splashScreen.style.visibility = 'visible';
    splashScreen.style.opacity = '1';
    
    setTimeout(function() {
        splashScreen.style.opacity = '0';
        setTimeout(function() {
            splashScreen.style.visibility = 'hidden';
        }, 400);
    }, 5000);
});