<?php
include '../../../server/database.php';

if (isset($_POST['id_grupo']) && isset($_POST['id_monitor'])) {
    $id_grupo = $_POST['id_grupo'];
    $id_monitor = $_POST['id_monitor'];

    // Comprobar si el monitor ya está asignado a un grupo
    $checkQuery = "SELECT id_grupo FROM grupo WHERE id_monitor = ?";
    if ($stmt_check = $connection->prepare($checkQuery)) {
        // Vinculamos el parámetro para la consulta de comprobación
        $stmt_check->bind_param("i", $id_monitor);
        
        // Ejecutamos la consulta de comprobación
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            // Si el monitor ya está asignado a un grupo, no lo podemos asignar a otro
            echo "Error: El monitor ya está asignado a un grupo.";
            $stmt_check->close();
            exit;
        }

        // Si el monitor no está asignado a ningún grupo, continuamos con la actualización
        $stmt_check->close();

        // Sentencia SQL preparada para evitar inyecciones SQL
        $query = "UPDATE grupo SET id_monitor = ? WHERE id_grupo = ?";

        if ($stmt = $connection->prepare($query)) {
            // Vinculamos los parámetros de la consulta
            $stmt->bind_param("ii", $id_monitor, $id_grupo);

            // Ejecutamos la consulta
            $result = $stmt->execute();

            if ($result) {
                echo "Monitor actualizado con éxito.";
            } else {
                echo "Error al actualizar monitor: " . $stmt->error;
            }

            // Cerramos la declaración
            $stmt->close();
        } else {
            echo "Error al preparar la consulta: " . $connection->error;
        }
    } else {
        echo "Error al comprobar si el monitor está asignado a otro grupo: " . $connection->error;
    }
}

