document.addEventListener('DOMContentLoaded', cargarVentas);
let tablaVentas;

function cargarVentas() {
    fetch('../../RosarioFiesta-back/public/get-ventas.php')
        .then(response => response.json())
        .then(data => {
            const ventasBody = document.getElementById('ventasBody');
            ventasBody.innerHTML = '';

            // Agregar las filas dinámicamente
            data.forEach(venta => {
                const productosTexto = venta.productos.map(p => `${p.nombre} - ${p.cantidad} x $${p.precio_unitario}`).join(' | ');

                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${venta.id_venta}</td>
                    <td>${venta.fecha}</td>
                    <td><a href="#" class="cliente-info" data-id="${venta.id_cliente}">${venta.cliente}</a></td>
                    <td>${venta.metodo_pago}</td>
                    <td>${venta.total}</td>
                    <td>${productosTexto}</td>
                    <td id="estado-${venta.id_venta}">
                         ${venta.estado.trim().replace(/\s+/g, ' ')}
                    </td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Cambiar Estado
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onclick="editarEstado(${venta.id_venta}, 'Pendiente')">Pendiente</a>
                                <a class="dropdown-item" href="#" onclick="editarEstado(${venta.id_venta}, 'Entregado')">Entregado</a>
                                <a class="dropdown-item" href="#" onclick="editarEstado(${venta.id_venta}, 'Cancelado')">Cancelado</a>
                            </div>
                        </div>
                    </td>
                `;

                ventasBody.appendChild(fila);
            });

            // Destruir la instancia anterior de DataTable (si existe) antes de volver a inicializarla
            if (tablaVentas) {
                tablaVentas.destroy();
            }
            console.log('Datos de ventas:', data);
            // Inicializar DataTable con búsqueda habilitada
            tablaVentas = $('#tablaVentas').DataTable({
                responsive: true,
                paging: true,
                searching: true,
                lengthChange: true,
                order: [[0, 'desc']],
                columnDefs: [
                    { 
                        targets: [7],  // Asegura que la columna "Estado" sea buscable
                        searchable: false
                    }
                ]
            });
            console.log('DataTable:', tablaVentas);
            // Establecer evento para mostrar detalles del cliente
            document.getElementById('tablaVentas').addEventListener('click', function(event) {
                const target = event.target;
                if (target.classList.contains('cliente-info')) {
                    event.preventDefault();
                    const clienteId = target.getAttribute('data-id');
                    abrirModalCliente(clienteId);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function abrirModalCliente(clienteId) {
    fetch(`../../RosarioFiesta-back/public/get-client.php?id_cliente=${clienteId}`)
        .then(response => response.json())
        .then(cliente => {
            document.getElementById('clienteId').value = cliente.id_cliente;
            document.getElementById('clienteNombre').value = cliente.nombre;
            document.getElementById('clienteApellido').value = cliente.apellido;
            document.getElementById('clienteDni').value = cliente.dni;
            document.getElementById('clienteEmail').value = cliente.email;
            document.getElementById('clienteTelefono').value = cliente.telefono;

            const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'));
            modalCliente.show();

            // Configurar el botón "Modificar" dentro del primer modal para abrir el segundo modal
            const btnModificar = document.getElementById('btnModificarCliente');
            btnModificar.onclick = function() {
                abrirModalEditar(cliente); // Pasar los datos al segundo modal
            };
        })
        .catch(error => {
            console.error('Error al cargar el cliente:', error);
        });
}

function abrirModalEditar(cliente) {
    document.getElementById('clienteIdEditar').value = cliente.id_cliente;
    document.getElementById('clienteNombreEditar').value = cliente.nombre;
    document.getElementById('clienteApellidoEditar').value = cliente.apellido;
    document.getElementById('clienteDniEditar').value = cliente.dni;
    document.getElementById('clienteEmailEditar').value = cliente.email;
    document.getElementById('clienteTelefonoEditar').value = cliente.telefono;

    const modalEditarCliente = new bootstrap.Modal(document.getElementById('modalEditarCliente'));
    modalEditarCliente.show();
}

document.getElementById('btnGuardarCliente').addEventListener('click', function() {
    const form = document.getElementById('formClienteEditar');
    const formData = new FormData(form);

    fetch('../../RosarioFiesta-back/public/edit-client.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Cliente actualizado correctamente.');
            const modalEditarCliente = bootstrap.Modal.getInstance(document.getElementById('modalEditarCliente'));
            modalEditarCliente.hide();
            cargarVentas();
        } else {
            alert('Error al actualizar el cliente: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al actualizar el cliente:', error);
    });
});

function editarEstado(idVenta, nuevoEstado) {
    if (confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`)) {
        fetch('../../RosarioFiesta-back/public/edit-venta.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_venta: idVenta,
                nuevo_estado: nuevoEstado
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Estado de la venta actualizado correctamente.');
                document.getElementById(`estado-${idVenta}`).innerText = nuevoEstado;
                // Llamar de nuevo a cargarVentas para recargar los datos y volver a inicializar DataTable
                cargarVentas();
            } else {
                alert('Error al actualizar el estado de la venta: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al actualizar el estado de la venta:', error);
        });
    }
}

