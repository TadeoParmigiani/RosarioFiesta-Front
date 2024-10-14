document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-grid");
    const totalPrice = document.getElementById("total-price");
    const proceedButton = document.getElementById("btn-proceder-pago");
    const resetButton = document.getElementById("reiniciar");

    // Función para actualizar el total y habilitar/deshabilitar el botón de proceder al pago
    function updateTotals() {
        const cartItems = cartItemsContainer.querySelectorAll(".cart-item");
        let totalPr = 0;
        cartItems.forEach(item => {
            const quantity = parseInt(item.querySelector("input[name='quantity']").value);
            const price = parseFloat(item.querySelector(".cart-price").textContent.replace("$", ""));
            totalPr += quantity * price;
        });
        totalPrice.textContent = totalPr.toFixed(2);

        // Deshabilitar el botón de proceder al pago si no hay items en el carrito
        // proceedButton.disabled = cartItems.length === 0;
    }

    // Función para cargar el carrito desde localStorage
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = ""; // Limpiar el contenedor antes de cargar los items
        cart.forEach(product => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="cart-img">
                <div class="cart-info">
                    <h3 class="cart-title">${product.title}</h3>
                    <p class="cart-description">${product.description}</p>
                    <div class="cart-quantity">
                        <label for="quantity-${product.id}">Cantidad:</label>
                        <input type="number" id="quantity-${product.id}" name="quantity" value="1" min="1">
                    </div>
                    <p class="cart-price">$${product.price.toFixed(2)}</p>
                </div>
                <button class="btn-remove">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);

            // Actualizar totales y carrito al cambiar cantidad o eliminar producto
            const quantityInput = cartItem.querySelector("input[name='quantity']");
            const removeButton = cartItem.querySelector(".btn-remove");

            quantityInput.addEventListener("change", () => {
                product.quantity = parseInt(quantityInput.value);  // Actualiza la cantidad
                updateCartStorage();
                updateTotals();
            });

            removeButton.addEventListener("click", () => {
                removeFromCart(product.id);
                cartItem.remove();
                updateTotals();
            });
        });
        updateTotals(); // Actualizar los totales después de cargar el carrito
        console.log("Datos a enviar:", cart);
    }

    // Función para eliminar un producto del carrito y actualizar localStorage
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        // Filtrar el array de productos para eliminar el producto con el ID correspondiente
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Función para actualizar el carrito en localStorage
    function updateCartStorage() {
        const cartItems = cartItemsContainer.querySelectorAll(".cart-item");
        const cart = [];
        cartItems.forEach(item => {
            const id = item.querySelector("input[name='quantity']").id.split('-')[1];
            const title = item.querySelector(".cart-title").textContent;
            const description = item.querySelector(".cart-description").textContent;
            const price = parseFloat(item.querySelector(".cart-price").textContent.replace("$", ""));
            const image = item.querySelector(".cart-img").src;
            const quantity = parseInt(item.querySelector("input[name='quantity']").value);

            cart.push({ id, title, description, price, image, quantity});
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Restablecer el carrito y actualizar la interfaz
    resetButton.addEventListener("click", () => {
        localStorage.removeItem("cart");
        cartItemsContainer.innerHTML = "";
        updateTotals();
    });

    // Redirigir al formulario de pago si hay productos en el carrito
    proceedButton.addEventListener("click", function() {
        const cartItems = document.querySelectorAll("#cart-grid .cart-item");
        if (cartItems.length > 0) {
            window.location.href = '../sections/form-cliente.html';
        } else {
            alert("El carrito está vacío. Añade productos al carrito antes de proceder al pago.");
        }
    });

    function addToCard(product) {
        // Obtener el carrito del localStorage o inicializarlo como un array vacío
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.find(item => item.id === product.id);
    
        if (existingProduct) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            existingProduct.quantity += 1;
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad inicial de 1
            product.quantity = 1;
            cart.push(product);
        }
    
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    
    loadCart();  // Cargar el carrito cuando la página se carga
});
