window.addEventListener('scroll', function() {
    var header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const images = [
      "../static/img/promo hamburguesa 1.png",
      "../static/img/promo snacks.png",
      "../static/img/promo hamburguesa 2.png",
      "../static/img/promo snacks 2.png",
      "../static/img/promo snacks 2.png",
      "../static/img/promo hamburguesa 2.png",
      "../static/img/promo snacks.png",
      "../static/img/promo hamburguesa 1.png",
    ];

    const carouselContainer = document.querySelector(".carousel-container");
    let currentIndex = 0;

    // Mostrar las primeras 4 imágenes al cargar
    for (let i = 0; i < 4; i++) {
      const div = document.createElement("div");
      div.classList.add("promo-item", "carousel-item");
      div.innerHTML = `<img src="${images[i]}" alt="Promoción ${i + 1}" class="promo-img">`;
      carouselContainer.appendChild(div);
    }

    function updateCarousel() {
      // Eliminar la primera imagen
      const firstItem = document.querySelector(".carousel-item");
      firstItem.remove();

      // Agregar la siguiente imagen al final
      const nextImageIndex = (currentIndex + 4) % images.length;
      const div = document.createElement("div");
      div.classList.add("promo-item", "carousel-item");
      div.innerHTML = `<img src="${images[nextImageIndex]}" alt="Promoción ${nextImageIndex + 1}" class="promo-img">`;
      carouselContainer.appendChild(div);

      // Actualizar el índice
      currentIndex = (currentIndex + 1) % images.length;
    }

    // Cambiar una imagen cada 3 segundos
    setInterval(updateCarousel, 3000);
  });