// Extraer parámetros de la URL
function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", function () {
    let email = getQueryParam("email");
    let token = getQueryParam("token");

    if (!email || !token) {
        document.getElementById("message").innerText = "Enlace inválido o expirado.";
        document.getElementById("changePasswordForm").style.display = "none";
        return;
    }

    document.getElementById("email").value = email;
    document.getElementById("token").value = token;

    const form = document.getElementById('changePasswordForm');
    const inputs = document.querySelectorAll('#changePasswordForm input');

    const expressions = {
        new_password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Mínimo 8 caracteres, al menos una letra y un número
        confirm_password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    };

    const fields = {
        new_password: false,
        confirm_password: false,
    };

    const validateForm = (e) => {
        switch (e.target.name) {
            case "new_password":
                validateField(expressions.new_password, e.target, 'new_password');
                break;
            case "confirm_password":
                validateField(expressions.confirm_password, e.target, 'confirm_password');
                break;
        }
    };

    const validateField = (expression, input, field) => {
        if (expression.test(input.value)) {
            document.getElementById(`group__${field}`).classList.remove('form__group-incorrect');
            document.getElementById(`group__${field}`).classList.add('form__group-correct');

            // Añadir botón correcto y eliminar la X
            document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-correcto.png';
            document.querySelector(`#group__${field} img`).classList.remove('errors');

            // Eliminar mensaje de error
            document.querySelector(`#group__${field} .form__input-error`).classList.remove('form__input-error-active');
            fields[field] = true;
        } else {
            document.getElementById(`group__${field}`).classList.add('form__group-incorrect');
            document.getElementById(`group__${field}`).classList.remove('form__group-correct');

            // Actualizar el ícono y las clases relacionadas
            document.querySelector(`#group__${field} img`).classList.add('errors');
            document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-eliminar.png';

            // Mostrar mensaje de error
            document.querySelector(`#group__${field} .form__input-error`).classList.add('form__input-error-active');
            fields[field] = false;
        }

        // Validar que las contraseñas coincidan
        if (field === 'confirm_password') {
            const newPassword = document.getElementById('new_password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            if (newPassword !== confirmPassword) {
                document.getElementById(`group__confirm_password`).classList.add('form__group-incorrect');
                document.getElementById(`group__confirm_password`).classList.remove('form__group-correct');
                document.querySelector(`#group__confirm_password .form__input-error`).textContent = 'Las contraseñas no coinciden.';
                document.querySelector(`#group__confirm_password .form__input-error`).classList.add('form__input-error-active');
                fields.confirm_password = false;
            } else {
                document.querySelector(`#group__confirm_password .form__input-error`).classList.remove('form__input-error-active');
                fields.confirm_password = true;
            }
        }
    };

    inputs.forEach((input) => {
        input.addEventListener('keyup', validateForm);
        input.addEventListener('blur', validateForm);
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
    
        let isValid = true;
    
        inputs.forEach((input) => {
            // Verificar si la expresión regular existe antes de validarla
            if (expressions[input.name]) {
                validateField(expressions[input.name], input, input.name);
                if (!fields[input.name]) {
                    isValid = false;
                }
            }
        });
    
        if (!isValid) {
            document.getElementById('message').textContent = 'Por favor, completa el formulario correctamente.';
            document.getElementById('message').style.color = 'red';
            return;
        }
    
        let newPassword = document.getElementById("new_password").value;
        let confirmPassword = document.getElementById("confirm_password").value;
        let email = document.getElementById("email").value;
        let token = document.getElementById("token").value;
    
        if (newPassword !== confirmPassword) {
            document.getElementById("message").innerText = "Las contraseñas no coinciden.";
            document.getElementById("message").style.color = 'red';
            return;
        }
    
        fetch("cambiar-clave.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, newPassword }),
        })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("message").innerText = data.message;
            document.getElementById("message").style.color = data.success ? 'green' : 'red';
            if (data.success) form.reset();
        })
        .catch((error) => {
            console.error("Error:", error);
            document.getElementById("message").textContent = 'Hubo un error al enviar el formulario.';
            document.getElementById("message").style.color = 'red';
        });
    });
    
});