document.addEventListener('DOMContentLoaded', () => {
    // Mensajes de validación de login
    function mostrarMensajeLogin(mensaje, esError) {
        const errorSpan = document.getElementById("loginError");
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

    // Validación al enviar el formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const usuarioValido = validarUsuario();
        const contraseñaValida = validarContraseña();

        if (usuarioValido && contraseñaValida) {
            mostrarMensajeLogin("Inicio de sesión exitoso", false);
        } else {
            mostrarMensajeLogin("Por favor, corrige los errores antes de continuar.", true);
        }
    });

    /** VALIDACIONES */
    function validarElemento(elemento) {
        const valor = elemento.value.trim();
        let esValido = true;

        switch (elemento.id) {
            case "user":
                esValido = /^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(valor); // Letras y espacios, pueden llevar acentos
                break;
            case "password":
                esValido = valor !== "";
                break;
        }

        const errorSpan = document.getElementById(elemento.id + "Error");
        errorSpan.classList.toggle('hidden', esValido);
    }

    function validarUsuario() {
        const valor = document.getElementById("user").value.trim();
        return /^[a-zA-ZÀ-ÿ\s]{2,40}$/.test(valor); // Letras y espacios, pueden llevar acentos
    }

    function validarContraseña() {
        const valor = document.getElementById("password").value.trim();
        return valor !== "";
    }
});
