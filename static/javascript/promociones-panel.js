document.addEventListener('DOMContentLoaded', function () {
    cargarPromociones();

    document.getElementById('formPromociones').addEventListener('submit', function (event) {
        event.preventDefault();
        verificarStockProductosBase(false); // Verifica stock antes de agregar
    });

    document.getElementById('formEditarPromociones').addEventListener('submit', function (event) {
        event.preventDefault();
        verificarStockProductosBase(true); // Verifica stock antes de editar
    });

    cargarProductosBase();
});

// Cargar los productos base en los selects
function cargarProductosBase(selectedProductId = null, index = null) {
    fetch('../../RosarioFiesta-back/public/get-product.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && Array.isArray(data.productos)) {
                const opciones = data.productos.map(producto =>
                    `<option value="${producto.id_producto}" ${producto.id_producto === selectedProductId ? 'selected' : ''}>
                        ${producto.nombre} (Stock: ${producto.stock})
                    </option>`
                ).join('');

                if (index !== null) {
                    document.getElementById(`productosBase${index}`).innerHTML = `<option value="">Selecciona un producto</option>` + opciones;
                } else {
                    const containers = [document.getElementById('productosBaseContainer'), document.getElementById('productosBaseContainerEdit')];
                    containers.forEach(container => {
                        const selects = container.querySelectorAll('select');
                        selects.forEach(select => {
                            select.innerHTML = `<option value="">Selecciona un producto</option>` + opciones;
                        });
                    });
                }
            } else {
                console.error('No se pudieron cargar productos base o no hay productos disponibles.');
            }
        })
        .catch(error => console.error('Error al cargar productos base:', error));
}


// Agregar un nuevo select de productos base dinámicamente
function agregarSelectProductosBase() {
    const container = document.getElementById('productosBaseContainer');

    const nuevoSelect = document.createElement('div');
    nuevoSelect.classList.add('d-flex', 'mb-2');
    nuevoSelect.innerHTML = `
        <select class="form-select" name="productosBase[]" id="productosBase" required>
            <option value="">Selecciona un producto</option>
        </select>
        <input type="number" class="form-control ml-2" name="cantidad[]" placeholder="Cantidad" required min="1">
        <button type="button" class="btn btn-danger btn-sm ml-2" onclick="eliminarSelect(this)">-</button>
    `;

    container.appendChild(nuevoSelect);
    cargarProductosBase(); // Llenar las opciones en el nuevo select
}

// Eliminar un select dinámico
function eliminarSelect(button) {
    button.parentElement.remove();
}

// Verificar stock y enviar datos
function verificarStockProductosBase(isEditing = false) {
    const selects = document.querySelectorAll('[name="productosBase[]"]');
    const cantidades = document.querySelectorAll('[name="cantidad[]"]');

    const idsProductos = [];
    const cantidadesProductos = [];

    selects.forEach((select, index) => {
        const productoId = select.value;
        const cantidad = cantidades[index].value;

        if (productoId && cantidad > 0) {
            if (!idsProductos.includes(productoId)) {
                idsProductos.push(productoId);
                cantidadesProductos.push(parseInt(cantidad, 10));
            } else {
                alert(`El producto ${select.options[select.selectedIndex].text} ya fue agregado.`);
                return;
            }
        }
    });

    if (idsProductos.length === 0 || cantidadesProductos.some(c => c <= 0)) {
        alert('Debe seleccionar productos base y cantidades válidas.');
        return;
    }

    fetch('../../RosarioFiesta-back/public/verificar-stock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsProductos, cantidades: cantidadesProductos })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                isEditing ? editarPromocionSubmit(idsProductos, cantidadesProductos) : agregarPromocion(idsProductos, cantidadesProductos);
            } else {
                alert(`Productos sin stock suficiente: ${data.productosSinStock.map(p => p.nombre).join(', ')}`);
            }
        })
        .catch(error => console.error('Error al verificar el stock:', error));
}


// Función para cargar las promociones
function cargarPromociones() {
    fetch('../../RosarioFiesta-back/public/get-promociones.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let promocionesHTML = '';
                data.promociones.forEach(promocion => {
                    // Asegúrate de que los productos base y cantidades estén presentes en la respuesta
                    let productosBaseHTML = '';
                    if (promocion.productosBase && promocion.cantidades) {
                        // Asegúrate de que ambos arrays (productosBase y cantidades) tengan la misma longitud
                        for (let i = 0; i < promocion.productosBase.length; i++) {
                            productosBaseHTML += `
                                Producto: ${promocion.productosBase[i].nombre} - Cantidad: ${promocion.cantidades[i]}<br>

                            `;
                        }
                    } else {
                        productosBaseHTML = 'N/A';
                    }

                    // Construir la tabla HTML para cada promoción
                    promocionesHTML += `
                        <tr>
                            <td>${promocion.id_producto}</td>
                            <td>${promocion.nombre}</td>
                            <td>${promocion.precio}</td>
                            <td>${promocion.stock}</td>
                            <td>${promocion.estado_producto}</td>
                            <td><img src="${promocion.img}" alt="${promocion.nombre}" style="width: 50px; height: auto;"></td>
                            <td>${productosBaseHTML}</td>
                            <td>${promocion.descripcion}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="editarPromocion(${promocion.id_producto})">Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="eliminarPromocion(${promocion.id_producto})">Eliminar</button>
                            </td>
                        </tr>
                    `;
                
                });
                document.getElementById('promocionesBody').innerHTML = promocionesHTML;

                $('#tablaPromociones').DataTable({
                    responsive: true,
                    paging: true,
                    searching: true, // Deshabilitar búsqueda nativa de DataTables (usamos nuestra propia búsqueda)
                    lengthChange: true,
                    columnDefs: [
                        { 
                            targets: [8],  // Asegura que la columna "Estado" sea buscable
                            searchable: false
                        }
                    ]
                });
            } else {
                document.getElementById('promocionesBody').innerHTML = '<tr><td colspan="9">No se encontraron promociones activas</td></tr>';
            }
        })
        .catch(error => console.error('Error al cargar las promociones:', error));
}




