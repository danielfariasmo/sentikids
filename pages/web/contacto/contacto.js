document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact-form");
    const cvForm = document.querySelector(".cv-upload-form");

    function validateInput(input, regex, errorMessage) {
        const value = input.value.trim();
        const errorSpan = input.nextElementSibling;
        if (!regex.test(value)) {
            input.classList.add("error");
            errorSpan.textContent = errorMessage;
            return false;
        } else {
            input.classList.remove("error");
            errorSpan.textContent = "";
            return true;
        }
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll("input, textarea");

        inputs.forEach(input => {
            if (input.type === "text") {
                isValid &= validateInput(input, /^[a-zA-ZÀ-ÿ\s]{3,50}$/, "Ingrese un nombre válido (solo letras y espacios).");
            } else if (input.type === "email") {
                isValid &= validateInput(input, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Ingrese un correo válido.");
            } else if (input.tagName === "TEXTAREA") {
                isValid &= validateInput(input, /^.{10,500}$/, "El mensaje debe tener entre 10 y 500 caracteres.");
            } else if (input.type === "file") {
                if (!input.files.length) {
                    input.classList.add("error");
                    isValid = false;
                } else {
                    input.classList.remove("error");
                }
            }
        });
        return isValid;
    }

    function sendEmail(form, subject) {
        if (!validateForm(form)) return;
        const formData = new FormData(form);

        const mailtoLink = `mailto:campamentosentikids@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent([...formData.entries()].map(([key, val]) => `${key}: ${val}`).join('\n'))}`;
        window.location.href = mailtoLink;
    }

    contactForm.addEventListener("input", (e) => {
        const input = e.target;
        if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
            if (input.type === "text") {
                validateInput(input, /^[a-zA-ZÀ-ÿ\s]{3,50}$/, "Ingrese un nombre válido.");
            } else if (input.type === "email") {
                validateInput(input, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Ingrese un correo válido.");
            } else if (input.tagName === "TEXTAREA") {
                validateInput(input, /^.{10,500}$/, "El mensaje debe tener entre 10 y 500 caracteres.");
            }
        }
    });

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        sendEmail(contactForm, "Consulta de contacto");
    });

    cvForm.addEventListener("input", (e) => {
        const input = e.target;
        if (input.tagName === "INPUT") {
            if (input.type === "text") {
                validateInput(input, /^[a-zA-ZÀ-ÿ\s]{3,50}$/, "Ingrese un nombre válido.");
            } else if (input.type === "email") {
                validateInput(input, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Ingrese un correo válido.");
            }
        }
    });

    cvForm.addEventListener("submit", function (e) {
        e.preventDefault();
        sendEmail(cvForm, "Solicitud de empleo");
    });
});

/**------------------------------------
 * MENU FIJO
 --------------------------------------*/
 const menuFijo = document.querySelector(".menu-fijo");
 const menuPrincipal = document.querySelector(".menu-principal");
 const MARGEN_INICIAL_ESCRITORIO = 48; // Margen inicial para escritorio
 const MARGEN_INICIAL_MOVIL = 202; // Margen inicial para móviles
 
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