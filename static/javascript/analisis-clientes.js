document.addEventListener('DOMContentLoaded', function() {
    const selectClientes = document.getElementById('clientes');

    // Obtener la lista de clientes y agregarlos al select
    fetch('../../RosarioFiesta-back/public/clientReport.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(cliente => {
                let option = document.createElement('option');
                option.value = cliente.id_cliente;
                option.textContent = cliente.nombre;
                selectClientes.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los clientes:', error));
});
