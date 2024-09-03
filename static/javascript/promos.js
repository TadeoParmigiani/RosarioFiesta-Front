
document.addEventListener("DOMContentLoaded", () => {
    const products = [
        {
            id: 1,
            imgSrc: "../static/img/producto1.jpg",
            title: "Promo 1",
            description: "Descripción de la promoción 1",
            price: 10.00,
            link: "#promo1"
        },
        {
            id: 2,
            imgSrc: "../static/img/promo snacks 2.png",
            title: "Promo 2",
            description: "Descripción de la promoción 2",
            price: 20.00,
            link: "#promo2"
        },
        {
            id: 3,
            imgSrc: "../static/img/promo snacks 2.png",
            title: "Promo 3",
            description: "Descripción de la promoción 2",
            price: 13.00,
            link: "#promo2"
        },

        // Agregar más productos 
    ];

    const productGrid = document.getElementById("product-grid");

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.imgSrc}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <button class="btn add-to-cart" data-id="${product.id}" data-title="${product.title}" data-description="${product.description}" data-price="${product.price}" data-image="${product.imgSrc}">Agregar al carrito</button>
            </div>
        `;

        productGrid.appendChild(productCard);
    });

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

            // Guardar en localStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));

            alert(`${product.title} ha sido agregado al carrito.`);
        }
    });
});