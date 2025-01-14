// Función para abrir un modal específico basado en el ID proporcionado
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
}

// Función para cerrar un modal específico basado en el ID proporcionado
function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
}

// Obtener todos los botones que abren los modales
var btns = document.getElementsByClassName("myBtn");

// Asignar eventos a cada botón
for (var i = 0; i < btns.length; i++) {
    btns[i].onclick = function() {
        var modalId = this.getAttribute('data-modal-id');  // Obtener el ID del modal asociado
        openModal(modalId);
    };
}

// Obtener todas las X para cerrar los modales
var spans = document.getElementsByClassName("close");

// Asignar eventos para cerrar cada modal
for (var i = 0; i < spans.length; i++) {
    spans[i].onclick = function() {
        var modalId = this.getAttribute('data-modal-id');  // Obtener el ID del modal asociado
        closeModal(modalId);
    };
}

// Cerrar modal si el usuario hace clic fuera del modal
window.onclick = function(event) {
    var modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

// Formularios
const form = document.querySelector('.popup_body');
const inputs = document.querySelectorAll('.form__input');

const expressions = {
    name: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, // Letras, con espacios, mínimo 2 y máximo 40 (incluye hasta 4 espacios).
    age: /^\d{1}$/, // Edad puede ser hasta 2 números.
    nameParents: /^[a-zA-ZÀ-ÿ\s]{2,40}$/,
    phone: /^\d{9}$/, // Teléfono de 9 dígitos.
};

const fields = {
    nameKids: false,
    age: false,
    nameParents: false,
    phone: false,
};

const validateForm = (e) => {
    switch (e.target.name) {
        case "nameKids":
            validateField(expressions.name, e.target, 'nameKids');
            break;
        case "age":
            validateField(expressions.age, e.target, 'age');
            break;
        case "nameParents":
            validateField(expressions.nameParents, e.target, 'nameParents');
            break;
        case "phone":
            validateField(expressions.phone, e.target, 'phone');
            break;
    }
};

const validateField = (expression, input, field) => {
    if (expression.test(input.value)) {
        document.getElementById(`group__${field}`).classList.remove('form__group-incorrect');
        document.getElementById(`group__${field}`).classList.add('form__group-correct');

        document.querySelector(`#group__${field} img`).src = 'icon/boton-correcto.png'; 
        document.querySelector(`#group__${field} img`).classList.remove('errors');

        document.querySelector(`#group__${field} .form__input-error`).classList.remove('form__input-error-active');
        fields[field] = true;
    } else {
        document.getElementById(`group__${field}`).classList.add('form__group-incorrect');
        document.getElementById(`group__${field}`).classList.remove('form__group-correct');

        document.querySelector(`#group__${field} img`).classList.add('errors');
        document.querySelector(`#group__${field} img`).src = 'icon/boton-eliminar.png';

        document.querySelector(`#group__${field} .form__input-error`).classList.add('form__input-error-active');
        fields[field] = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validateForm);
    input.addEventListener('blur', validateForm);
});

// Función para validar el campo de selección
const validateSelect = (input) => {
    const selectGroup = document.getElementById(`group__nameSelect`);
    if (input.value !== "" && input.value !== "Seleccione un niño/a") {
        selectGroup.classList.remove('form__group-incorrect');
        selectGroup.classList.add('form__group-correct');

        document.querySelector(`#group__nameSelect img`).src = 'icon/boton-correcto.png'; 
        document.querySelector(`#group__nameSelect img`).classList.remove('errors');

        document.querySelector(`#group__nameSelect .form__input-error`).classList.remove('form__input-error-active');
    } else {
        selectGroup.classList.add('form__group-incorrect');
        selectGroup.classList.remove('form__group-correct');

        document.querySelector(`#group__nameSelect img`).classList.add('errors');
        document.querySelector(`#group__nameSelect img`).src = 'icon/boton-eliminar.png';

        document.querySelector(`#group__nameSelect .form__input-error`).classList.add('form__input-error-active');
    }
};

// Obtener el select y asignar evento
const selectInput = document.getElementById('select-kids');
selectInput.addEventListener('change', (e) => {
    validateSelect(e.target);
});


form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (Object.values(fields).every(Boolean) ) {
        form.reset();

        document.getElementById('form__success-message').classList.add('form__success-message-active');
        setTimeout(() => {
            document.getElementById('form__success-message').classList.remove('form__success-message-active');
        }, 5000);

        document.querySelectorAll('.form__group-correct').forEach((icon) => {
            icon.classList.remove('form__group-correct');
        });
    } else {
        document.getElementById('form__message').classList.add('form__message-active');
    }
});
