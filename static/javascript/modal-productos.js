// Manejo del envío del formulario 
document.getElementById('formProducto').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
  
    // Obtener los datos del formulario
    const formData = new FormData(this);
  
    // Convertir los datos a un objeto JSON
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    // Enviar los datos a la API o backend
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
      console.log('Producto agregado:', data);
      alert("Producto agregado correctamente");
    })
    .catch(error => {
      console.error('Error al agregar el producto:', error);
      alert('Hubo un error al agregar el producto. Por favor, intenta nuevamente.');
    });
  });
  function agregarProducto() {
    // Obtener los datos del formulario
    const formData = new FormData(document.getElementById('formProducto'));
  
    // Convertir los datos a un objeto JSON
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    // Enviar los datos al backend
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
          cargarProductos(); // Recargar la lista de productos
        } else {
          alert('Error al agregar el producto.');
        }
      })
      .catch(error => {
        console.error('Error al agregar el producto:', error);
        alert('Hubo un error al agregar el producto. Por favor, intenta nuevamente.');
      });
  }