/* =========================================
   CARRUSEL AUTOMÁTICO
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".carousel-track");
    const images = document.querySelectorAll(".carousel-track img");
    const dotsContainer = document.querySelector(".carousel-dots");
    const carousel = document.querySelector(".carousel");

    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");


    if (!track || images.length === 0) {
        return;
    }


    let index = 0;
    let interval;



    // Crear puntos automáticamente
    images.forEach((img, i) => {

        const dot = document.createElement("button");

        dot.setAttribute("aria-label", `Imagen ${i + 1}`);


        dot.addEventListener("click", () => {

            index = i;

            updateCarousel();

            restartAutoPlay();

        });


        dotsContainer.appendChild(dot);

    });



    const dots = document.querySelectorAll(".carousel-dots button");



    // Actualizar imagen
    function updateCarousel() {

        track.style.transform = `translateX(-${index * 100}%)`;


        dots.forEach(dot => {
            dot.classList.remove("active");
        });


        if (dots[index]) {
            dots[index].classList.add("active");
        }

    }



    // Siguiente
    function nextImage() {

        index++;

        if (index >= images.length) {

            index = 0;

        }

        updateCarousel();

    }



    // Anterior
    function prevImage() {

        index--;

        if (index < 0) {

            index = images.length - 1;

        }

        updateCarousel();

    }



    // Automático cada 2 segundos
    function startAutoPlay() {

        interval = setInterval(() => {

            nextImage();

        }, 2000);

    }



    // Reiniciar contador
    function restartAutoPlay() {

        clearInterval(interval);

        startAutoPlay();

    }



    // Flecha derecha
    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            nextImage();

            restartAutoPlay();

        });

    }



    // Flecha izquierda
    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            prevImage();

            restartAutoPlay();

        });

    }



    // Pausar al pasar mouse
    if (carousel) {

        carousel.addEventListener("mouseenter", () => {

            clearInterval(interval);

        });


        carousel.addEventListener("mouseleave", () => {

            startAutoPlay();

        });

    }



    // Inicializar
    updateCarousel();

    startAutoPlay();


});