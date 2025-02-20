document.addEventListener("DOMContentLoaded", function () {
    const menuFijo = document.querySelector(".menu-fijo");
    menuFijo.style.marginTop = "60px";
    const MARGEN_INICIAL = 60;

    window.addEventListener("scroll", function () {
        const scrollActual = window.scrollY;

        // Calcula el margen superior basado en el scroll
        let margenSuperior = MARGEN_INICIAL - scrollActual;

        // Asegura que el margen no sea menor que 0
        margenSuperior = Math.max(margenSuperior, 0);

        // Aplica el margen calculado
        menuFijo.style.marginTop = `${margenSuperior}px`;
    });
});