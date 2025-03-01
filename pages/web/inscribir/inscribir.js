document.addEventListener('DOMContentLoaded', () => {

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

    //FIN MENÚ

    let childCount = 1;

    // Botón para añadir más niños
    document.getElementById("addChildButton").addEventListener("click", function () {
        const childrenContainer = document.getElementById("childrenContainer");
        const firstChild = document.querySelector(".child-block").cloneNode(true);

        childCount++;

        // Actualiza el contenido del nuevo bloque
        firstChild.querySelector("h2").textContent = `Información Niño/a ${childCount}`;
        firstChild.querySelectorAll("[id], [name]").forEach((el) => {
            if (el.id) {
                el.id = el.id.replace(/(\d+)(Error)?$/, `${childCount}$2`);
            }
            if (el.name) {
                el.name = el.name.replace(/\[\d*]/, `[${childCount}]`);
            }
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.value = ""; // Limpia los campos
            }
        });

        // Oculta los mensajes de error
        firstChild.querySelectorAll(".error").forEach((el) => el.classList.add("hidden"));

        childrenContainer.appendChild(firstChild);
    });

    // Mensajes de validación
    function mostrarMensaje(mensaje, esError) {
        const errorSpan = document.getElementById("inscribirseError");
        errorSpan.textContent = mensaje;
        if (esError) {
            errorSpan.classList.remove("hidden", "success");
            errorSpan.classList.add("error");
        } else {
            errorSpan.classList.remove("hidden", "error");
            errorSpan.classList.add("success");
        }
    }

    // Formulario
    const form = document.getElementById('userForm');

    // Validación al cambiar de elemento
    form.addEventListener('focusout', (event) => {
        validarElemento(event.target);
    });

    // Envío del formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const esValido = [...form.querySelectorAll("input, select")].every(validarElemento);
        if (esValido) {
            const formData = new FormData(form);
            formData.append("funcion", "inscribir");

            fetch("inscribir.php", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        mostrarMensaje(data.message, false);
                        // Redirigir o realizar otras acciones
                    } else {
                        mostrarMensaje(data.message, true);
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud:", error);
                    mostrarMensaje("Error en la solicitud. Consulta la consola para más detalles.", true);
                });
        } else {
            mostrarMensaje("Por favor, corrige los errores antes de continuar.", true);
        }
    });

    // Validación de campos
    function validarElemento(elemento) {
        const valor = elemento.value.trim();
        let esValido = true;

        switch (true) {
            case ["name", "lastName", `childName${childCount}`, `childLastName${childCount}`].includes(elemento.id):
                esValido = /^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(valor);
                break;
            case elemento.id === "dni":
                esValido = /^[0-9]{8}[A-Za-z]$/.test(valor) && validarLetraDNI(valor);
                break;
            case elemento.id === "email":
                esValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor);
                break;
            case elemento.id === "tel":
                esValido = /^(\+34|0034|34)?[6-9]\d{8}$/.test(valor);
                break;
            case elemento.id === "population":
                esValido = /^[a-zA-ZÀ-ÿ0-9\s]{2,40}$/.test(valor);
                break;
            case elemento.id === `childAge${childCount}`:
                esValido = validarEdadAlumno(elemento);
                break;
            case elemento.id === "user":
                esValido = /^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(valor); // Letras y espacios, pueden llevar acentos
                break;
            case elemento.id === "password":
                esValido = valor !== "";
                break;
            default:
                console.warn(`No hay reglas de validación para el campo con id "${elemento.id}"`);
                break;
        }

        const errorSpan = document.getElementById(elemento.id + "Error");
        if (errorSpan) {
            // Si es inválido, se añade "visible"; si es válido, se remueve.
            errorSpan.classList.toggle('visible', !esValido);
        }

        return esValido;
    }


    // Validar letra del DNI
    function validarLetraDNI(dni) {
        const regex = /^\d{8}[A-Z]$/;
        return regex.test(dni);
    }

    // Validar edad del alumno
    function validarEdadAlumno(elemento) {
        const fechaNacimiento = new Date(elemento.value.trim());
        if (isNaN(fechaNacimiento)) return false;

        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

        if (
            hoy.getMonth() < fechaNacimiento.getMonth() ||
            (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())
        ) {
            edad--;
        }

        const esValido = edad >= 5 && edad <= 12;
        document.getElementById(elemento.id + "Error")?.classList.toggle('hidden', esValido);
        return esValido;
    }
});