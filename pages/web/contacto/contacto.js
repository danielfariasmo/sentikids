document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact-form");
    const cvForm = document.querySelector(".cv-upload-form");

    function validateInput(input, regex, errorMessage) {
        const value = input.value.trim();
        const errorSpan = input.nextElementSibling;
        if (!regex.test(value)) {
            input.classList.add("error");
            errorSpan.textContent = errorMessage;
            return false;
        } else {
            input.classList.remove("error");
            errorSpan.textContent = "";
            return true;
        }
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll("input, textarea");
        
        inputs.forEach(input => {
            if (input.type === "text") {
                isValid &= validateInput(input, /^[a-zA-ZÀ-ÿ\s]{3,50}$/, "Ingrese un nombre válido (solo letras y espacios).");
            } else if (input.type === "email") {
                isValid &= validateInput(input, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Ingrese un correo válido.");
            } else if (input.tagName === "TEXTAREA") {
                isValid &= validateInput(input, /^.{10,500}$/, "El mensaje debe tener entre 10 y 500 caracteres.");
            } else if (input.type === "file") {
                if (!input.files.length) {
                    input.classList.add("error");
                    isValid = false;
                } else {
                    input.classList.remove("error");
                }
            }
        });
        return isValid;
    }

    function sendEmail(form, subject) {
        if (!validateForm(form)) return;
        const formData = new FormData(form);
        
        const mailtoLink = `mailto:campamentosentikids@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent([...formData.entries()].map(([key, val]) => `${key}: ${val}`).join('\n'))}`;
        window.location.href = mailtoLink;
    }

    contactForm.addEventListener("input", (e) => {
        const input = e.target;
        if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
            if (input.type === "text") {
                validateInput(input, /^[a-zA-ZÀ-ÿ\s]{3,50}$/, "Ingrese un nombre válido.");
            } else if (input.type === "email") {
                validateInput(input, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Ingrese un correo válido.");
            } else if (input.tagName === "TEXTAREA") {
                validateInput(input, /^.{10,500}$/, "El mensaje debe tener entre 10 y 500 caracteres.");
            }
        }
    });

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        sendEmail(contactForm, "Consulta de contacto");
    });

    cvForm.addEventListener("input", (e) => {
        const input = e.target;
        if (input.tagName === "INPUT") {
            if (input.type === "text") {
                validateInput(input, /^[a-zA-ZÀ-ÿ\s]{3,50}$/, "Ingrese un nombre válido.");
            } else if (input.type === "email") {
                validateInput(input, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Ingrese un correo válido.");
            }
        }
    });

    cvForm.addEventListener("submit", function (e) {
        e.preventDefault();
        sendEmail(cvForm, "Solicitud de empleo");
    });
});
