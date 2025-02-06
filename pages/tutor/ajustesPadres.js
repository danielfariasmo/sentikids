document.addEventListener('DOMContentLoaded', () => {

    // Función para obtener los datos del tutor
    function obtenerDatosTutor() {
        fetch("obtenerDatosTutor.php", {
            method: "GET"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                // Rellenar los campos del formulario con los datos del tutor
                const tutor = data.data;
                document.getElementById("name").value = tutor.nombre;
                document.getElementById("lastName").value = tutor.apellidos;
                document.getElementById("dni").value = tutor.dni;
                document.getElementById("email").value = tutor.correo_electronico;
                document.getElementById("tel").value = tutor.telefono;
                document.getElementById("user").value = tutor.nombre_usuario;
            } else {
                mostrarMensaje(data.message, true);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            mostrarMensaje("Error al obtener los datos del tutor.", true);
        });
    }

    // Llamar a la función para obtener los datos del tutor al cargar la página
    obtenerDatosTutor();


    // Mensajes de validación
    function mostrarMensaje(mensaje, esError) {
        const errorSpan = document.getElementById("AjustesError");
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
            formData.append("funcion", "ajustes");

            fetch("ajustesPadres.php", {
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
            case ["name", "lastName"].includes(elemento.id):
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

            /* case elemento.id === "population":
                esValido = /^[a-zA-ZÀ-ÿ0-9\s]{2,40}$/.test(valor);
                break; */

            default:
                console.warn(`No hay reglas de validación para el campo con id "${elemento.id}"`);
                break;
        }

        const errorSpan = document.getElementById(elemento.id + "Error");
        if (errorSpan) {
            errorSpan.classList.toggle('hidden', esValido);
        }

        return esValido;
    }

    // Validar letra del DNI
    function validarLetraDNI(dni) {
        const regex = /^\d{8}[A-Z]$/;
        return regex.test(dni);
    }

    // Función para mostrar "Cambiar contraseña"
    const passwordButton = document.getElementById('passwordButton');
    passwordButton.addEventListener('click', function () {
        const newPassContainer = document.getElementById('newPassContainer');
        newPassContainer.classList.toggle('hidden'); // Muestra y oculta
    });
});

