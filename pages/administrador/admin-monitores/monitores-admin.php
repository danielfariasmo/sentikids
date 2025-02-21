<?php

include '../../../server/database.php';

// Consulta preparada para seleccionar datos del monitor.
$query = "SELECT id_monitor, nombre, apellidos, telefono, dni, correo_electronico FROM monitor";
$stmt = mysqli_prepare($connection, $query);

if ($stmt === false) {
    die('Error en la preparación de la consulta: ' . mysqli_error($connection));
}

// Ejecutar la consulta.
mysqli_stmt_execute($stmt);

// Obtener el resultado de la consulta.
$result = mysqli_stmt_get_result($stmt);

// Enviar datos al JS.
$json = array();
while ($row = mysqli_fetch_array($result)) {
    $json[] = array(
        'id_monitor' => $row['id_monitor'],
        'nombre' => $row['nombre'],
        'apellidos' => $row['apellidos'],
        'telefono' => $row['telefono'],
        'dni' => $row['dni'],
        'correo_electronico' => $row['correo_electronico']
    );
}

$jsonString = json_encode($json);
echo $jsonString;

// Cerrar la declaración preparada.
mysqli_stmt_close($stmt);

?>
