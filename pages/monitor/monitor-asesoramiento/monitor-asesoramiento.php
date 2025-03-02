<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Consulta para obtener los tutores
$query = "SELECT id_tutor, nombre, apellidos FROM tutor";
$result = mysqli_query($conexion, $query);

// Verifica si la consulta se ejecutó correctamente
if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta']);
    mysqli_close($conexion);
    exit;
}

// Verifica si hay resultados
if (mysqli_num_rows($result) > 0) {
    $tutores = [];

    // Agrega cada tutor al arreglo
    while ($row = mysqli_fetch_assoc($result)) {
        $tutores[] = $row;
    }

    // Devuelve los tutores en formato JSON
    echo json_encode($tutores);
} else {
    echo json_encode([]); // Devuelve un arreglo vacío si no hay tutores
}

// Cierra la conexión
mysqli_close($conexion);
?>