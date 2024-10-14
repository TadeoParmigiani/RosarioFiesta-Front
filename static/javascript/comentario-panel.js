// Función para cargar y mostrar comentarios
function cargarComentarios() {
    fetch('../../RosarioFiesta-back/public/get-comments.php')
    .then(response => response.json())
    .then(data => {
        const mensajeBody = document.getElementById('mensajeBody');
        mensajeBody.innerHTML = ''; 
        
        data.forEach(comentario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${comentario.nombre}</td>
                <td style="width: 40%;">${comentario.mensaje}</td> <!-- Ajuste de ancho -->
                <td>${comentario.email}</td>
                <td>${comentario.telefono}</td>
                <td>${comentario.fecha_nacimiento}</td>
            `;
            mensajeBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Llamar a la función para cargar comentarios cuando la página se cargue
document.addEventListener('DOMContentLoaded', cargarComentarios);
