/**------------------------------------
 * MENU FIJO
 --------------------------------------*/
 const menuFijo = document.querySelector(".menu-fijo");
 const menuPrincipal = document.querySelector(".menu-principal");
 const MARGEN_INICIAL_ESCRITORIO = 48; // Margen inicial para escritorio
 const MARGEN_INICIAL_MOVIL = 61; // Margen inicial para móviles
 
 // Función para ajustar el margen superior del menú fijo
 function ajustarMargenMenuFijo() {
     const scrollActual = window.scrollY;
 
     // Determinar el margen inicial según el tamaño de la pantalla
     const margenInicial = window.innerWidth <= 768 ? MARGEN_INICIAL_MOVIL : MARGEN_INICIAL_ESCRITORIO;
 
     // Calcula el margen superior basado en el scroll
     let margenSuperior = margenInicial - scrollActual;
 
     // Asegura que el margen no sea menor que 0
     margenSuperior = Math.max(margenSuperior, 0);
 
     // Aplica el margen calculado
     menuFijo.style.marginTop = `${margenSuperior}px`;
 }
 
 // Ajustar el margen inicial en móviles
 if (window.innerWidth <= 768) {
     menuFijo.style.marginTop = `${MARGEN_INICIAL_MOVIL}px`;
 } else {
     menuFijo.style.marginTop = `${MARGEN_INICIAL_ESCRITORIO}px`;
 }
 
 // Escuchar el evento scroll para ajustar el margen
 window.addEventListener("scroll", function () {
     ajustarMargenMenuFijo();
 });
 
 // Escuchar el evento resize para ajustar el margen inicial
 window.addEventListener("resize", function () {
     if (window.innerWidth <= 768) {
         menuFijo.style.marginTop = `${MARGEN_INICIAL_MOVIL}px`;
     } else {
         menuFijo.style.marginTop = `${MARGEN_INICIAL_ESCRITORIO}px`;
     }
 });
 
 /**------------------------------------
 * Menu hamburguesa
 --------------------------------------*/
 document.addEventListener("DOMContentLoaded", function () {
     const botonMenu = document.querySelector(".menu-hamburguesa");
     const menuOpciones = document.querySelector(".opciones");
 
     botonMenu.addEventListener("click", function () {
         menuOpciones.classList.toggle("activo");
     });
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