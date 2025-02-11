<?php
include '../../../server/database.php';

if (isset($_POST['id_monitor'])) {
    $id_monitor = $_POST['id_monitor'];

    // Comprobar si el monitor no esta en un grupo
    $query_check = "SELECT * FROM grupo WHERE id_monitor = $id_monitor";
    $check_result = mysqli_query($connection, $query_check);
    if (mysqli_num_rows($check_result) > 0) {
        echo "Error: El monitor tiene registros relacionados en otras tablas.";
        exit;
    }

    // Eliminamos al monitor
    $query = "DELETE FROM monitor WHERE id_monitor = $id_monitor";
    $result = mysqli_query($connection, $query);

    if (!$result) {
        echo "Error al eliminar monitor: " . mysqli_error($connection);
    } else {
        echo "Monitor eliminado con éxito.";
    }
} else {
    echo "No se proporcionó el ID del monitor.";
}
?>
