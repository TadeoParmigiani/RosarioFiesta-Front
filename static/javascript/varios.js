document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");

    // Obtener el userID desde la sesión PHP
    fetch('../../RosarioFiesta-back/public/get_user_id.php')
        .then(response => response.json())
        .then(data => {
            const userID = data.id_usuario;
            const cartKey = `cart_${userID}`; // Clave específica para el carrito del usuario

            // Solicitud fetch para obtener los productos activos de la categoría 2
            fetch(`../../RosarioFiesta-back/public/get-product-activo.php?categoria=3`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const products = data.productos;

                        // Generar cada tarjeta de producto
                        products.forEach(product => {
                            const productCard = document.createElement("div");
                            productCard.classList.add("product-card");

                            productCard.innerHTML = `
                                <img src="${product.img}" alt="${product.nombre}" class="product-img">
                                <div class="product-info">
                                    <h3 class="product-title">${product.nombre}</h3>
                                    <p class="product-description">${product.descripcion}</p>
                                    <button class="btn add-to-cart" data-id="${product.id_producto}" data-title="${product.nombre}" data-description="${product.descripcion}" data-price="${product.precio}" data-image="${product.img}">Agregar al carrito</button>
                                </div>
                            `;

                            productGrid.appendChild(productCard);
                        });

                        // Deshabilitar los botones "Agregar al carrito" si no está autenticado
                        fetch('../../RosarioFiesta-back/public/check_session.php')
                            .then(response => response.json())
                            .then(data => {
                                const addToCartButtons = document.querySelectorAll('.btn.add-to-cart');
                                addToCartButtons.forEach(button => {
                                    if (data.authenticated) {
                                        button.style.pointerEvents = 'auto';
                                    } else {
                                        button.style.pointerEvents = 'none';
                                    }
                                });
                            })
                            .catch(error => console.error('Error al verificar la autenticación:', error));
                    } else {
                        productGrid.innerHTML = '<p>No se encontraron productos activos.</p>';
                    }
                })
                .catch(error => console.error('Error al obtener productos activos:', error));

            // Agregar producto al carrito al hacer clic en "Agregar al carrito"
            document.addEventListener("click", (event) => {
                if (event.target.classList.contains("add-to-cart")) {
                    const productElement = event.target;
                    const productId = productElement.getAttribute("data-id");
                    const productTitle = productElement.getAttribute("data-title");
                    const productDescription = productElement.getAttribute("data-description");
                    const productPrice = productElement.getAttribute("data-price");
                    const productImage = productElement.getAttribute("data-image");

                    const product = {
                        id: productId,
                        title: productTitle,
                        description: productDescription,
                        price: parseFloat(productPrice),
                        image: productImage,
                        quantity: 1
                    };

                    // Obtener el carrito actual del usuario
                    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

                    // Verificar si el producto ya existe en el carrito
                    const existingProduct = cart.find(item => item.id === product.id);
                    if (existingProduct) {
                        // Si existe, incrementar la cantidad
                        existingProduct.quantity += 1;
                    } else {
                        // Si no existe, agregar el producto con cantidad inicial de 1
                        cart.push(product);
                    }

                    // Guardar el carrito actualizado en localStorage
                    localStorage.setItem(cartKey, JSON.stringify(cart));

                    alert(`${product.title} ha sido agregado al carrito.`);
                }
            });
        })
        .catch(error => console.error('Error al obtener el userID:', error));
});
