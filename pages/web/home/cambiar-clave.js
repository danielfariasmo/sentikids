// Extrae parámetros de la URL
function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", function () {
    let email = getQueryParam("email");
    let token = getQueryParam("token");

    // Si no hay email o token, muestra un mensaje y oculta el formulario
    if (!email || !token) {
        document.getElementById("message").innerText = "Enlace inválido o expirado.";
        document.getElementById("changePasswordForm").style.display = "none";
        return;
    }

    // Rellena los campos ocultos con los valores de la URL
    document.getElementById("email").value = email;
    document.getElementById("token").value = token;

    const form = document.getElementById('changePasswordForm');
    const inputs = document.querySelectorAll('#changePasswordForm input');

    // Expresiones regulares para validar las contraseñas
    const expressions = {
        new_password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        confirm_password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    };

    const fields = {
        new_password: false,
        confirm_password: false,
    };

    // Valida el formulario al escribir o salir del input
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

    // Valida un campo específico según su expresión regular
    const validateField = (expression, input, field) => {
        if (expression.test(input.value)) {
            document.getElementById(`group__${field}`).classList.remove('form__group-incorrect');
            document.getElementById(`group__${field}`).classList.add('form__group-correct');
            document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-correcto.png';
            document.querySelector(`#group__${field} .form__input-error`).classList.remove('form__input-error-active');
            fields[field] = true;
        } else {
            document.getElementById(`group__${field}`).classList.add('form__group-incorrect');
            document.getElementById(`group__${field}`).classList.remove('form__group-correct');
            document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-eliminar.png';
            document.querySelector(`#group__${field} .form__input-error`).classList.add('form__input-error-active');
            fields[field] = false;
        }

        // Verifica si las contraseñas coinciden
        if (field === 'confirm_password') {
            const newPassword = document.getElementById('new_password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            if (newPassword !== confirmPassword) {
                document.getElementById(`group__confirm_password`).classList.add('form__group-incorrect');
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

    // Manejo del envío del formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    
        let isValid = true;
    
        inputs.forEach((input) => {
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
        let email = document.getElementById("email").value;
        let token = document.getElementById("token").value;
    
        fetch("cambiar-clave.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, newPassword }),
        })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("message").innerText = data.message;
            document.getElementById("message").style.color = data.success ? 'green' : 'red';
            
            // Si la contraseña se cambió con éxito, limpiar el formulario y redirigir
            if (data.success) {
                form.reset();
                console.log("Redirigiendo en 3 segundos...");
                setTimeout(() => {
                    window.location.href = "../home/logIn.html"; 
                }, 2000); 
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            document.getElementById("message").textContent = 'Hubo un error al enviar el formulario.';
            document.getElementById("message").style.color = 'red';
        });
    });
});
