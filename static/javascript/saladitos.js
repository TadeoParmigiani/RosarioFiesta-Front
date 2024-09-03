document.addEventListener("DOMContentLoaded", () => {
    const products = [
        {
            imgSrc: "",
            title: "Promo 1",
            description: "Descripción de la promoción 1",
            link: "#promo1"
        },
        {
            imgSrc: "",
            title: "Promo 2",
            description: "Descripción de la promoción 2",
            link: "#promo2"
        },
        // Agrega más productos según sea necesario
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
                <a href="${product.link}" class="btn">Agregar al carrito</a>
            </div>
        `;

        productGrid.appendChild(productCard);
    });
});