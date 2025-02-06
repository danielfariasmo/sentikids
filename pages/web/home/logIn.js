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

        // Validación local
        const usuarioValido = validarUsuario();
        const contraseñaValida = validarContraseña();

        if (usuarioValido && contraseñaValida) {
            // Si la validación local es correcta, proceder con la validación en el servidor
            const usuario = document.getElementById("user").value.trim();
            const contraseña = document.getElementById("password").value.trim();
            validarUsuarioContraseña(usuario, contraseña);
        } else {
            mostrarMensajeLogin("Por favor, corrige los errores antes de continuar.", true);
        }
    });

    /** VALIDACIONES LOCALES */
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

    /** VALIDACIÓN EN EL SERVIDOR CON FETCH */
    function validarUsuarioContraseña(usuario, contraseña) {
        const formData = new FormData();
        formData.append("funcion", "validando");
        formData.append("usuario", usuario);
        formData.append("contra", contraseña);

        fetch("logIn.php", {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.status === "success") {
                    mostrarMensajeLogin(data.message, false);
                    // Redirigir según el rol del usuario
                    if (data.role === "administrador") {
                        window.location.href = `../../administrador/home/home-admin.html`;
                    } else if (data.role === "monitor") {
                        window.location.href = `../../monitor/monitor-areaprivada/monitor-areaprivada.html`;
                    } else if (data.role === "tutor") {
                        window.location.href = `../../tutor/ajustesPadres.html`;
                    }
                } else {
                    mostrarMensajeLogin(data.message, true);
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                mostrarMensajeLogin("Error en la solicitud. Consulta la consola para más detalles.", true);
            });
    }
});