// Agregar promoción
function agregarPromocion(idsProductos, cantidades) {
    const formData = new URLSearchParams(new FormData(document.getElementById('formPromociones')));
    idsProductos.forEach((id, index) => {
        formData.append('productosBase[]', id);
        formData.append('cantidad[]', cantidades[index]);
    });

    fetch('../../RosarioFiesta-back/public/add-promociones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Promoción agregada correctamente.');
                $('#modalPromociones').modal('hide');
                cargarPromociones();
            } else {
                alert('Error al agregar la promoción.');
            }
        })
        .catch(error => console.error('Error al agregar la promoción:', error));
}

// Función para cargar datos en el formulario de edición
function editarPromocion(idProducto) {
    // Obtener la promoción específica mediante el ID
    fetch(`../../RosarioFiesta-back/public/get-promociones.php?id=${idProducto}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const promocion = data.promociones.find(p => p.id_producto == idProducto);
                if (promocion) {
                    // Rellenar los campos del formulario con los datos de la promoción
                    document.getElementById('editIdPromociones').value = promocion.id_producto;
                    document.getElementById('editNombre').value = promocion.nombre;
                    document.getElementById('editPrecio').value = promocion.precio;
                    document.getElementById('editDescripcion').value = promocion.descripcion;
                    document.getElementById('editEstado').value = promocion.estado_producto;
                    document.getElementById('editImg').value = promocion.img;

                    // Limpiar los selects existentes
                    const containerEdit = document.getElementById('productosBaseContainerEdit');
                    containerEdit.innerHTML = '';

                    // Agregar los productos base y preseleccionar las opciones correctas
                    promocion.productosBase.forEach((productoBase, index) => {
                        const nuevoSelect = document.createElement('div');
                        nuevoSelect.classList.add('d-flex', 'mb-2');
                        nuevoSelect.innerHTML = `
                            <select class="form-select" name="productosBase[]" id="productosBase${index}" required>
                                <option value="">Selecciona un producto</option>
                                <!-- Opciones cargadas dinámicamente -->
                            </select>
                            <input type="number" class="form-control ml-2" name="cantidad[]" value="${promocion.cantidades[index]}" placeholder="Cantidad" required min="1">
                            <button type="button" class="btn btn-danger btn-sm ml-2" onclick="eliminarSelect(this)">-</button>
                        `;
                        containerEdit.appendChild(nuevoSelect);

                        // Cargar los productos disponibles y preseleccionar el producto correcto
                        cargarProductosBase(productoBase.id_producto, index);
                    });

                    // Mostrar el modal de edición
                    $('#modalEditarPromociones').modal('show');
                } else {
                    alert('Promoción no encontrada.');
                }
            }
        })
        .catch(error => console.error('Error al cargar la promoción:', error));
}


function editarPromocionSubmit(idsProductos, cantidades) {
    const form = document.getElementById('formEditarPromociones');
    const formData = new URLSearchParams(new FormData(form));

    const idProducto = document.getElementById('editIdPromociones').value;
    
    formData.append('id_producto', idProducto);

    idsProductos.forEach((id, index) => {
        formData.append('productosBase[]', id);
        formData.append('cantidad[]', cantidades[index]);
    });

    // Verifica los datos antes de enviarlos
    console.log(Array.from(formData.entries()));

    fetch('../../RosarioFiesta-back/public/edit-promociones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Promoción editada correctamente.');
                $('#modalEditarPromociones').modal('hide');
                cargarPromociones();
            } else {
                alert('Error al editar la promoción.');
            }
        })
        .catch(error => console.error('Error al editar la promoción:', error));
}


// Función para eliminar un producto
async function eliminarPromocion(idProducto) {
    if (confirm('¿Seguro que deseas eliminar este producto y sus promociones asociadas?')) {
        try {
            const response = await fetch('../../RosarioFiesta-back/public/delete-promociones.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_producto: idProducto }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Producto y promociones eliminados correctamente.');
                cargarPromociones(); // Recarga la lista de productos/promociones
            } else {
                alert(`Error al eliminar el producto: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Ocurrió un error al intentar eliminar el producto. Intenta nuevamente.');
        }
    }
}