document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-grid");
    const totalPrice = document.getElementById("total-price");
    const proceedButton = document.getElementById("btn-proceder-pago");
    const resetButton = document.getElementById("reiniciar");

    // Obtener el userID desde la sesión PHP
    fetch('../../RosarioFiesta-back/public/get_user_id.php')
        .then(response => response.json())
        .then(data => {
            const userID = data.id_usuario;
            const cartKey = `cart_${userID}`;

            // Obtener los productos y su stock desde el servidor
            fetch('../../RosarioFiesta-back/public/get_product_y_promos.php')
                .then(response => response.json())
                .then(productData => {
                    if (productData.success) {
                        const products = productData.productos;

                        // Mapa de productos por ID para acceso rápido al stock
                        const productStockMap = {};
                        products.forEach(product => {
                            productStockMap[product.id_producto] = product.stock;
                        });

                        // Función para actualizar el total
                        function updateTotals() {
                            const cartItems = cartItemsContainer.querySelectorAll(".cart-item");
                            let totalPr = 0;
                            cartItems.forEach(item => {
                                const quantity = parseInt(item.querySelector("input[name='quantity']").value);
                                const price = parseFloat(item.querySelector(".cart-price").textContent.replace("$", ""));
                                totalPr += quantity * price;
                            });
                            totalPrice.textContent = totalPr.toFixed(2);
                        }

                        // Función para cargar el carrito desde localStorage
                        function loadCart() {
                            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
                            cartItemsContainer.innerHTML = ""; 
                            cart.forEach(product => {
                                const cartItem = document.createElement("div");
                                cartItem.classList.add("cart-item");

                                // Limitar cantidad al stock disponible si existe en el mapa de productos
                                const maxStock = productStockMap[product.id] || 0;
                                
                                cartItem.innerHTML = `
                                    <img src="${product.image}" alt="${product.title}" class="cart-img">
                                    <div class="cart-info">
                                        <h3 class="cart-title">${product.title}</h3>
                                        <p class="cart-description">${product.description}</p>
                                        <div class="cart-quantity">
                                            <label for="quantity-${product.id}">Cantidad:</label>
                                            <input type="number" id="quantity-${product.id}" name="quantity" value="${product.quantity}" min="1" max="${maxStock}">
                                        </div>
                                        <p class="cart-price">$${product.price}</p>
                                    </div>
                                    <button class="btn-remove">Eliminar</button>
                                `;
                                cartItem.setAttribute("data-id", product.id);
                                cartItemsContainer.appendChild(cartItem);

                                const quantityInput = cartItem.querySelector("input[name='quantity']");
                                const removeButton = cartItem.querySelector(".btn-remove");

                                quantityInput.addEventListener("change", () => {
                                    const selectedQuantity = parseInt(quantityInput.value);
                                    if (selectedQuantity > maxStock) {
                                        alert(`Solo hay ${maxStock} unidades disponibles de ${product.title}.`);
                                        
                                    } else {
                                        product.quantity = selectedQuantity;
                                        updateCartStorage();
                                        updateTotals();
                                    }
                                });

                                removeButton.addEventListener("click", () => {
                                    removeFromCart(product.id);
                                    cartItem.remove();
                                    updateTotals();
                                });
                            });
                            updateTotals();
                        }

                        // Función para eliminar un producto del carrito
                        function removeFromCart(productId) {
                            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
                            const updatedCart = cart.filter(item => item.id !== productId);
                            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
                        }

                        // Función para actualizar el carrito en localStorage
                        function updateCartStorage() {
                            const cart = [];
                            cartItemsContainer.querySelectorAll(".cart-item").forEach(item => {
                                const id = item.getAttribute("data-id");
                                const title = item.querySelector(".cart-title").textContent
                                const quantity = item.querySelector("input[name='quantity']").value;
                                const price = item.querySelector(".cart-price").textContent;
                                cart.push({ id, title, quantity, price });
                            });
                            localStorage.setItem(cartKey, JSON.stringify(cart));
                            console.log(localStorage.getItem(cart));
                        }
                        // Cargar el carrito desde localStorage al cargar la página
                        loadCart();
                        console.log(localStorage.getItem(cartKey));

                        // Evento para proceder al pago
                        proceedButton.addEventListener("click", () => {
                            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
                            if (cart.length > 0) {
                                window.location.href = '../sections/form-cliente.html';
                            } else {
                                alert("El carrito está vacío. Agrega productos antes de proceder al pago.");
                            }
                        });

                        // Evento para reiniciar el carrito
                        resetButton.addEventListener("click", () => {
                            localStorage.removeItem(cartKey);
                            loadCart();
                            updateTotals();
                        });
                    } else {
                        alert("Error al cargar los productos.");
                    }
                });
        });
});
