document.addEventListener('DOMContentLoaded', function () {
  cargarProductos();

  // Manejo del envío del formulario de agregar producto
  document.getElementById('formProducto').addEventListener('submit', function (event) {
    event.preventDefault();
    agregarProducto();
  });

  // Manejo del envío del formulario de editar producto
  document.getElementById('formEditarProducto').addEventListener('submit', function (event) {
    event.preventDefault();
    
  });
});
let tablaProductos
function cargarProductos() {
    fetch('../../RosarioFiesta-back/public/get-product.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let productosHTML = '';
                data.productos.forEach(producto => {
                    productosHTML += `
                        <tr>
                            <td>${producto.id_producto}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.precio}</td>
                            <td>${producto.stock}</td>
                            <td>${producto.estado_producto}</td>
                            <td><img src="${producto.img}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
                            <td>${producto.id_categoria}</td>
                            <td>${producto.descripcion}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="editarProducto(${producto.id_producto})">Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });

              // Limpiar el cuerpo de la tabla
              const tablaBody = document.getElementById('productosBody');
              tablaBody.innerHTML = productosHTML;

                // Destruir la instancia anterior de DataTable (si existe)
                if (tablaProductos) {
                    tablaProductos.destroy();
                }

                // Inicializar DataTables y guardar la referencia
                tablaProductos = $('#tablaProductos').DataTable({
                    responsive: true,
                    paging: true,
                    searching: true,
                    lengthChange: true,
                    columnDefs: [
                      { 
                          targets: [8],  // Asegura que la columna "Estado" sea buscable
                          searchable: false
                      }
                  ]
                });
            } else {
                // Si no hay productos, mostrar un mensaje en la tabla
                document.getElementById('productosBody').innerHTML = '<tr><td colspan="9">No se encontraron productos activos</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            alert('Error al cargar los productos');
        });
}

function eliminarProducto(idProducto) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch('../../RosarioFiesta-back/public/delete-product.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ 'id_producto': idProducto })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Producto eliminado correctamente.');
              cargarProductos(); 
          } else {
              alert('Error al eliminar el producto.');
          }
      })
      .catch(error => console.error('Error al eliminar el producto:', error));
  }
}

function editarProducto(idProducto) {
  fetch(`../../RosarioFiesta-back/public/get-product.php?id_producto=${idProducto}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              const producto = data.productos.find(p => p.id_producto == idProducto);
              if (producto) {
                  document.getElementById('editIdProducto').value = producto.id_producto;
                  document.getElementById('editNombre').value = producto.nombre;
                  document.getElementById('editPrecio').value = producto.precio;
                  document.getElementById('editStock').value = producto.stock;
                  document.getElementById('editEstado').value = producto.estado_producto;
                  document.getElementById('editDescripcion').value = producto.descripcion;
                  document.getElementById('editCategoria').value = producto.id_categoria;
                  document.getElementById('editImg').value = producto.img;

                  $('#modalEditarProducto').modal('show');
              } else {
                  alert('Producto no encontrado.');
              }
          } else {
              alert('Error al cargar los datos del producto.');
          }
      })
      .catch(error => console.error('Error al cargar el producto:', error));
}

document.getElementById('formEditarProducto').addEventListener('submit', function (event) {
  event.preventDefault();
  
  const idProducto = document.getElementById('editIdProducto').value;
  const nombre = document.getElementById('editNombre').value;
  const precio = document.getElementById('editPrecio').value;
  const stock = document.getElementById('editStock').value;
  const estado = document.getElementById('editEstado').value;
  const descripcion = document.getElementById('editDescripcion').value;
  const idCategoria = document.getElementById('editCategoria').value;
  const img = document.getElementById('editImg').value;

  fetch('../../RosarioFiesta-back/public/edit-product.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
          'id_producto': idProducto,
          'nombre': nombre,
          'precio': precio,
          'stock': stock,
          'estado': estado,
          'descripcion': descripcion,
          'id_categoria': idCategoria,
          'img' : img
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('Producto actualizado correctamente.');
          
          cargarProductos();
          $('#modalEditarProducto').modal('hide');
      } else {
          alert('Error al actualizar el producto.');
      }
  })
  .catch(error => console.error('Error al actualizar el producto:', error));
});

function agregarProducto() {
  // Obtengo los datos del formulario
  const formData = new FormData(document.getElementById('formProducto'));

  // Convierto los datos a un objeto JSON
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Envio los datos al backend
  fetch('../../RosarioFiesta-back/public/add-product.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        alert("Producto agregado correctamente");
        
        cargarProductos(); 
      } else {
        alert('Error al agregar el producto.');
      }
    })
    .catch(error => {
      console.error('Error al agregar el producto:', error);
      alert('Hubo un error al agregar el producto. Por favor, intenta nuevamente.');
    });
}
