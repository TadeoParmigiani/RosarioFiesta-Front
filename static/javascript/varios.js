document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");

    
    fetch(`../../RosarioFiesta-back/public/get-product-activo.php?categoria=3`) 
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const products = data.productos; 

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
            } else {
                productGrid.innerHTML = '<p>No se encontraron productos activos.</p>';
            }
        })
        .catch(error => console.error('Error al obtener productos activos:', error));

    
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
                image: productImage
            };

    
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));

            alert(`${product.title} ha sido agregado al carrito.`);
        }
    });
});
