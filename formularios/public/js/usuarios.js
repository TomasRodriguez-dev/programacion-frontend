const tbody = document.getElementById('tbody-datos');

fetch('datos.json')
    .then(response => response.json())
    .then(datos => {
        datos.forEach((dato) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${dato.id}</td>
            <td>${dato.nombre}</td>
            <td>${dato.apellido}</td>
            <td>${dato.pais}</td>
            <td>${dato.mensaje}</td>
        `;
        tbody.appendChild(fila);
        });
    })
    .catch(error => console.error('Error:', error));