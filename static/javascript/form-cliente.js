document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario-pago');
    
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();  // Evitar que el formulario se envíe automáticamente
        if (validarFormulario()) {
            const cliente = {
                nombre:  document.getElementById('nombre').value.trim(),
                apellido: document.getElementById('apellido').value.trim(),
                email: document.getElementById('email').value,
                dni:  dni = document.getElementById('dni').value.trim(),
                telefono: document.getElementById('telefono').value.trim()
            };
            localStorage.setItem('cliente', JSON.stringify(cliente));
            window.location.href = "../sections/form-pago.html"; 
        }
    });
});

function validarFormulario() {
    const email = document.getElementById('email').value;
    const repetirEmail = document.getElementById('repetir-email').value;
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    if (email !== repetirEmail) {
        alert("Los correos electrónicos no coinciden.");
        return false;
    }

    if (nombre === "" || apellido === "" || dni === "" || telefono === "") {
        alert("Todos los campos son obligatorios.");
        return false;
    }

    const dniFormato = /^[0-9]+$/;
    if (!dniFormato.test(dni) && length.dni >= 8) {
        alert("El DNI debe contener solo números y contener 8 numeros o mas.");
        return false;
    }

    const telefonoFormato = /^[0-9]{7,10}$/;
    if (!telefonoFormato.test(telefono)) {
        alert("El número de teléfono debe tener entre 7 y 10 dígitos.");
        return false;
    }

    return true;
}