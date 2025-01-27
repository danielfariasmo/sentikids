const form = document.querySelector('.form');
const inputs = document.querySelectorAll('.form input');

const expressions = {
    name: /^[a-zA-ZÀ-ÿ]{2,16}$/, // Letras, solo letras, con mínimo 2 y máximo 16.
    surname: /^[a-zA-ZÀ-ÿ]{2,30}(?: [a-zA-ZÀ-ÿ]{2,30})?$/, // Letras y espacios, pueden llevar acentos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Formato de correo.
    phone: /^\d{9}$/, // Teléfono de 9 dígitos.
    city: /^[a-zA-ZÀ-ÿ]{2,16}$/, // Letras
    date: /^\d{4}-\d{2}-\d{2}$/ // Fecha en formato AAAA-MM-DD.
};

const fields = {
    name: false,
    surname: false,
    email: false,
    phone: false,
    city: false,
    date: false
};

const validateForm = (e) => {
    switch (e.target.name) {
        case "name":
            validateField(expressions.name, e.target, 'name');
            break;
        case "surname":
            validateField(expressions.surname, e.target, 'surname');
            break;
        case "email":
            validateField(expressions.email, e.target, 'email');
            break;
        case "phone":
            validateField(expressions.phone, e.target, 'phone');
            break;
        case "city":
            validateField(expressions.city, e.target, 'city');
            break;
        case "date":
            validateDate();
            break;
    }
}

const validateField = (expression, input, field) => {
    if (expression.test(input.value)) {
        document.getElementById(`group__${field}`).classList.remove('form__group-incorrect');
        document.getElementById(`group__${field}`).classList.add('form__group-correct');

        // Añadir botón correcto y eliminar la X
		document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-correcto.png'; 
		document.querySelector(`#group__${field} img`).classList.remove('errors');

        //Eliminar mensaje de error
        document.querySelector(`#group__${field} .form__input-error`).classList.remove('form__input-error-active');
        fields[field] = true;
    } else {
        document.getElementById(`group__${field}`).classList.add('form__group-incorrect');
        document.getElementById(`group__${field}`).classList.remove('form__group-correct');

        // Actualizar el ícono y las clases relacionadas
		document.querySelector(`#group__${field} img`).classList.add('errors'); // Añadir clase de error
		document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-eliminar.png'; // Cambiar al ícono de error

		// Mostrar mensaje de error
        document.querySelector(`#group__${field} .form__input-error`).classList.add('form__input-error-active');
        fields[field] = false;
    }
}

const validateDate = () => {
    const today = new Date(); // Obtener la fecha de hoy como objeto de fecha
    const inputDate = document.getElementById('date').value; // Obtener el valor del input como cadena

    if (!inputDate) { // Si el campo está vacío
        // Puedes agregar un mensaje de error o manejarlo de acuerdo a tu lógica
        document.getElementById(`group__date`).classList.add('form__group-incorrect');
        document.getElementById(`group__date`).classList.remove('form__group-correct');

        // Actualizar el ícono y las clases relacionadas
		document.querySelector(`#group__date img`).classList.add('errors'); // Añadir clase de error
		document.querySelector(`#group__date img`).src = '../../../assets/icon/boton-eliminar.png'; // Cambiar al ícono de error

		// Mostrar mensaje de error
        document.querySelector(`#group__date .form__input-error`).classList.add('form__input-error-active');
        return;
    }

    const inputDateObj = new Date(inputDate); // Convertir la cadena a objeto Date

    // Ignorar la hora en las comparaciones
    today.setHours(0, 0, 0, 0);
    inputDateObj.setHours(0, 0, 0, 0);

    if (inputDateObj > today) {
        document.getElementById(`group__date`).classList.remove('form__group-incorrect');
        document.getElementById(`group__date`).classList.add('form__group-correct');

        // Añadir botón correcto y eliminar la X
		document.querySelector(`#group__date img`).src = '../../../assets/icon/boton-correcto.png'; 
		document.querySelector(`#group__date img`).classList.remove('errors');

        //Eliminar mensaje de error
        document.querySelector(`#group__date .form__input-error`).classList.remove('form__input-error-active');
    } else {
        document.getElementById(`group__date`).classList.add('form__group-incorrect');
        document.getElementById(`group__date`).classList.remove('form__group-correct');

        // Actualizar el ícono y las clases relacionadas
		document.querySelector(`#group__date img`).classList.add('errors'); // Añadir clase de error
		document.querySelector(`#group__date img`).src = '../../../assets/icon/boton-eliminar.png'; // Cambiar al ícono de error

		// Mostrar mensaje de error
        document.querySelector(`#group__date .form__input-error`).classList.add('form__input-error-active');
    }
};


inputs.forEach((input) => {
    input.addEventListener('keyup', validateForm);
    input.addEventListener('blur', validateForm);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verificar que todos los fields sean válidos
    if (Object.values(fields).every(Boolean)) {
        form.reset();

        // Mostrar mensaje de éxito
        document.getElementById('form__success-message').classList.add('form__success-message-active');
        setTimeout(() => {
            document.getElementById('form__success-message').classList.remove('form__success-message-active');
        }, 5000);

        // Eliminar estilos correctos
        document.querySelectorAll('.form__group-correct').forEach((icon) => {
            icon.classList.remove('form__group-correct');
        });
    } else {
        // Mostrar mensaje de error
        document.getElementById('form__message').classList.add('form__message-active');
    }
});
