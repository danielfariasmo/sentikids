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

    /* function resetRightContainer() {
        const rightContainer = document.getElementById('right-container');
        // Limpia el contenedor y reestablece el HTML fijo
        rightContainer.innerHTML = window.infoChildHTML;
      } */


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
            <div class="infoChild" style="display:none;">
                <h3 class="nombreTitulo"></h3>
                <p class="textoAlergias"></p>
                <textarea class="textAreaAlergias" rows="4" cols="50"></textarea>
                <p class="grupo"></p>
                <p class="monitorInfo"></p>
                <a class="fotosGrupo" target="_blank"></a>
                <img class="horarioImg" style="width:400px; margin-top:10px;" alt="Horario del grupo" />
            </div>
            <div class="infoTrust" style="display:none;"></div>
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
                    <span>${child.nombre}</span>
                    <!-- <button type="button" onclick="deleteChild(${child.id})">Eliminar</button> -->
                `;
                childrenContainer.appendChild(childItem);
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

    // Función para cargar la lista de Personas de confianza
    /* function misPersonasC() {
        fetch('obtenerPC.php')
            .then(response => response.json())
            .then(data => {
                const trustedContainer = document.getElementById('trustedContainer');
                trustedContainer.innerHTML = ''; // Limpiar el contenedor

                data.forEach(confianza => {
                    const trustedItem = document.createElement('div');
                    trustedItem.className = 'trusted-item';
                    trustedItem.innerHTML = `
                            <span>${confianza.nombre}</span>
                            <!--  <button type="button" onclick="deletePConf(${confianza.id})">Eliminar</button>  -->
                        `;
                    trustedContainer.appendChild(trustedItem);
                });
            })
            .catch(error => console.error('Error cargando personas de confianza:', error));
    }

    // Cargar la lista de hijos cuando la página esté lista
    misPersonasC(); */

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
                        alert(data.message);
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

    // Cerrar menú si se hace clic fuera
    // document.addEventListener('click', (e) => {
    //     if (!menu.contains(e.target) && e.target !== menuBtn) {
    //         menu.style.display = 'none';
    //     }
    // });

    // Cerrar popup si se hace clic fuera de él
    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = "none";
        }
    });

    document.getElementById("editProfileBtn").addEventListener("click", function () {
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


    // Mensajes de validación
    function mostrarMensaje(mensaje, esError) {
        const errorSpan = document.getElementById("AjustesError");
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

    // Envío del formulario
    document.getElementById('saveChangesForm').addEventListener('submit', function (event) {
        event.preventDefault();
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
                        mostrarMensaje(data.message, false);
                        // Redirigir o realizar otras acciones
                    } else {
                        mostrarMensaje(data.message, true);
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud:", error);
                    mostrarMensaje("Error en la solicitud. Consulta la consola para más detalles.", true);
                });
        } else {
            mostrarMensaje("Por favor, corrige los errores antes de continuar.", true);
        }

    });

    // Validación de campos
    function validarElemento(elemento) {
        const valor = elemento.value.trim();
        let esValido = true;

        switch (true) {
            case ["name", "lastName"].includes(elemento.id):
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

            /* case elemento.id === "population":
                esValido = /^[a-zA-ZÀ-ÿ0-9\s]{2,40}$/.test(valor);
                break; */

            default:
                console.warn(`No hay reglas de validación para el campo con id "${elemento.id}"`);
                break;
        }

        const errorSpan = document.getElementById(elemento.id + "Error");
        if (errorSpan) {
            errorSpan.classList.toggle('hidden', esValido);
        }

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




    // Script para manejar los botones del contenedor izquierdo
    document.querySelectorAll('.left-container .menu-button').forEach(button => {
        button.addEventListener('click', function () {
            const buttonText = this.textContent;
            //rightContainer = document.querySelector('.right-container');

            // Maneja cada opción según el botón pulsado
            switch (buttonText) {
                case 'General':
                    rightContainer.innerHTML = '';
                    cargarNotificaciones(rightContainer);
                    break;
                /* case 'Nombre Hijo':
                    rightContainer.innerHTML = '';
                    cargarInformacionHijo(rightContainer);
                    break; */
                case 'Horario':
                    rightContainer.innerHTML = '';
                    cargarHorarioHijo(rightContainer);
                    break;
                default:
                    // Si el botón pertenece a un hijo, cargar su información
                    if (this.classList.contains('nombre_hijo')) {
                        rightContainer.innerHTML = '';
                        rightContainer.innerHTML = infoChildHTML;
                        cargarInformacionHijo(rightContainer, buttonText); // Pasar el nombre del hijo
                    }
                    break;
            }
        });
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

                        // Botón para cerrar la notificación
                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'x';
                        closeButton.className = 'close-button';
                        closeButton.addEventListener('click', () => {
                            notificacionDiv.remove();
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

    // Función para añadir event listeners a los botones
/* function addButtonListeners() {
    document.querySelectorAll('.left-container-top .menu-button').forEach(button => {
        button.addEventListener('click', function () {
            const buttonText = this.textContent;
            const rightContainer = document.querySelector('.right-container');

            // Maneja cada opción según el botón pulsado
            switch (buttonText) {
                case 'General':
                    rightContainer.innerHTML = '';
                    cargarNotificaciones(rightContainer);
                    break;
                case 'Horario':
                    rightContainer.innerHTML = '';
                    cargarHorarioHijo(rightContainer);
                    break;
                default:
                    // Si el botón pertenece a un hijo, cargar su información
                    if (this.classList.contains('nombre_hijo')) {
                        rightContainer.innerHTML = '';
                        cargarInformacionHijo(rightContainer, buttonText); // Pasar el nombre del hijo
                    }
                    break;
            }

            // Marcar el botón como activo
            document.querySelectorAll('.left-container-top .menu-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
} */

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
            } else if (this.textContent === 'Horario') {
                // Para "Horario", cargar el horario
                rightContainer.innerHTML = '';
                cargarHorarioHijo(rightContainer);
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
                    nombreTitulo.textContent = infoHijo.nombreHijo;
                    nombreTitulo.style.textAlign = 'right';
                }

                // Texto para alergias (p con clase 'textoAlergias')
                const textoAlergias = infoChildDiv.querySelector('.textoAlergias');
                if (textoAlergias) {
                    textoAlergias.textContent = 'Cosas que deberíamos saber: Alergias o otras observaciones';
                }

                // TextArea para las alergias (textarea con clase 'textAreaAlergias')
                const textAreaAlergias = infoChildDiv.querySelector('.textAreaAlergias');
                if (textAreaAlergias) {
                    textAreaAlergias.value = infoHijo.alergias || ''; // Asegurar que no sea undefined
                }

                // Grupo del niño (p con clase 'grupo')
                const grupo = infoChildDiv.querySelector('.grupo');
                if (grupo) {
                    grupo.textContent = `Grupo: ${infoHijo.grupo || 'No especificado'}`;
                }

                // Información del monitor (p con clase 'monitorInfo')
                const monitorInfo = infoChildDiv.querySelector('.monitorInfo');
                if (monitorInfo) {
                    monitorInfo.textContent = `Monitor: ${infoHijo.monitor?.nombre || 'No especificado'} (${infoHijo.monitor?.correo || 'No especificado'})`;
                }

                // Link para fotos del grupo (a con clase 'fotosGrupo')
                const fotosGrupo = infoChildDiv.querySelector('.fotosGrupo');
                if (fotosGrupo) {
                    fotosGrupo.href = infoHijo.fotosGrupoUrl || '#';
                    fotosGrupo.textContent = 'Ver fotos del grupo';
                }

                // Imagen del horario (img con clase 'horarioImg')
                const horarioImg = infoChildDiv.querySelector('.horarioImg');
                if (horarioImg) {
                    horarioImg.src = infoHijo.horarioUrl || '';
                    horarioImg.alt = 'Horario del grupo';
                }
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al obtener la información del hijo:', error);
        });
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
                    <span class="delete-icon" data-id="${person.id}">🗑️</span>
                `;
                infoTrustDiv.appendChild(personDiv);

                // Añadir evento para eliminar persona de confianza
                personDiv.querySelector('.delete-icon').addEventListener('click', function () {
                    eliminarPersonaConfianza(person.id);
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

    fetch(`eliminarPC.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE' // O usa POST según lo requiera tu backend
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("Persona eliminada con éxito");
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
