<?php
header("Content-Type: application/json");

include "../../../server/database.php";

// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

// Conexión a la base de datos
$conexion = mysqli_connect($servidor, $usuarioBD, $password, $db);
if (!$conexion) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la base de datos']);
    exit;
}

// Verificar que se reciban los datos necesarios
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

// Recoger y sanitizar los datos del formulario
$nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
$apellidos = mysqli_real_escape_string($conexion, $_POST['apellidos']);
$dni = mysqli_real_escape_string($conexion, $_POST['dni']);
$email = mysqli_real_escape_string($conexion, $_POST['email']);
$telefono = mysqli_real_escape_string($conexion, $_POST['telefono']);
$nombre2 = mysqli_real_escape_string($conexion, $_POST['nombre2'] ?? '');
$apellidos2 = mysqli_real_escape_string($conexion, $_POST['apellidos2'] ?? '');
$dni2 = mysqli_real_escape_string($conexion, $_POST['dni2'] ?? '');
$telefono2 = mysqli_real_escape_string($conexion, $_POST['telefono2'] ?? '');
$usuario = mysqli_real_escape_string($conexion, $_POST['usuario'] ?? '');
$contra = mysqli_real_escape_string($conexion, $_POST['contra'] ?? '');

// Insertar el tutor
$queryTutor = "INSERT INTO tutor (nombre, apellidos, dni, correo_electronico, telefono, nombre_usuario, clave_usuario) 
               VALUES ('$nombre', '$apellidos', '$dni', '$email', '$telefono', '$usuario', '$contra')";
if (mysqli_query($conexion, $queryTutor)) {
    $tutorId = mysqli_insert_id($conexion);

    // Insertar la persona de confianza (si existe)
    if (!empty($nombre2) && !empty($apellidos2) && !empty($dni2) && !empty($telefono2)) {
        $queryConfianza = "INSERT INTO persona_confianza (id_tutor, nombre, apellidos, dni, telefono) 
                           VALUES ('$tutorId', '$nombre2', '$apellidos2', '$dni2', '$telefono2')";
        if (!mysqli_query($conexion, $queryConfianza)) {
            echo json_encode(['status' => 'error', 'message' => 'Error al insertar la persona de confianza: ' . mysqli_error($conexion)]);
            exit;
        }
    }

    // Insertar los hijos
    foreach ($_POST['childName'] as $index => $childName) {
        $childName = mysqli_real_escape_string($conexion, $childName);
        $childLastName = mysqli_real_escape_string($conexion, $_POST['childLastName'][$index]);
        $childAge = mysqli_real_escape_string($conexion, $_POST['childAge'][$index]);
        $diet = mysqli_real_escape_string($conexion, $_POST['diet'][$index]);
        $allergies = mysqli_real_escape_string($conexion, $_POST['allergies'][$index]);

        $queryHijo = "INSERT INTO hijo (id_tutor, nombre, apellidos, fecha_nacimiento, dieta, alergias) 
                      VALUES ('$tutorId', '$childName', '$childLastName', '$childAge', '$diet', '$allergies')";
        if (!mysqli_query($conexion, $queryHijo)) {
            echo json_encode(['status' => 'error', 'message' => 'Error al insertar el hijo: ' . mysqli_error($conexion)]);
            exit;
        }
    }

    //notificación para el tutor
    $titulo = "Bienvenido a Sentikids";
    $mensaje = "Gracias por registrarte en Sentikids. Esperamos que disfrutes de nuestros servicios.";
    $fecha = date('Y-m-d H:i:s'); // Fecha actual

    $queryNotificacion = "INSERT INTO notificacion (id_tutor, titulo, mensaje, fecha) 
                          VALUES ('$tutorId', '$titulo', '$mensaje', '$fecha')";
    if (!mysqli_query($conexion, $queryNotificacion)) {
        echo json_encode(['status' => 'error', 'message' => 'Error al crear la notificación: ' . mysqli_error($conexion)]);
        exit;
    }

    echo json_encode(['status' => 'success', 'message' => 'Inscripción completada con éxito']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al insertar el tutor: ' . mysqli_error($conexion)]);
}

// Cerrar la conexión
mysqli_close($conexion);
?>