document.addEventListener('DOMContentLoaded', () => {
    const rightContainer = document.getElementById('right-container');
    // Guarda la estructura HTML del infoChild en una variable
    window.infoChildHTML = rightContainer.querySelector('.infoChild').outerHTML;

    const infoChildHTML = rightContainer.querySelector('.infoChild').outerHTML;

    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");
    const popupOverlay = document.getElementById("popupOverlay");
    const popupOverlayHijo = document.getElementById("popupOverlay2");
    const popupOverlayConf = document.getElementById("popupOverlay3");

    function cargarNombre(nombre, apellidos) {
        const usuario = document.getElementById('nombre_tutor');
        usuario.innerHTML = nombre + ' ' + apellidos;
        console.log("se cambia el nombre?¿")
    }

    // Función para restaurar la estructura fija del right-container
    function resetRightContainer() {
        const rightContainer = document.getElementById('right-container');
        if (rightContainer) {
            rightContainer.innerHTML = `
            <div class="infoChild">
                <h3 class="nombreTitulo"></h3>
                <h4>Grupo:</h4>
                <p class="grupo"></p>
                <h4>Monitor:</h4>
                <p class="monitorInfo"></p>
                <h4>¿Quieres ajustar algo? Edita la información cuando quieras</h4>
                <p class="textoAlergias">Alergias o otras condiciones que quieres que sepamos</p>
                <textarea class="textAreaAlergias" rows="4" cols="50"></textarea>
                <a class="fotosGrupo" target="_blank"></a>
                <button class="horarioButton default" id="horarioButton">Horario</button>
            </div>
            <div class="infoTrust"></div>
        `;
        }
    }

    // Función para cargar la lista de hijos y crear botones
    function loadChildren() {
        fetch('obtenerHijo.php') // Endpoint que devuelve la lista de hijos
            .then(response => response.json())
            .then(data => {
                const childrenContainer = document.getElementById('childrenContainer');
                childrenContainer.innerHTML = ''; // Limpiar el contenedor

                // Crear la lista de hijos en el contenedor
                data.forEach(child => {
                    const childItem = document.createElement('div');
                    childItem.className = 'child-item';
                    childItem.innerHTML = `
        <span class="child-name">${child.nombre}</span>
        <span class="delete-icon" data-id="${child.id_hijo}"></span>
    `;
                    childrenContainer.appendChild(childItem);

                    // Añadir evento para eliminar hijo
                    childItem.querySelector('.delete-icon').addEventListener('click', function () {
                        eliminarHijo(child.id_hijo);
                    });
                });

                // BOTONES
                // Obtener el contenedor de botones
                const buttonsContainer = document.querySelector(".left-container-top");

                // Obtener el botón original (nombre_hijo)
                const originalButton = document.querySelector(".menu-button.nombre_hijo");

                // Si hay hijos, actualizar el botón original con el nombre del primer hijo
                if (data.length > 0) {
                    originalButton.textContent = data[0].nombre; // Actualizar el botón original
                    originalButton.dataset.nombreHijo = data[0].nombre; // Añadir un atributo de datos
                }

                // Insertar botones adicionales para los demás hijos (si los hay)
                for (let i = 1; i < data.length; i++) {
                    const child = data[i];

                    // Clonar el botón original
                    const newButton = originalButton.cloneNode(true);

                    // Modificar el texto del botón con el nombre del hijo
                    newButton.textContent = child.nombre;

                    // Añadir un atributo de datos con el nombre del hijo
                    newButton.dataset.nombreHijo = child.nombre;

                    // Insertar el nuevo botón justo después del botón original
                    buttonsContainer.insertBefore(newButton, originalButton.nextSibling);
                }

                // Añadir event listeners a los botones clonados
                addButtonListeners();
            })
            .catch(error => console.error('Error cargando hijos:', error));
    }

    // Cargar la lista de hijos cuando la página esté lista
    loadChildren();

    // Manejar el clic del botón "Borrar cuenta"
    document.getElementById('deleteAccountBtn').addEventListener('click', function (event) {
        event.preventDefault(); // Evitar cualquier comportamiento por defecto

        if (confirm('¿Estás seguro de que quieres borrar tu cuenta? Esta acción no se puede deshacer.')) {
            fetch('borrarGuardar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'delete' }) // Enviar la acción "delete"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Redirigir al usuario después de borrar la cuenta
                        window.location.href = '../../web/home/logIn.html'; // Te lleva al iniciar sesión
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });



    // Manejar el clic del botón "Borrar cuenta"
    document.getElementById('closeAccountBtn').addEventListener('click', function (event) {
        event.preventDefault(); // Evitar cualquier comportamiento por defecto
        window.location.href = '../../web/home/logIn.html'; // Te lleva al iniciar sesión
    });

    menuBtn.addEventListener('click', () => {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });


    if (menu && menuBtn) {
        // Cerrar menú si se hace clic fuera
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== menuBtn) {
                menu.style.display = 'none';
            }
        });
    }

    // Cerrar popup si se hace clic fuera de él
    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = "none";
        }
    });

    function reiniciarPopup() {
        const popup = document.getElementById("popup");
        if (popup) {
            setTimeout(() => {
                popup.scrollTop = 0;
            }, 10); // Espera 10ms para asegurarte de que se ha renderizado bien
        }
    }

    document.getElementById("editProfileBtn").addEventListener("click", function () {
        reiniciarPopup();
        document.querySelector(".popup-overlay").style.display = "flex";
    });

    document.getElementById("closePopupBtn").addEventListener("click", function () {
        document.querySelector(".popup-overlay").style.display = "none";
    });

    // Cerrar popup si se hace clic fuera de él
    popupOverlayHijo.addEventListener("click", (e) => {
        if (e.target === popupOverlayHijo) {
            popupOverlayHijo.style.display = "none";
        }
    });

    document.getElementById("newChildBtn").addEventListener("click", function () {
        reiniciarPopup();
        document.querySelector(".popup-overlay2").style.display = "flex";
    });

    document.getElementById("closePopupBtn2").addEventListener("click", function () {
        document.querySelector(".popup-overlay2").style.display = "none";
    });

    // Cerrar popup si se hace clic fuera de él
    popupOverlayConf.addEventListener("click", (e) => {
        if (e.target === popupOverlayConf) {
            popupOverlayConf.style.display = "none";
        }
    });

    document.getElementById("newTrustBtn").addEventListener("click", function () {
        document.querySelector(".popup-overlay3").style.display = "flex";
    });

    document.getElementById("closePopupBtn3").addEventListener("click", function () {
        document.querySelector(".popup-overlay3").style.display = "none";
    });

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
                    cargarNombre(tutor.nombre, tutor.apellidos);
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


    // Mostrar mensaje de validación
    function mostrarMensaje(mensaje, esError, mensajeId) {
        const errorSpan = document.getElementById(mensajeId);
        if (errorSpan) {
            errorSpan.textContent = mensaje;
            if (esError) {
                console.log(mensaje);
                errorSpan.classList.remove("hidden", "success");
                errorSpan.classList.add("error");
            } else {
                console.log(mensaje);
                errorSpan.classList.remove("hidden", "error");
                errorSpan.classList.add("success");
            }
        } else {
            console.error("El contenedor de mensajes no existe:", mensajeId);
        }
    }

    // Borrar mensaje de validación
    function borrarMensaje(mensajeId) {
        const errorSpan = document.getElementById(mensajeId);
        if (errorSpan) {
            errorSpan.textContent = ''; // Vaciar el contenido
            errorSpan.classList.add("hidden"); // Ocultar el mensaje
            errorSpan.classList.remove("error", "success"); // Quitar estilos previos
        } else {
            console.error("El contenedor de mensajes no existe:", mensajeId);
        }
    }


    // Formularios
    const form = document.getElementById('userForm');
    const formHijo = document.getElementById('userForm_hijo');
    const formPC = document.getElementById('userForm_pc');

    // Validación al cambiar de elemento
    form.addEventListener('focusout', (event) => {
        validarElemento(event.target);
    });

    formHijo.addEventListener('focusout', (event) => {
        validarElemento(event.target);
    });

    formPC.addEventListener('focusout', (event) => {
        validarElemento(event.target);
    });

    document.getElementById('saveChangesForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const form = document.getElementById('userForm'); // Asegúrate de que este es el ID correcto
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
                        borrarMensaje("AjustesError"); // Borrar mensaje específico para este formulario
                        popupOverlay.style.display = "none";
                    } else {
                        mostrarMensaje(data.message, true, "AjustesError"); // Mostrar mensaje de error
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud:", error);
                    mostrarMensaje("Error en la solicitud. Consulta la consola para más detalles.", true, "AjustesError");
                });
        } else {
            mostrarMensaje("Por favor, corrige los errores antes de continuar.", true, "AjustesError");
        }
    });

    // Envío del formulario Añadir Hijos
    document.getElementById('saveChangesForm2').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("form2");
        const esValido = [...formHijo.querySelectorAll("input, select")].every(validarElemento);
        if (esValido) {
            const formData = new FormData(formHijo);
            formData.append("funcion", "nuevoHijoPC");

            fetch("nuevoHijoPC.php", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        borrarMensaje("AjustesError2"); // Borrar mensaje específico para este formulario
                        popupOverlay2.style.display = "none";
                    } else {
                        mostrarMensaje(data.message, true, "AjustesError2"); // Mostrar mensaje de error
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud:", error);
                    mostrarMensaje("Error en la solicitud. Consulta la consola para más detalles.", true, "AjustesError2");
                });
        } else {
            mostrarMensaje("Por favor, corrige los errores antes de continuar.", true, "AjustesError2");
        }
    });

    // Envío del formulario Añadir Persona De Confianza
    document.getElementById('saveChangesForm3').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("form3");
        const esValido = [...formPC.querySelectorAll("input, select")].every(validarElemento);
        if (esValido) {
            const formData = new FormData(formPC);
            formData.append("funcion", "nuevoHijoPC");

            fetch("nuevoHijoPC.php", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        borrarMensaje("AjustesError3"); // Borrar mensaje específico para este formulario
                        popupOverlay3.style.display = "none";
                    } else {
                        mostrarMensaje(data.message, true, "AjustesError3"); // Mostrar mensaje de error
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud:", error);
                    mostrarMensaje("Error en la solicitud. Consulta la consola para más detalles.", true, "AjustesError3");
                });
        } else {
            mostrarMensaje("Por favor, corrige los errores antes de continuar.", true, "AjustesError3");
        }
    });

    // Validación de campos
    function validarElemento(elemento) {
        const valor = elemento.value.trim();
        let esValido = true;
        console.log(elemento.value.trim());

        switch (true) {
            case ["name", "name2", "lastName", "lastName2"].includes(elemento.id):
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

            case elemento.id === "childAge":
                esValido = validarEdadAlumno(elemento);
                break;

            default:
                console.warn(`No hay reglas de validación para el campo con id "${elemento.id}"`);
                break;
        }

        console.log("elemento.id: " + elemento.id);
        const errorSpan = document.getElementById(elemento.id + "Error");
        if (errorSpan) {
            errorSpan.classList.toggle('hidden', esValido);
        }
        console.log("es valido? " + esValido);
        return esValido;
    }

    // Validar edad del alumno
    function validarEdadAlumno(elemento) {
        const fechaNacimiento = new Date(elemento.value.trim());
        if (isNaN(fechaNacimiento)) return false;

        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

        if (
            hoy.getMonth() < fechaNacimiento.getMonth() ||
            (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())
        ) {
            edad--;
        }

        const esValido = edad >= 5 && edad <= 12;
        document.getElementById(elemento.id + "Error")?.classList.toggle('hidden', esValido);
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

    function cargarNotificaciones(container) {
        fetch('obtenerNotificaciones.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && Array.isArray(data.data)) {
                    const notificaciones = data.data;
                    // Limpiamos el contenedor antes de añadir las notificaciones
                    container.innerHTML = '';

                    // Añadir la clase para el scroll
                    container.classList.add('notificaciones-container');

                    notificaciones.forEach(notificacion => {
                        const notificacionDiv = document.createElement('div');
                        notificacionDiv.className = 'notificacion';
                        notificacionDiv.id = `notificacion-${notificacion.id_notificacion}`; // Asignar un ID único

                        // Botón para cerrar la notificación
                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'x';
                        closeButton.className = 'close-button';
                        closeButton.addEventListener('click', () => {
                            // Eliminar la notificación del DOM
                            notificacionDiv.remove();
                            // Eliminar la notificación de la base de datos
                            borrarNotificacion(notificacion.id_notificacion);
                        });

                        // Título de la notificación
                        const titulo = document.createElement('h4');
                        titulo.textContent = notificacion.titulo;

                        // Mensaje de la notificación
                        const mensaje = document.createElement('p');
                        mensaje.textContent = notificacion.mensaje;

                        // Fecha de la notificación
                        const fecha = document.createElement('span');
                        fecha.textContent = notificacion.fecha;
                        fecha.style.fontWeight = 'bold';
                        fecha.style.float = 'right';

                        // Añade los elementos al div de la notificación
                        notificacionDiv.appendChild(closeButton);
                        notificacionDiv.appendChild(titulo);
                        notificacionDiv.appendChild(mensaje);
                        notificacionDiv.appendChild(fecha);

                        // Añade la notificación al contenedor
                        container.appendChild(notificacionDiv);
                    });

                    // Añadir el mensaje de "No hay más actualizaciones recientes"
                    const noMasActualizaciones = document.createElement('p');
                    noMasActualizaciones.textContent = 'No hay más actualizaciones recientes';
                    container.appendChild(noMasActualizaciones);

                } else {
                    console.error('La respuesta del servidor no contiene un array de notificaciones:', data);
                    container.innerHTML = '<h2>Error al cargar las notificaciones</h2>';
                }
            })
            .catch(error => {
                console.error('Error al obtener las notificaciones:', error);
                container.innerHTML = '<h2>Error al cargar las notificaciones</h2>';
            });
    }

    // Función para borrar una notificación de la base de datos
    function borrarNotificacion(id_notificacion) {
        fetch('borrarNotificacion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'delete_notificacion', id_notificacion: id_notificacion })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Notificación eliminada correctamente.');
                } else {
                    console.error('Error al eliminar la notificación:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para añadir event listeners a los botones
    function addButtonListeners() {
        document.querySelectorAll('.left-container-top .menu-button').forEach(button => {
            button.addEventListener('click', function () {
                const nombreHijo = this.dataset.nombreHijo; // Obtiene el nombre del hijo desde el atributo de datos
                const rightContainer = document.querySelector('.right-container');

                // Dependiendo del botón pulsado...
                if (this.textContent === 'General') {
                    // Si es "General", cargar notificaciones
                    rightContainer.innerHTML = '';
                    cargarNotificaciones(rightContainer);
                } else if (this.textContent === 'Mis Personas de Confianza') {
                    // Para "Mis Personas de Confianza", cargar la lista de personas de confianza
                    cargarInfoTrust();
                } else {
                    // Para la información del hijo:
                    resetRightContainer(); // Restaurar la estructura fija
                    cargarInformacionHijo(rightContainer, nombreHijo); // Cargar la información del hijo
                }

                // Marcar el botón como activo
                document.querySelectorAll('.left-container-top .menu-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    document.getElementById("abrirHorario").addEventListener("click", function () {
        console.log("se le da al boton");
        const rightContainer = document.querySelector('.right-container');
        rightContainer.innerHTML = '';
        cargarHorario(rightContainer, nombreHijo);
    });


    function cargarInformacionHijo(container, nombreHijo) {
        fetch(`obtenerInformacion.php?nombre=${encodeURIComponent(nombreHijo)}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const infoHijo = data.data;

                    // Seleccionar el contenedor predefinido que ya está en el HTML
                    const infoChildDiv = container.querySelector('.infoChild');
                    if (!infoChildDiv) {
                        console.error("No se encontró el contenedor .infoChild");
                        return;
                    }

                    // Mostrar el contenedor (en caso de que esté oculto)
                    infoChildDiv.style.display = 'block';

                    // Actualizar los elementos existentes con la información obtenida

                    // Nombre del hijo (h3 con clase 'nombreTitulo')
                    const nombreTitulo = infoChildDiv.querySelector('.nombreTitulo');
                    if (nombreTitulo) {
                        nombreTitulo.textContent = infoHijo.nombreHijo + " " + infoHijo.apellidos;
                        nombreTitulo.style.textAlign = 'right';
                    }

                    // TextArea para las alergias (textarea con clase 'textAreaAlergias')
                    const textAreaAlergias = infoChildDiv.querySelector('.textAreaAlergias');
                    if (textAreaAlergias) {
                        textAreaAlergias.value = infoHijo.alergias || ''; // Asegurar que no sea undefined
                    }

                    // Grupo del niño (p con clase 'grupo')
                    const grupo = infoChildDiv.querySelector('.grupo');
                    if (grupo) {
                        grupo.textContent = `${infoHijo.grupo || 'No especificado'}`;
                    }

                    // Información del monitor (p con clase 'monitorInfo')
                    const monitorInfo = infoChildDiv.querySelector('.monitorInfo');
                    if (monitorInfo) {
                        monitorInfo.textContent = `${infoHijo.monitor?.nombre || 'No especificado'} (${infoHijo.monitor?.correo || 'No especificado'})`;
                    }

                    // Link para fotos del grupo (a con clase 'fotosGrupo')
                    const fotosGrupo = infoChildDiv.querySelector('.fotosGrupo');
                    if (fotosGrupo) {
                        fotosGrupo.href = infoHijo.fotosGrupoUrl || '#';
                        fotosGrupo.textContent = 'Ver fotos del grupo';
                    }
                    console.log("por aqui si");

                    // Botón para cargar el horario
                    const horarioButton = infoChildDiv.querySelector('.horarioButton');
                    if (horarioButton) {
                        console.log("boton?");
                        horarioButton.style.display = 'block';
                        horarioButton.onclick = () => cargarHorario(container, infoHijo.horarioUrl, infoHijo.nombreHijo);
                    }
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error al obtener la información del hijo:', error);
            });
    }

    function cargarHorario(container, horarioUrl, nombreHijo) {
        // Limpiar el contenido actual del contenedor
        container.innerHTML = '';

        // Crear un nuevo contenedor para el horario
        const horarioDiv = document.createElement('div');
        horarioDiv.className = 'horarioContainer';

        // Crear la imagen del horario
        const horarioImg = document.createElement('img');
        horarioImg.src = horarioUrl || '';
        horarioImg.alt = 'Horario del grupo';
        horarioImg.className = 'horarioImg';

        // Crear el botón "Atrás"
        const backButton = document.createElement('button');
        backButton.textContent = 'Atrás';
        backButton.className = 'backButton';
        backButton.onclick = () => {
            // Volver a cargar la información del hijo
            resetRightContainer();
            cargarInformacionHijo(container, nombreHijo); // Asegúrate de tener acceso a `nombreHijo`
        };

        // Agregar la imagen y el botón al contenedor del horario
        horarioDiv.appendChild(backButton); // Botón primero para que esté encima de la imagen
        horarioDiv.appendChild(horarioImg);

        // Agregar el contenedor del horario al contenedor principal
        container.appendChild(horarioDiv);
    }

    // Función para cargar la información de las personas de confianza
    function cargarInfoTrust() {
        const container = document.querySelector('#right-container');

        // Restaurar la estructura fija del right-container
        resetRightContainer();

        // Seleccionar el contenedor .infoTrust
        const infoTrustDiv = container.querySelector('.infoTrust');

        // Ocultar .infoChild (si está visible)
        const infoChildDiv = container.querySelector('.infoChild');
        if (infoChildDiv) {
            infoChildDiv.style.display = 'none';
        }

        // Mostrar .infoTrust
        infoTrustDiv.style.display = 'block';

        // Obtener las personas de confianza desde el servidor
        fetch('obtenerPC.php')
            .then(response => response.json())
            .then(data => {
                if (data.status !== 'success') {
                    console.error("Error en la respuesta:", data.message);
                    return;
                }

                const persons = data.data;
                infoTrustDiv.innerHTML = ''; // Limpiar el contenedor

                // Crear elementos para cada persona de confianza
                persons.forEach(person => {
                    const personDiv = document.createElement('div');
                    personDiv.className = 'trusted-item';
                    personDiv.innerHTML = `
                        <span>${person.nombre} ${person.apellidos} (${person.telefono})</span>
                        <span class="delete-icon" data-id="${person.id_otro_tutor}"></span>
                    `;
                    infoTrustDiv.appendChild(personDiv);

                    // Añadir evento para eliminar persona de confianza
                    personDiv.querySelector('.delete-icon').addEventListener('click', function () {
                        eliminarPersonaConfianza(person.id_otro_tutor);
                    });
                });
            })
            .catch(error => {
                console.error('Error al obtener las personas de confianza:', error);
            });
    }

    // Función para eliminar una persona de confianza
    function eliminarPersonaConfianza(id) {
        if (!confirm("¿Estás seguro de eliminar a esta persona de confianza?")) return;

        fetch(`borrarPC.php?id=${encodeURIComponent(id)}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Recargar la lista actualizada
                    cargarInfoTrust();
                } else {
                    alert("Error al eliminar: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error al eliminar la persona de confianza:", error);
            });
    }

    // Función para eliminar una persona de confianza
    function eliminarHijo(id) {
        if (!confirm("¿Estás seguro de eliminar a este niño/a?")) return;

        fetch(`borrarHijo.php?id=${encodeURIComponent(id)}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Recargar la lista actualizada
                    loadChildren();
                } else {
                    alert("Error al eliminar: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error al eliminar al niño/a:", error);
            });
    }

    // Selecciona todos los botones del menú izquierdo
    const menuButtons = document.querySelectorAll('.left-container-top .menu-button');

    // Marca el primer botón como activo al cargar la página
    if (menuButtons.length > 0) {
        menuButtons[0].classList.add('active');
        // Aquí puedes añadir la lógica para cargar el contenido correspondiente
        const rightContainer = document.querySelector('.right-container');

        cargarNotificaciones(rightContainer);
    }

    // Añade un event listener a cada botón
    menuButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remueve la clase 'active' de todos los botones
            menuButtons.forEach(btn => btn.classList.remove('active'));
            // Añade la clase 'active' al botón clickeado
            this.classList.add('active');

            const buttonText = this.textContent;
            const rightContainer = document.querySelector('.right-container');
        });
    });

});
