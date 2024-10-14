document.getElementById('formularioInforme').addEventListener('submit', function(event) {
    const fechaInicio = document.getElementById('fecha_inicio').value;
    const fechaFin = document.getElementById('fecha_fin').value;

    if (new Date(fechaInicio) > new Date(fechaFin)) {
        event.preventDefault(); // Prevenir el envío del formulario
        alert('La fecha de inicio debe ser anterior a la fecha de fin.');
    }
});