var swiper = new Swiper(".slide-content", {
    slidesPerView: "auto",  // Cambia de 3 a "auto" para respetar el tamaño de las tarjetas
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints:{
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: "auto",
        },
    },
});
//MENÚ
const menuFijo = document.querySelector(".menu-fijo");
menuFijo.style.marginTop = "48px";
const MARGEN_INICIAL = 48;

window.addEventListener("scroll", function () {
    const scrollActual = window.scrollY;

    // Calcula el margen superior basado en el scroll
    let margenSuperior = MARGEN_INICIAL - scrollActual;

    // Asegura que el margen no sea menor que 0
    margenSuperior = Math.max(margenSuperior, 0);

    // Aplica el margen calculado
    menuFijo.style.marginTop = `${margenSuperior}px`;
});

//EMPRESAS COLABORADORAS
document.addEventListener("DOMContentLoaded", function () {
    var swiperEmpresas = new Swiper(".empresas-swiper", {
        loop: true,
        autoplay: {
            delay: 4000, // Cambia la imagen cada 4s
            disableOnInteraction: false,
        },
        slidesPerView: "auto", // Ajusta automáticamente según el tamaño
        spaceBetween: 20,
        centeredSlides: true, // Centra las imágenes en el carrusel
    });
});
