document.getElementById('formularioInforme').addEventListener('submit', function(event) {
    const fechaInicio = document.getElementById('promo_fecha_inicio').value;
    const fechaFin = document.getElementById('promo_fecha_fin').value;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Eliminar la parte de la hora para solo comparar la fecha

    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    if (fechaInicioDate > fechaFinDate) {
        event.preventDefault();
        alert('La fecha de inicio debe ser anterior a la fecha de fin.');
    } else if (fechaInicioDate > hoy || fechaFinDate > hoy) {
        event.preventDefault();
        alert('No se pueden seleccionar fechas futuras.');
    }
});
