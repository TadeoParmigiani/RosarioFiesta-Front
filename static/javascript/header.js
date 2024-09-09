document.addEventListener('DOMContentLoaded', () => {
    fetch('../../RosarioFiesta-back/public/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                document.querySelector('#log-in').style.display = 'none';
                document.querySelector('#logout-btn').style.display = 'block';
                document.querySelector('#cart').style.pointerEvents = 'auto';

                // Mostrar el enlace al panel de administración si el usuario es administrador
                if (data.tipo_usuario === 'administrador') {
                    document.querySelector('#panel-admin').style.display = 'block';
                }

                // Añadir evento al botón de cerrar sesión
                document.querySelector('#logout-btn').addEventListener('click', () => {
                    fetch('../../RosarioFiesta-back/public/logout.php')
                        .then(response => {
                            // Si la respuesta es correcta, redirigir al usuario
                            window.location.href = '../sections/index.html';
                        })
                        .catch(error => {
                            console.error('Error cerrando sesión:', error);
                        });
                });
            } else {
                document.querySelector('#log-in').style.display = 'block';
                document.querySelector('#logout-btn').style.display = 'none';
                document.querySelector('#cart').style.pointerEvents = 'none';
                document.querySelector('#panel-admin').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error verificando la sesión:', error);
        });
});
