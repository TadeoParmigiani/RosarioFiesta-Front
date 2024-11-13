document.addEventListener('DOMContentLoaded', async function() {
    // Obtener datos del cliente logueado
    try {
        const response = await fetch('../../RosarioFiesta-back/public/get-formClient.php'); // Cambia la ruta a la correcta
        const resultado = await response.json();
        
        if (resultado.success) {
            const datosCliente = resultado.data;

            // Autocompletar campos del formulario con los datos del cliente
            document.getElementById('nombre').value = datosCliente.nombre || '';
            document.getElementById('apellido').value = datosCliente.apellido || '';
            document.getElementById('email').value = datosCliente.email || '';
            document.getElementById('repetir-email').value = datosCliente.email || '';
            document.getElementById('dni').value = datosCliente.dni || '';
            document.getElementById('telefono').value = datosCliente.telefono || '';
        } else {
            console.error("Error:", resultado.message);
        }
    } catch (error) {
        console.error("Error en la solicitud de datos del cliente:", error);
    }

    const formulario = document.getElementById('formulario-pago');
    
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();  // Evitar que el formulario se envíe automáticamente
        if (validarFormulario()) {
            const cliente = {
                nombre: document.getElementById('nombre').value.trim(),
                apellido: document.getElementById('apellido').value.trim(),
                email: document.getElementById('email').value,
                dni: document.getElementById('dni').value.trim(),
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
    if (!dniFormato.test(dni) || dni.length < 8) {
        alert("El DNI debe contener solo números y tener 8 dígitos o más.");
        return false;
    }

    const telefonoFormato = /^[0-9]{7,10}$/;
    if (!telefonoFormato.test(telefono)) {
        alert("El número de teléfono debe tener entre 7 y 10 dígitos.");
        return false;
    }

    return true;
}
