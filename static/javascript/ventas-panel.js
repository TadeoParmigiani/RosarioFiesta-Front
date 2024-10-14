document.addEventListener('DOMContentLoaded', cargarVentas);

function cargarVentas() {
    fetch('../../RosarioFiesta-back/public/get-ventas.php')
        .then(response => response.json())
        .then(data => {
            const ventasBody = document.getElementById('ventasBody');
            ventasBody.innerHTML = '';

            data.forEach(venta => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${venta.id_venta}</td>
                    <td>${venta.fecha}</td>
                    <td><a href="#" class="cliente-info" data-id="${venta.id_cliente}">${venta.cliente}</a></td>
                    <td>${venta.metodo_pago}</td>
                    <td>${venta.total}</td>
                    <td>${venta.estado}</td>
                    <td>
                        ${venta.productos.map(p => `
                            <div>
                                ${p.nombre} - ${p.cantidad} x $${p.precio_unitario}
                            </div>
                        `).join('')}
                    </td>
                `;

                ventasBody.appendChild(fila);
            });

            document.querySelectorAll('.cliente-info').forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const clienteId = this.getAttribute('data-id');
                    abrirModalCliente(clienteId);
                });
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

            // Event listener para abrir el modal de edición
            document.getElementById('btnModificarCliente').addEventListener('click', function() {
                modalCliente.hide();
                abrirModalEditar(cliente);
            });
        })
        .catch(error => {
            console.error('Error al cargar el cliente:', error);
        });
}

function abrirModalEditar(cliente) {
    // Cargar datos en el modal de edición
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
