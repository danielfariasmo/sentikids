<?php
// Conexión a la base de datos
include '../../../server/database.php'; // Ruta correcta a tu archivo de conexión
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Verificar si la conexión es exitosa
if (!$connection) {
    die("Conexión fallida: " . mysqli_connect_error());
}

// Obtener los datos enviados
$mensaje = isset($_POST['mensaje']) ? $_POST['mensaje'] : '';
$id_destinatario = isset($_POST['id_destinatario']) ? $_POST['id_destinatario'] : '';
$rol_destinatario = isset($_POST['rol_destinatario']) ? $_POST['rol_destinatario'] : '';
$id_remitente = isset($_POST['id_remitente']) ? $_POST['id_remitente'] : ''; // ID del remitente
$rol_remitente = isset($_POST['rol_remitente']) ? $_POST['rol_remitente'] : ''; // Rol del remitente

// Verificar que los datos sean válidos
if ($mensaje && $id_destinatario && $id_remitente && $rol_remitente) {
    // Insertar el mensaje en la base de datos
    $query = "INSERT INTO mensajes (mensaje, id_destinatario, rol_destinatario, id_remitente, rol_remitente) 
              VALUES ('$mensaje', '$id_destinatario', '$rol_destinatario', '$id_remitente', '$rol_remitente')";
    $result = mysqli_query($connection, $query);
    
    if ($result) {
        // Si el mensaje se insertó correctamente, devolver una respuesta
        echo json_encode(array('status' => 'success', 'message' => 'Mensaje enviado.'));
        exit(); // Asegúrate de detener la ejecución después de la respuesta
    } else {
        // Si hubo un error en la inserción
        echo json_encode(array('status' => 'error', 'message' => 'Hubo un error al enviar el mensaje.'));
    }
} else {
    // Si faltan datos
    echo json_encode(array('status' => 'error', 'message' => 'Faltan datos para enviar el mensaje.'));
}
?>
