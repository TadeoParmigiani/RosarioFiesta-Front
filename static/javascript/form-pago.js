document.addEventListener('DOMContentLoaded', function() {
    const metodoPagoForm = document.getElementById('metodo-pago-form');
    const formTarjeta = document.getElementById('form-tarjeta');
    const formMercadoPago = document.getElementById('form-mercadopago');

    metodoPagoForm.addEventListener('change', function(event) {
        const metodoSeleccionado = document.querySelector('input[name="metodo_pago"]:checked').value;

        if (metodoSeleccionado === 'tarjeta') {
            formTarjeta.style.display = 'block';
            formMercadoPago.style.display = 'none';
        } else if (metodoSeleccionado === 'mercadopago') {
            formTarjeta.style.display = 'none';
            formMercadoPago.style.display = 'block';
        } else {
            formTarjeta.style.display = 'none';
            formMercadoPago.style.display = 'none';
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
            alert("Por favor, envíe el comprobante por WhatsApp para completar el pago.");
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
                const carritoLimpio = carrito.map(item => ({
                    ...item,
                    price: typeof item.price === 'string' 
                        ? Number(item.price.replace('$', '').trim()) 
                        : Number(item.price) // Si ya es número, úsalo directamente
                }));
                

                const saleData = {
                    cliente: cliente,
                    productos: carritoLimpio,
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
            console.log(localStorage.getItem(cartKey));

            carrito.forEach(item => {
                const price = typeof item.price === 'string' 
                ? Number(item.price.replace('$', '').trim()) 
                : Number(item.price);
                const quantity = Number(item.quantity);
                const subtotal = price * quantity;
                const row = document.createElement('tr');
                row.innerHTML =`
                   <td class="table-cell-td">${item.title}</td>
                <td class="table-cell-td">${quantity}</td>
                <td class="table-cell-td">$${price.toFixed(2)}</td>
                <td class="table-cell-td">$${subtotal.toFixed(2)}</td>`;
                    productosResumen.appendChild(row);
                    total += subtotal;  // Sumando los precios de los productos
            });
            totalElement.textContent = `$${total.toFixed(2)}`;
            console.log(localStorage.getItem(cartKey));

        })
        .catch(error => {
            console.error('Error al obtener el carrito:', error);
        });
});