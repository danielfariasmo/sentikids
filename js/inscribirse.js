document.addEventListener('DOMContentLoaded', () => {

    /* ~~ BOTÓN AÑADIR NIÑO ~~ */
    let childCount = 1;

    document.getElementById("addChildButton").addEventListener("click", function () {
        const childrenContainer = document.getElementById("childrenContainer");
        const firstChild = document.querySelector(".child-block").cloneNode(true);

        childCount++;

        // Actualiza el contenido del nuevo bloque
        firstChild.querySelector("h2").textContent = `Información Niño/a ${childCount}`;
        firstChild.querySelectorAll("[id], [name]").forEach((el) => {
            if (el.id) {
                // Ajusta el id para manejar también los sufijos como "Error"
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
        errorSpan.textContent = mensaje; // Muestra el mensaje
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

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const esValido = [...form.querySelectorAll("input, select")].every(validarElemento);
        if (esValido) {
            mostrarMensaje("Inscripción exitosa", false);
        } else {
            mostrarMensaje("Por favor, corrige los errores antes de continuar.", true);
        }
    });

    function validarElemento(elemento) {
        const valor = elemento.value.trim();
        let esValido = true;

        switch (true) {
            case ["name", "lastName", `childName${childCount}`, `childLastName${childCount}`].includes(elemento.id):
                // Letras y espacios, pueden llevar acentos
                console.log("por aqui esta pasando el id: " + `childName${childCount}`);
                esValido = /^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(valor);
                console.log(esValido);
                break;

            case elemento.id === "dni":
                // Validación para DNI español
                esValido = /^[0-9]{8}[A-Za-z]$/.test(valor) && validarLetraDNI(valor);
                break;

            case elemento.id === "email":
                // Validación para correo electrónico
                esValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor);
                break;

            case elemento.id === "tel":
                // Validación para teléfono (asumiendo un formato de teléfono de España)
                esValido = /^(\+34|0034|34)?[6-9]\d{8}$/.test(valor);
                break;

            case elemento.id === "population":
                // Letras, números, y espacios, con longitud entre 2 y 40
                esValido = /^[a-zA-ZÀ-ÿ0-9\s]{2,40}$/.test(valor);
                break;

            case elemento.id === `childAge${childCount}`:
                // Validar edad específica para este elemento
                esValido = validarEdadAlumno(elemento);
                //errorMensaje = "Por favor, introduce una fecha válida (5 a 12 años).";
                break;

            default:
                // Otros casos comunes o por defecto
                console.warn(`No hay reglas de validación para el campo con id "${elemento.id}"`);
                break;
        }

        const errorSpan = document.getElementById(elemento.id + "Error");
        if (errorSpan) {
            errorSpan.classList.toggle('hidden', esValido);
        }

        return esValido;
    }

    function validarLetraDNI(dni) {
        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        const numero = parseInt(dni.slice(0, 8), 10); // Los primeros 8 caracteres son números
        const letra = dni.slice(-1).toUpperCase(); // Último carácter es la letra
        return letra === letras[numero % 23];
    }

    function validarEdadAlumno(elemento) {
        const fechaNacimiento = new Date(elemento.value.trim());
        if (isNaN(fechaNacimiento)) return false; // Fecha inválida

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