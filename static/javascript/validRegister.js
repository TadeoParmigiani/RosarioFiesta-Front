function validoCrear() {
    let name = document.querySelector("#fullName").value;
    let dni = document.querySelector("#dni").value;
    let mail = document.querySelector("#email").value;
    let formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular
    let pass = document.querySelector("#password").value;
    let check = document.querySelector("#terminos").checked;

    if (name.trim() == '' || dni.trim() == '' || mail.trim() == '' || pass.trim() == '') { // valido campos vacios
        mostrar('#F-crear-campos', 'Debes completar todos los campos para continuar');
        return false;
    } else {
        if (/\d/.test(name)) { 
            mostrar('#F-NameCrear', 'El nombre no puede contener números');
            return false;
        }
        if (name.length <= 3) {
            mostrar('#F-NameCrear', 'El nombre debe tener más de 3 caracteres');
            return false;
        }
        if (dni.toString().length !== 8) { 
            mostrar('#F-dniCrear', 'El DNI debe tener 8 caracteres');
            return false;
        }
        if (!formato.test(mail)) { 
            mostrar('#F-emailCrear', 'El email no tiene el formato válido');
            return false;
        }
        if (pass.length < 8) { 
            mostrar('#F-passCrear', 'La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        if (!check) { 
            mostrar('#F-Check', 'Debes aceptar los términos y condiciones para crear una cuenta');
            return false;
        }
    }
    return true;
}

// Función para mostrar el mensaje y hacerle un temporizador
function mostrar(selector, mensaje) {
    const elemento = document.querySelector(selector);
    elemento.innerHTML = mensaje;
    elemento.classList.add('error-message');
    setTimeout(() => {
        elemento.textContent = '';
        elemento.classList.remove('error-message');
    }, 10000);
}

// borrar los div de error cuando se escribe en los inputs
document.querySelector("#fullName").addEventListener('input', function () {
    document.querySelector('#F-NameCrear').innerHTML = '';
    document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#dni").addEventListener('input', function () {
    document.querySelector('#F-dniCrear').innerHTML = '';
    document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#email").addEventListener('input', function () {
    document.querySelector('#F-emailCrear').innerHTML = '';
    document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#password").addEventListener('input', function () {
    document.querySelector('#F-passCrear').innerHTML = '';
    document.querySelector('#F-crear-campos').innerHTML = '';
});
document.querySelector("#terminos").addEventListener('input', function () {
    document.querySelector('#F-Check').innerHTML = '';
    document.querySelector('#F-crear-campos').innerHTML = '';
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        if (!validoCrear()) {
            return; 
        }

        
        const formData = new FormData(form);

        try {
            
            const response = await fetch('../../RosarioFiesta-back/public/register.php', {
                method: 'POST',
                body: formData
            });

            
            const result = await response.json();

            
            if (result.success) {
                alert(result.message || 'Registro exitoso');
                window.location.href = '../sections/login.html';
            } else {
                alert(result.message || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema con el registro. Intenta nuevamente.');
        }
    });
});