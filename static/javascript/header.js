document.addEventListener('DOMContentLoaded', () => {
    fetch('../../RosarioFiesta-back/public/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                document.querySelector('#log-in').style.display = 'none';
                document.querySelector('#logout-btn').style.display = 'block';
                document.querySelector('#cart').style.pointerEvents = 'auto';

                
                if (data.tipo_usuario === 'administrador') {
                    document.querySelector('#panel-admin').style.display = 'block';
                }

                document.querySelector('#logout-btn').addEventListener('click', () => {
                    fetch('../../RosarioFiesta-back/public/logout.php')
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) { // Confirmación de que la sesión fue cerrada
                                alert('Se cerro la sesion')
                                window.location.href = '../sections/index.html';
                            } else {
                                console.error('Error cerrando sesión');
                                alert('No se pudo cerrar la sesión. Inténtalo de nuevo.');
                            }
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
