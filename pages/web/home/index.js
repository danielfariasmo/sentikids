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

// Datos para el hero (título, subtítulo, texto e imagen)
const heroData = [
    {
        title: "JUGAMOS Y APRENDEMOS",
        subtitle: "¿Quién dijo que Educar tiene que ser Aburrido? Campamento Bilingüe",
        text: "El campamento SentiKids con actividades bilingües y con un enfoque Montessori. Estimula su curiosidad y creatividad.",
        image: "../../../assets/img/buenaCalidad2.jpg" // Ruta relativa a la imagen
    },
    {
        title: "Explora nuevas oportunidades",
        subtitle: "Crecimiento y desarrollo",
        text: "Accede a recursos exclusivos y herramientas que potenciarán tu negocio.",
        image: "../../../assets/img/buenaCalidad3.jpg" // Ruta relativa a la imagen
    },
    {
        title: "Únete a nuestra comunidad",
        subtitle: "Colaboración y networking",
        text: "Conecta con profesionales y comparte experiencias para crecer juntos.",
        image: "../../../assets/img/buenaCalidad.jpg" // Ruta relativa a la imagen
    }
];

// Elementos del DOM
const heroTitle = document.getElementById("hero-title");
const heroSubtitle = document.getElementById("hero-subtitle");
const heroText = document.getElementById("hero-text");
const heroHome = document.querySelector(".hero-home");
const circleButtons = document.querySelectorAll(".circle-button");

// Función para cambiar el contenido del hero
function changeHeroContent(index) {
    const data = heroData[index];
    heroTitle.textContent = data.title;
    heroSubtitle.textContent = data.subtitle;
    heroText.textContent = data.text;
    heroHome.style.backgroundImage = `url('${data.image}')`;

    // Actualizar estado de los botones
    circleButtons.forEach((button, i) => {
        if (i === index) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// Event listeners para los botones circulares
circleButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        currentIndex = index; // Actualizar el índice actual
        changeHeroContent(currentIndex);
        resetInterval(); // Reiniciar el intervalo
    });
});

// Variables para la animación automática
let currentIndex = 0;
let interval;

// Función para iniciar la animación automática
function startInterval() {
    interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % heroData.length; // Cambiar al siguiente índice
        changeHeroContent(currentIndex);
    }, 5000); // Cambiar cada 5 segundos (5000 ms)
}

// Función para reiniciar el intervalo
function resetInterval() {
    clearInterval(interval); // Detener el intervalo actual
    startInterval(); // Iniciar un nuevo intervalo
}

// Inicializar con el primer conjunto de datos
changeHeroContent(currentIndex);
startInterval(); // Iniciar la animación automática
/**------------------------------------
* PREGUNTAS FRECUENTES
--------------------------------------*/
document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});


/**reviews */

jQuery(document).ready(function ($) {
    "use strict";
    //  TESTIMONIALS CAROUSEL HOOK
    $('#customers-testimonials').owlCarousel({
        loop: true,
        center: true,
        items: 3,
        margin: 0,
        autoplay: true,
        dots: true,
        autoplayTimeout: 8500,
        smartSpeed: 450,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1170: {
                items: 3
            }
        }
    });
});