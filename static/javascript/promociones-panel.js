document.addEventListener('DOMContentLoaded', function () {
    cargarPromociones();

    // Manejo del envío del formulario de agregar promoción
    document.getElementById('formPromociones').addEventListener('submit', function (event) {
        event.preventDefault();
        verificarStockProductosBase();
    });

    // Manejo del envío del formulario de editar promoción
    document.getElementById('formEditarPromociones').addEventListener('submit', function (event) {
        event.preventDefault();
        verificarStockProductosBase(true); // Verifica el stock antes de editar
    });

    // Cargar productos base para selects dinámicos
    cargarProductosBase();
});

// Cargar los productos base en los selects
function cargarProductosBase(selectedProductId = null, index = null) {
    fetch('../../RosarioFiesta-back/public/get-product.php') // Cambiar a la ruta real
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Verifica si la respuesta contiene productos
                const productos = data.productos || [];

                if (productos.length > 0) {
                    const opciones = productos.map(producto =>
                        `<option value="${producto.id_producto}" ${producto.id_producto === selectedProductId ? 'selected' : ''}>
                            ${producto.nombre} (Stock: ${producto.stock})
                        </option>`
                    ).join('');

                    // Si se pasa el parámetro index, actualizamos solo el select de edición
                    if (index !== null) {
                        const select = document.getElementById(`productosBase${index}`);
                        select.innerHTML = `<option value="">Selecciona un producto</option>` + opciones;
                    } else {
                        // Si no se pasa el parámetro index, cargamos los select para agregar productos
                        const container = document.getElementById('productosBaseContainer');
                        const selects = container.querySelectorAll('select');
                        selects.forEach(select => {
                            select.innerHTML = `<option value="">Selecciona un producto</option>` + opciones;
                        });

                        const containerEdit = document.getElementById('productosBaseContainerEdit');
                        const selectsEdit = containerEdit.querySelectorAll('select');
                        selectsEdit.forEach(select => {
                            select.innerHTML = `<option value="">Selecciona un producto</option>` + opciones;
                        });
                    }
                } else {
                    console.error('No hay productos disponibles.');
                }
            } else {
                console.error('No se pudieron cargar los productos base.');
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

function verificarStockProductosBase(isEditing = false) {
    // Obtener los productos base seleccionados
    const selects = document.querySelectorAll('[name="productosBase[]"]');
    const cantidades = document.querySelectorAll('[name="cantidad[]"]');

    const idsProductos = [];
    const cantidadesProductos = [];

    // Recorremos los selects y las cantidades
    selects.forEach((select, index) => {
        const productoId = select.value;
        const cantidad = cantidades[index].value;

        // Evitamos que se agregue un producto duplicado
        if (productoId !== "" && cantidad > 0) {
            if (!idsProductos.includes(productoId)) {
                idsProductos.push(productoId);
                cantidadesProductos.push(cantidad);
            } else {
                alert(`El producto ${select.options[select.selectedIndex].text} ya ha sido agregado.`);
                return;
            }
        }
    });

    // Verificar si hay productos base seleccionados y si las cantidades son válidas
    if (idsProductos.length === 0) {
        alert('Debe seleccionar productos base.');
        return;
    }

    if (cantidadesProductos.some(cantidad => cantidad === "" || cantidad <= 0)) {
        alert('Debe ingresar cantidades válidas para todos los productos base.');
        return;
    }

    // Deshabilitar el botón de "guardar" temporalmente
    const guardarBtn = document.querySelector('#guardar-btn');
    if (guardarBtn) {
        guardarBtn.disabled = true;
    }

    // Enviar los productos seleccionados y sus cantidades para verificar stock
    fetch('../../RosarioFiesta-back/public/verificar-stock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsProductos, cantidades: cantidadesProductos })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Si no hay productos sin stock, proceder a la creación o edición de la promoción
                if (isEditing) {
                    editarPromocionSubmit(idsProductos, cantidadesProductos); // Pasar los productos base y cantidades
                } else {
                    agregarPromocion(idsProductos, cantidadesProductos); // Pasar los productos base y cantidades
                }
            } else {
                // Si hay productos sin stock, mostrar el nombre de los productos sin stock suficiente
                const productosSinStock = data.productosSinStock;
                alert('Algunos productos no tienen stock suficiente para crear/editar la promoción: ' + productosSinStock.map(p => p.nombre).join(', '));
            }
        })
        .catch(error => console.error('Error al verificar el stock:', error))
        .finally(() => {
            // Rehabilitar el botón de "guardar" después de la verificación
            if (guardarBtn) {
                guardarBtn.disabled = false;
            }
        });
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
                                Producto: ${promocion.productosBase[i]} - Cantidad: ${promocion.cantidades[i]}<br>
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
            } else {
                document.getElementById('promocionesBody').innerHTML = '<tr><td colspan="9">No se encontraron promociones activas</td></tr>';
            }
        })
        .catch(error => console.error('Error al cargar las promociones:', error));
}



// Función para agregar promoción
function agregarPromocion(productosBase, cantidades) {
    const formData = new URLSearchParams(new FormData(document.getElementById('formPromociones')));

    // Agregar los productos base y las cantidades al formulario
    productosBase.forEach((productoId, index) => {
        formData.append(`productosBase[]`, productoId);
        formData.append(`cantidad[]`, cantidades[index]);
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
                        cargarProductosBase(productoBase, index);
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


function editarPromocionSubmit(productosBase, cantidades) {
    const form = document.getElementById('formEditarPromociones');

    // Verifica que no se registre más de un evento
    if (!form.hasAttribute('data-event-registered')) {
        form.setAttribute('data-event-registered', 'true');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Obtener los valores de los campos del formulario
            const id_producto = document.getElementById('editIdPromociones').value.trim();
            const nombre = document.getElementById('editNombre').value.trim();
            const precio = parseFloat(document.getElementById('editPrecio').value);
            const estado = document.getElementById('editEstado').value.trim();
            const descripcion = document.getElementById('editDescripcion').value.trim();
            const img = document.getElementById('editImg').value.trim();

            // Validación de datos
            if (!id_producto || !nombre || isNaN(precio) || !estado || !descripcion || !img) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }

            // Construir el objeto de datos para enviar
            const formData = {
                id_producto,
                nombre,
                precio,
                estado_producto: estado,
                descripcion,
                img,
                productosBase,
                cantidad: cantidades
            };

            // Enviar los datos con fetch
            fetch('../../RosarioFiesta-back/public/edit-promociones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert('Promoción actualizada correctamente.');
                        $('#modalEditarPromociones').modal('hide');
                        cargarPromociones(); // Función para recargar las promociones
                    } else {
                        alert('Error al actualizar la promoción: ' + (data.message || 'Error desconocido.'));
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar la promoción:', error);
                    alert('Ocurrió un error al intentar actualizar la promoción. Por favor, inténtalo de nuevo más tarde.');
                });
        });
    }
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