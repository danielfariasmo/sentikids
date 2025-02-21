<?php
include '../../../server/database.php';

if (isset($_POST['id_monitor'])) {
    $id_monitor = $_POST['id_monitor'];

    // Consulta preparada para verificar si el monitor existe
    $query = "SELECT id_monitor FROM monitor WHERE id_monitor = ?";
    
    if ($stmt = $connection->prepare($query)) {
        // Vinculamos el parámetro
        $stmt->bind_param("i", $id_monitor);

        // Ejecutamos la consulta
        $stmt->execute();

        // Obtenemos el resultado
        $result = $stmt->get_result();

        if (mysqli_num_rows($result) > 0) {
            // Si el monitor existe
            echo "Monitor encontrado.";
        } else {
            // Si el monitor no existe
            echo "Monitor no encontrado.";
        }

        // Cerramos la declaración
        $stmt->close();
    } else {
        echo "Error al preparar la consulta: " . $connection->error;
    }
}
