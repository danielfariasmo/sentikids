// Variables primer formulario
const inputName = document.getElementById('inputName');
const inputEmail = document.getElementById('inputEmail');
const inputMessage = document.getElementById('inputMessage');
const errorName = document.getElementById('errorName');
const errorEmail = document.getElementById('errorEmail');
const errorMessage = document.getElementById('errorMessage');
const buttonSubmit = document.getElementById('buttonSubmit');

// Funcion para validar el nombre
function validateName() {
    const nameInput = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Permite solo letras, espacios y caracteres acentuados
    const inputNameValue = inputName.value.trim();

    if (inputNameValue === '') {
        errorName.textContent = 'El nombre no puede estar vacío';
        return false;
    } else if (!nameInput.test(inputNameValue)) {
        errorName.textContent = 'El nombre solo puede contener letras y espacios';
        return false;
    } else {
        errorName.textContent = '';
        return true;
    }
}

// Funcion para validar el email
function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputEmail.value.trim())) {
        errorEmail.textContent = 'Porfavor introduce un email válido';
        return false;
    } else {
        errorEmail.textContent = '';
        return true;
    }
}

// Funcion para validar el mensaje
function validateMessage() {
    if (inputMessage.value.trim() === '') {
        errorMessage.textContent = 'El mensaje no puede estar vacío';
        return false;
    } else {
        errorMessage.textContent = '';
        return true;
    }
}

// Funcion para validar que todos los espacios son válidos
function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();
    buttonSubmit.disabled = !(isNameValid && isEmailValid && isMessageValid);
}

// Eventos para la validación en tiempo real
inputName.addEventListener('input', validateForm);
inputEmail.addEventListener('input', validateForm);
inputMessage.addEventListener('input', validateForm);

// Envío del formulario
document.getElementById('formContact').addEventListener('submit', function(event) {
    event.preventDefault(); 
    alert('EL formulario se ha enviado correctamente !');
});




// Variables para el segundo formulario
const inputNameFile = document.getElementById('inputNameFile');
const inputEmailFile = document.getElementById('inputEmailFile');
const inputFile = document.getElementById('inputFile');
const errorNameFile = document.getElementById('errorNameFile');
const errorEmailFile = document.getElementById('errorEmailFile');
const errorFile = document.getElementById('errorFile');
const buttonSubmitFile = document.getElementById('buttonSubmitFile');

// Función para validar el nombre
function validateNameFile() {

    const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const inputNameFileValue = inputNameFile.value.trim();

    if (inputNameFileValue === '') {
        errorNameFile.textContent = 'El nombre no puede estar vacío';
        return false;
    } else if (!namePattern.test(inputNameFileValue)) {
        errorNameFile.textContent = 'El nombre solo puede contener letras y espacios';
        return false;
    } else {
        errorNameFile.textContent = '';
        return true;
    }
}

// Función para validar el email
function validateEmailFile() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputEmailFile.value.trim())) {
        errorEmailFile.textContent = 'Porfavor introduce un email válido';
        return false;
    } else {
        errorEmailFile.textContent = '';
        return true;
    }
}

// Función para validar el archivo
function validateFile() {
    const file = inputFile.files[0];
    if (!file) {
        errorFile.textContent = 'Debes subir un archivo';
        return false;
    }
    const allowedExtensions = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedExtensions.includes(file.type)) {
        errorFile.textContent = 'Solo PDF, JPG, or PNG están permitidos';
        return false;
    }
    errorFile.textContent = '';
    return true;
}

// Función para validar todo el formulario
function validateFormFile() {
    const isNameValid = validateNameFile();
    const isEmailValid = validateEmailFile();
    const isFileValid = validateFile();
    buttonSubmitFile.disabled = !(isNameValid && isEmailValid && isFileValid);
}

// Eventos para la validación en tiempo real
inputNameFile.addEventListener('input', validateFormFile);
inputEmailFile.addEventListener('input', validateFormFile);
inputFile.addEventListener('change', validateFormFile);

// Envío del segundo formulario
document.getElementById('formFile').addEventListener('submit', function(event) {
    event.preventDefault(); 
    alert('EL archivo se ha subido correctamente !');
});
