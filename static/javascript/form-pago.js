document.addEventListener('DOMContentLoaded', function() {
    const metodoPagoForm = document.getElementById('metodo-pago-form');
    const formTarjeta = document.getElementById('form-tarjeta');

    // Mostrar formulario de tarjeta si se selecciona Tarjeta de Crédito
    metodoPagoForm.addEventListener('change', function(event) {
        if (event.target.value === 'tarjeta') {
            formTarjeta.style.display = 'block';
        } else {
            formTarjeta.style.display = 'none';
        }
    });

    // Validación y redirección según el método de pago 
    metodoPagoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const metodoSeleccionado = document.querySelector('input[name="metodo_pago"]:checked').value;
        console.log(metodoSeleccionado);
        
        if (metodoSeleccionado === 'tarjeta') {
            // Validar los campos de la tarjeta de crédito antes de continuar
            const numeroTarjeta = document.getElementById('numero-tarjeta').value;
            const fechaVencimiento = document.getElementById('fecha-vencimiento').value;
            const cvv = document.getElementById('cvv').value;
            
            if (validarTarjeta(numeroTarjeta, fechaVencimiento, cvv)) {
                alert("Pago realizado exitosamente con tarjeta.");
                procesarPago(metodoSeleccionado);
            }
        } else if (metodoSeleccionado === 'mercadopago') {
            procesarPago(metodoSeleccionado);
            
        } else if (metodoSeleccionado === 'efectivo') {
            procesarPago(metodoSeleccionado);
            alert("Pago seleccionado en efectivo. Completar el pago en el punto de entrega.");
        }
    });

    function validarTarjeta(numero, fecha, cvv) {
        const tarjetaRegex = /^\d{16}$/;
        const fechaRegex = /^\d{2}\/\d{2}$/;
        const cvvRegex = /^\d{3}$/;

        if (!tarjetaRegex.test(numero)) {
            alert("Número de tarjeta inválido.");
            return false;
        }
        if (!fechaRegex.test(fecha)) {
            alert("Fecha de vencimiento inválida.");
            return false;
        }
        if (!cvvRegex.test(cvv)) {
            alert("CVV inválido.");
            return false;
        }
        return true;
    }

    function procesarPago(metodoSeleccionado) {
        // Obtener el ID del usuario
        fetch('../../RosarioFiesta-back/public/get_user_id.php')  // Llamar al endpoint que devuelve el ID del usuario actual
            .then(response => response.json())
            .then(userData => {  
                const userID = userData.id_usuario;  // Obtener el ID del usuario

                const cartKey = `cart_${userID}`; // Clave específica para el carrito del usuario
                console.log(localStorage.getItem(cartKey));  // Verificar el carrito en localStorage

                // Obtener productos del carrito desde localStorage
                const carrito = JSON.parse(localStorage.getItem(cartKey)) || [];

                if (carrito.length === 0) {
                    alert('El carrito está vacío. No se puede proceder con el pago.');
                    return;
                }

                // Obtener datos del cliente desde localStorage
                const cliente = JSON.parse(localStorage.getItem('cliente'));

                if (!cliente) {
                    alert('Por favor complete los datos del cliente antes de proceder.');
                    return;
                }

                // Preparar los datos para enviar
                const saleData = {  
                    cliente: cliente,
                    productos: carrito,
                    metodo_pago: metodoSeleccionado
                };
                console.log("Datos enviados:", saleData);

                // Enviar los datos al servidor
                fetch('../../RosarioFiesta-back/public/process-sale.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(saleData)  
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('Pago procesado exitosamente.');
                        localStorage.removeItem(cartKey);  // Limpiar carrito
                        window.location.href = '../sections/cartShop.html';  // Redirigir a página de agradecimiento
                    } else {
                        alert('Error al procesar el pago. Intente nuevamente.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Ocurrió un error al procesar el pago.');
                });
            })
            .catch(error => {
                console.error('Error al obtener el ID de usuario:', error);
                alert('No se pudo obtener el ID del usuario.');
            });
    }

    // Obtener productos del carrito desde localStorage
    const productosResumen = document.getElementById('productos-resumen');
    const totalElement = document.getElementById('total');

    // Obtener el ID del usuario
    fetch('../../RosarioFiesta-back/public/get_user_id.php')
        .then(response => response.json())
        .then(userData => {  
            const userID = userData.id_usuario;
            const cartKey = `cart_${userID}`;

            // Cargar productos desde el localStorage
            const carrito = JSON.parse(localStorage.getItem(cartKey)) || [];

            let total = 0;

            carrito.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML =`
                    <td class="table-cell-td">${item.title}</td>
                    <td class="table-cell-td">${item.quantity}</td>
                    <td class="table-cell-td">${item.price.toFixed(2)}</td>
                    <td class="table-cell-td">${(item.price * item.quantity).toFixed(2)}</td>`;
                productosResumen.appendChild(row);
                total += item.price * item.quantity;  // Sumando los precios de los productos
            });
            totalElement.textContent = total.toFixed(2);
        })
        .catch(error => {
            console.error('Error al obtener el carrito:', error);
        });
});
