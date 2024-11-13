
// Verificamos si el usuario está logueado y es administrador
fetch('../../RosarioFiesta-back/public/check_session.php')
    .then(response => response.json())
    .then(data => {
        // Si no está logueado o no es administrador, redirigimos
        if (!data.authenticated || data.tipo_usuario !== 'administrador') {
            window.location.href = '../sections/login.html';  // Redirigir a la página de login
        }
    })
    .catch(error => {
        // En caso de error en la consulta, redirigir a login
        console.error('Error al verificar sesión:', error);
        window.location.href = '../sections/login.html';  // Redirigir en caso de error
    });
