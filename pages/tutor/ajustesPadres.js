document.addEventListener('DOMContentLoaded', () => {

    // Mensajes de validación
    function mostrarMensaje(mensaje, esError) {
        const errorSpan = document.getElementById("AjustesError");
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
            case ["name", "lastName"].includes(elemento.id):
                // Letras y espacios, pueden llevar acentos
                console.log("por aqui esta pasando en validarElemento ");
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

    // Función para mostrar "Cambiar contraseña"
    const passwordButton = document.getElementById('passwordButton');

    passwordButton.addEventListener('click', function () {
        const newPassContainer = document.getElementById('newPassContainer');
        newPassContainer.classList.toggle('hidden'); //muestra y oculta
    });

});