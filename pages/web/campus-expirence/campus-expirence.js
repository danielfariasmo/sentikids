/**------------------------------------
 * MENU FIJO
 --------------------------------------*/
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

// MENÚ HAMBURGUESA
const hamburguesa = document.querySelector(".hamburguesa");
const menuMovil = document.querySelector(".menu-movil");

hamburguesa.addEventListener("click", () => {
    menuMovil.classList.toggle("visible");
});

// Cerrar menú al hacer clic en un enlace
const enlacesMovil = document.querySelectorAll(".opciones-movil a");
enlacesMovil.forEach(enlace => {
    enlace.addEventListener("click", () => {
        menuMovil.classList.remove("visible");
    });
});