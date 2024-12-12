document.addEventListener('DOMContentLoaded', () => {
    // Añadir el evento de cierre de sesión
    document.querySelector('#logout-btn').addEventListener('click', () => {
        fetch('../../RosarioFiesta-back/public/logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Si la sesión se cerró correctamente, redirigir
                    window.location.href = '../sections/index.html'; // Redirige al inicio
                } else {
                    alert('Error cerrando sesión');
                }
            })
            .catch(error => {
                console.error('Error cerrando sesión:', error);
                alert('Hubo un problema al cerrar sesión');
            });
    });
});
