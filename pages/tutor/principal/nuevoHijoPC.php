<?php
header("Content-Type: application/json");

// Incluir la conexión a la base de datos
include "../../../server/database.php";

// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

// Iniciar la sesión
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['rol'])) {
    echo json_encode(['status' => 'error', 'message' => 'No autenticado']);
    exit;
}

// Verificar el rol del usuario (opcional, dependiendo de tu lógica)
$rol = $_SESSION['rol'];
if ($rol !== 'tutor') {
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
    exit;
}

// Conectar a la base de datos
$conn = new mysqli($servidor, $usuarioBD, $password, $db);

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

// Obtener los datos del formulario
$funcion = $_POST['funcion'] ?? null;

// Verificar la función solicitada
if ($funcion === 'nuevoHijoPC') {
    if (isset($_POST['nombre'])) {
        // Es el formulario de añadir hijo
        $nombre = $_POST['nombre'];
        $apellidos = $_POST['apellidos'];
        $fecha_nacimiento = $_POST['childAge'];
        $dieta = $_POST['diet'][0] ?? 'none'; // Asume que diet es un array
        $alergias = $_POST['allergies'][0] ?? ''; // Asume que allergies es un array
        $id_tutor = $_SESSION['id_usuario'];

        // Insertar el nuevo hijo en la base de datos
        $sql = "INSERT INTO hijo (nombre, apellidos, fecha_nacimiento, dieta, alergias, id_tutor) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param('sssssi', $nombre, $apellidos, $fecha_nacimiento, $dieta, $alergias, $id_tutor);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Hijo añadido correctamente.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al añadir el hijo: ' . $stmt->error]);
        }

        $stmt->close();
    } elseif (isset($_POST['nombre2'])) {
        // Es el formulario de añadir persona de confianza
        $nombre = $_POST['nombre2'];
        $apellidos = $_POST['apellidos2'];
        $dni = $_POST['dni2'];
        $telefono = $_POST['telefono2'];
        $id_tutor = $_SESSION['id_usuario'];

        // Insertar la nueva persona de confianza en la base de datos
        $sql = "INSERT INTO persona_confianza (nombre, apellidos, dni, telefono, id_tutor) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param('ssssi', $nombre, $apellidos, $dni, $telefono, $id_tutor);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Persona de confianza añadida correctamente.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al añadir la persona de confianza: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Datos del formulario incompletos.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Función no válida.']);
}

// Cerrar la conexión
$conn->close();
?>