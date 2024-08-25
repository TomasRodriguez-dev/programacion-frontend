const form = document.getElementById('form');

form.onsubmit = function(e) {
    e.preventDefault();
    
    const datos = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        pais: document.getElementById('pais').value,
        mensaje: document.getElementById('mensaje').value
    };

    console.log(datos);
    console.log(JSON.stringify(datos));

    form.reset();
};