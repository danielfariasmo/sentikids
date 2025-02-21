<?php
include '../../../server/database.php';

if (isset($_POST['children_ids']) && isset($_POST['group_id'])) {
    $childrenIds = $_POST['children_ids'];  // Un array de IDs de niños
    $groupId = $_POST['group_id'];

    // Comprobar cuántos niños ya están asignados al grupo
    $checkQuery = "SELECT COUNT(*) AS total_children FROM hijo WHERE id_grupo = ?";
    if ($stmt_check = $connection->prepare($checkQuery)) {
        // Vinculamos el parámetro para la consulta de comprobación
        $stmt_check->bind_param("i", $groupId);

        // Ejecutamos la consulta de comprobación
        $stmt_check->execute();
        $stmt_check->bind_result($totalChildren);
        $stmt_check->fetch();
        $stmt_check->close();

        // Verificamos si el grupo ya tiene 10 niños
        if ($totalChildren >= 10) {
            echo "Error: El grupo ya tiene 10 niños. No se pueden agregar más.";
            exit;
        }
    } else {
        echo "Error al comprobar la cantidad de niños en el grupo: " . $connection->error;
        exit;
    }

    // Sentencia SQL preparada para evitar inyecciones SQL
    $sql = "UPDATE hijo SET id_grupo = ? WHERE id_hijo = ?";

    if ($stmt = $connection->prepare($sql)) {
        // Vincular los parámetros para la sentencia preparada
        $stmt->bind_param("ii", $groupId, $childId);

        // Ejecutar la actualización para cada niño
        foreach ($childrenIds as $childId) {
            if (!$stmt->execute()) {
                echo 'Error al agregar el niño con ID ' . $childId . ' al grupo';
                exit;
            }
        }

        echo 'Niños agregados al grupo';
        // Cerrar la declaración preparada
        $stmt->close();
    } else {
        echo "Error al preparar la consulta: " . $connection->error;
    }
}
