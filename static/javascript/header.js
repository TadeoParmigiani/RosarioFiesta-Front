document.addEventListener('DOMContentLoaded', () => {
    fetch('../../RosarioFiesta-back/public/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                document.getElementById('log-in').style.display = 'none';
                document.getElementById('logout-btn').style.display = 'block';
                document.getElementById('cart').style.pointerEvents = 'auto';
                
                document.getElementById('logout-btn').addEventListener('click', () => {
                    fetch('../../RosarioFiesta-back/public/logout.php')
                        .then(response => {

                            window.location.href = '../sections/index.html';
                        })
                        .catch(error => {
                            console.error('Error cerrando sesión:', error);
                        });
                });
            } else {
                document.getElementById('log-in').style.display = 'block';
                document.getElementById('logout-btn').style.display = 'none';
                document.getElementById('cart').style.pointerEvents = 'none';
                
            }
        })
        .catch(error => {
            console.error('Error verificando la sesión:', error);
        });
});
