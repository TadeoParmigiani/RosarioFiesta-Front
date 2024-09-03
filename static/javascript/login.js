document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const formData = new FormData(form);

        try {
            
            const response = await fetch('../../RosarioFiesta-back/public/login.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert('Inicio de sesión exitoso');
                window.location.href = '../sections/cartShop.html';
            } else {
                alert(result.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema con el inicio de sesión. Intenta nuevamente.');
        }
    });
});
