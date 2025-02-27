/*---------------------------------------------------------------
Utilidad de menu "hamburguesa"
---------------------------------------------------------------*/
function toggleMenu() {
    let menuList = document.querySelector('.menu ul');
    menuList.classList.toggle('active');
}

/*---------------------------------------------------------------
Comprobación de sesión iniciada
---------------------------------------------------------------*/
$(document).ready(function () {
    $.ajax({
        url: "../home/administrador.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            if (response.status !== "success") {
                window.location.href = "../../web/home/index.html";
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la verificación de sesión:", error);
        }
    });
});

/*---------------------------------------------------------------
Funcionalidad de cerrar sesión
---------------------------------------------------------------*/
$(document).ready(function () {
    $("#btnCerrarSesion").click(function () {
        $.ajax({
            url: "../home/cerrar-sesion.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    window.location.href = "../../web/home/index.html";
                } else {
                    console.error("Error al cerrar sesión:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    });
});

/*---------------------------------------------------------------
Funcionalidad de cargar la lista de usuarios y filtrar en tiempo real
---------------------------------------------------------------*/
$(document).ready(function () {
    // Función para cargar usuarios y buscar en tiempo real
    $("#searchUser").on("input", function () {
        let searchText = $(this).val().trim();

        if (searchText.length === 0) {
            $("#chatList").empty();
            return;
        }

        $.ajax({
            url: "buscar_usuarios.php",
            type: "GET",
            data: { search: searchText },
            dataType: "json",
            success: function (data) {
                $("#chatList").empty();
                if (data.length === 0) {
                    $("#chatList").append("<li>No se encontraron resultados</li>");
                    return;
                }

                data.forEach(user => {
                    let listItem = $("<li>").text(user.nombre + " " + user.apellidos);
                    listItem.attr("data-id", user.id);
                    listItem.attr("data-tipo", user.tipo);
                    listItem.addClass("user-item");
                    $("#chatList").append(listItem);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar la lista de usuarios:", error);
            }
        });
    });

    $(document).ready(function () {
        // Función para cargar los mensajes cuando un usuario es seleccionado
        $("#chatList").on("click", ".user-item", function () {
            let userId = $(this).data("id");
            let userTipo = $(this).data("tipo");
            let userName = $(this).text();

            // Depuración: Verifica si los datos del usuario son correctos
            console.log("Usuario seleccionado:", userName, "ID:", userId, "Tipo:", userTipo);

            $("#chatUserName").text(userName);
            $("#chatMessages").html("<p>Cargando mensajes...</p>");

            // Guardar los datos del usuario seleccionado para el envío de mensajes
            $('#chatUserName').data('id', userId);
            $('#chatUserName').data('rol', userTipo);

            // Cargar los mensajes para esta conversación
            cargarMensajes(userId, userTipo);
        });

        // Enviar mensaje de forma asíncrona
        $('#sendMessage').on('click', function () {
            var message = $('#messageInput').val().trim();

            // Verifica que el mensaje no esté vacío
            if (message !== '') {
                // Primero obtenemos los datos del remitente desde la sesión
                $.ajax({
                    url: "../home/administrador.php",  // El archivo que gestiona la sesión
                    type: "GET",
                    dataType: "json",
                    success: function (response) {
                        if (response.status === "success") {
                            var idRemitente = response.id_usuario;  // ID del usuario logueado
                            var rolRemitente = response.rol;  // Rol del usuario logueado

                            var idDestinatario = $('#chatUserName').data('id');
                            var rolDestinatario = $('#chatUserName').data('rol');

                            // Verifica que los datos del destinatario estén disponibles
                            console.log("Enviando mensaje a ID:", idDestinatario, "Rol:", rolDestinatario);
                            console.log("Desde ID:", idRemitente, "Rol:", rolRemitente);

                            // Asegúrate de que el remitente y destinatario sean diferentes
                            if (idDestinatario !== idRemitente) {
                                // Enviar el mensaje al destinatario seleccionado
                                $.ajax({
                                    url: 'enviar-mensaje.php',
                                    type: 'POST',
                                    data: {
                                        mensaje: message,
                                        id_destinatario: idDestinatario,
                                        rol_destinatario: rolDestinatario,
                                        id_remitente: idRemitente,
                                        rol_remitente: rolRemitente
                                    },
                                    success: function (response) {
                                        try {
                                            var res = JSON.parse(response);  // Esto debería funcionar si la respuesta es JSON
                                            if (res.status === 'success') {
                                                // Mostrar el mensaje en el chat
                                                $('#chatMessages').append('<div class="message"><strong>Tú:</strong> ' + message + '</div>');
                                                $('#messageInput').val(''); // Limpiar el campo de texto
                                            } else {
                                                alert(res.message); // Mostrar un mensaje de error si falla
                                            }
                                        } catch (e) {
                                            console.error("Error al procesar la respuesta JSON:", e);
                                            alert('Hubo un error al procesar la respuesta del servidor.');
                                        }
                                    },
                                    error: function (xhr, status, error) {
                                        console.error("Error al enviar el mensaje:", error);
                                        alert('Hubo un problema al enviar el mensaje. Intenta de nuevo.');
                                    }
                                });
                            } else {
                                alert('No puedes enviarte un mensaje a ti mismo.');
                            }
                        } else {
                            alert('No se pudo obtener la información de la sesión.');
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al obtener los datos de la sesión:", error);
                        alert('Hubo un problema al obtener los datos del remitente.');
                    }
                });
            } else {
                alert('Por favor, escribe un mensaje.');
            }
        });

        // Función para cargar los mensajes
        function cargarMensajes(idDestinatario, rolDestinatario) {
            $.ajax({
                url: 'cargar-mensajes.php',
                type: 'GET',
                data: {
                    id_destinatario: idDestinatario,
                    rol_destinatario: rolDestinatario
                },
                success: function (data) {
                    console.log("Datos de mensajes:", data);  // Revisa lo que se recibe
                    if (data.error) {
                        console.error(data.error);  // Si hay un error, lo mostramos
                        $('#chatMessages').html('<p>No se encontraron mensajes</p>');
                    } else {
                        var messages = JSON.parse(data);
                        $('#chatMessages').empty();  // Limpiar los mensajes anteriores
                        if (messages.length === 0) {
                            $('#chatMessages').append('<p>No hay mensajes aún</p>');
                        } else {
                            messages.forEach(function (message) {
                                var msgElement = $("<div>").addClass("message");
            
                                var senderInfo = $("<span>").addClass("sender-info").text(message.enviado_por);
                                msgElement.append(senderInfo);
            
                                var messageText = $("<p>").text(message.mensaje);
                                msgElement.append(messageText);
            
                                if (message.enviado_por === "Tú") {
                                    msgElement.addClass("mensaje-salida");
                                } else {
                                    msgElement.addClass("mensaje-entrada");
                                }
            
                                $('#chatMessages').append(msgElement);
                            });
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error al cargar los mensajes:", error);
                }
            });
            
        }

        // Función para cargar la lista de chats
        function cargarChats() {
            $.ajax({
                url: 'cargar-chats.php', // URL del script para cargar chats
                type: 'GET',
                success: function (data) {
                    console.log("Datos de chats:", data); // Muestra toda la respuesta recibida
                    try {
                        var chats = JSON.parse(data);
                        $('#chatList').empty(); // Limpiar la lista de chats
                        if (chats.length === 0) {
                            $('#chatList').append('<li>No tienes chats activos</li>');
                        } else {
                            chats.forEach(function (chat) {
                                var chatItem = $("<li>").addClass("chat-item").attr("data-id", chat.id_chat).attr("data-rol", chat.rol_chat);
                                chatItem.text(chat.nombre);
                                $('#chatList').append(chatItem);
                            });
                        }
                    } catch (e) {
                        console.error("Error al parsear JSON:", e);
                        console.error("Respuesta recibida:", data);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error al cargar los chats:", error);
                }
            });
        }

        // Llamar a la función para cargar los chats al cargar la página
        $(document).ready(function() {
            cargarChats();

            // Función para cargar los mensajes cuando un usuario es seleccionado de la lista de chats
            $('#chatList').on('click', '.chat-item', function () {
                var idChat = $(this).data('id');
                var rolChat = $(this).data('rol');
                $('#chatUserName').text($(this).text()); // Mostrar el nombre del usuario con el que se está chateando

                // Llamar a obtener-mensajes.php para cargar los mensajes del chat
                $.ajax({
                    url: 'obtener-mensajes.php',
                    type: 'GET',
                    data: {
                        id_chat: idChat,  // ID del chat al que pertenece el usuario
                    },
                    success: function (data) {
                        console.log('Datos recibidos:', data); // Verifica los datos recibidos
                        // Asegúrate de que 'data' sea un array
                        if (Array.isArray(data)) {
                            data.forEach(function (message) {
                                var msgElement = $("<div>").addClass("message");

                                var senderInfo = $("<span>").addClass("sender-info").text(message.nombre);
                                msgElement.append(senderInfo);

                                var messageText = $("<p>").text(message.mensaje);
                                msgElement.append(messageText);

                                // Diferenciar el estilo del mensaje según quien lo envió
                                if (message.nombre === "Tú") {
                                    msgElement.addClass("mensaje-salida");
                                } else {
                                    msgElement.addClass("mensaje-entrada");
                                }

                                $('#chatMessages').append(msgElement);
                            });
                        } else {
                            console.error('La respuesta no es un array:', data);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al cargar los mensajes:", error);
                    }
                });

});

            
            
        });
    });
});
