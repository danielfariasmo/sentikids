<?php
include '../../../server/database.php';

if (isset($_POST['id_monitor'])) {
    $id_monitor = $_POST['id_monitor'];

    // Comprobar si el monitor no está en un grupo usando consulta preparada
    $query_check = "SELECT * FROM grupo WHERE id_monitor = ?";
    $stmt_check = mysqli_prepare($connection, $query_check);
    if ($stmt_check === false) {
        die('Error en la preparación de la consulta: ' . mysqli_error($connection));
    }

    // Vinculamos el parámetro
    mysqli_stmt_bind_param($stmt_check, 'i', $id_monitor);

    // Ejecutamos la consulta
    mysqli_stmt_execute($stmt_check);

    // Verificamos si el monitor tiene registros en la tabla grupo
    $check_result = mysqli_stmt_get_result($stmt_check);
    if (mysqli_num_rows($check_result) > 0) {
        echo "Error: El monitor tiene registros relacionados en otras tablas.";
        mysqli_stmt_close($stmt_check);
        exit;
    }

    // Eliminamos al monitor usando consulta preparada
    $query_delete = "DELETE FROM monitor WHERE id_monitor = ?";
    $stmt_delete = mysqli_prepare($connection, $query_delete);
    if ($stmt_delete === false) {
        die('Error en la preparación de la consulta: ' . mysqli_error($connection));
    }

    // Vinculamos el parámetro
    mysqli_stmt_bind_param($stmt_delete, 'i', $id_monitor);

    // Ejecutamos la eliminación
    $result = mysqli_stmt_execute($stmt_delete);

    if (!$result) {
        echo "Error al eliminar monitor: " . mysqli_error($connection);
    } else {
        echo "Monitor eliminado con éxito.";
    }

    // Cerramos la declaración preparada
    mysqli_stmt_close($stmt_check);
    mysqli_stmt_close($stmt_delete);
} else {
    echo "No se proporcionó el ID del monitor.";
}

