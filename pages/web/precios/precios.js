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

/**------------------------------------
* PREGUNTAS FRECUENTES
--------------------------------------*/
document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});