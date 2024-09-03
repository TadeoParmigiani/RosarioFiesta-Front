document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-grid");
    const totalPrice = document.getElementById("total-price");
    const buyButton = document.querySelector(".btn:not(#reiniciar)");
    const resetButton = document.getElementById("reiniciar");

    function updateTotals() {
        const cartItems = cartItemsContainer.querySelectorAll(".cart-item");
        let totalPr = 0;
        cartItems.forEach(item => {
            const quantity = parseInt(item.querySelector("input[name='quantity']").value);
            const price = parseFloat(item.querySelector(".cart-price").textContent.replace("$", ""));
            totalPr += quantity * price;
        });
        totalPrice.textContent = totalPr.toFixed(2);
        buyButton.disabled = cartItems.length === 0;
    }

    function loadCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
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

            const quantityInput = cartItem.querySelector("input[name='quantity']");
            const removeButton = cartItem.querySelector(".btn-remove");

            quantityInput.addEventListener("change", updateTotals);
            removeButton.addEventListener("click", () => {
                cartItem.remove();
                updateCartStorage();
                updateTotals();
            });
        });
        updateTotals();
    }

    function updateCartStorage() {
        const cartItems = cartItemsContainer.querySelectorAll(".cart-item");
        const cart = [];
        cartItems.forEach(item => {
            const id = item.querySelector("input[name='quantity']").id.split('-')[1];
            const title = item.querySelector(".cart-title").textContent;
            const description = item.querySelector(".cart-description").textContent;
            const price = parseFloat(item.querySelector(".cart-price").textContent.replace("$", ""));
            const image = item.querySelector(".cart-img").src;
            cart.push({ id, title, description, price, image });
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    resetButton.addEventListener("click", () => {
        localStorage.removeItem("cart");
        cartItemsContainer.innerHTML = "";
        updateTotals();
    });

    loadCart();
});