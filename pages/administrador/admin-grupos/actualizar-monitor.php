<?php
include '../../../server/database.php';

// Verificar si los datos fueron enviados
if (isset($_POST['id_grupo']) && isset($_POST['id_monitor'])) {
    $id_grupo = $_POST['id_grupo'];
    $id_monitor = $_POST['id_monitor'];

    // Verificar si el monitor ya está asignado a un grupo
    $query = "SELECT id_grupo FROM grupos WHERE id_monitor = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_monitor);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // El monitor ya tiene un grupo asignado
        echo 'monitor_asignado';
    } else {
        // Actualizar el monitor en el grupo
        $updateQuery = "UPDATE grupos SET id_monitor = ? WHERE id_grupo = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("ii", $id_monitor, $id_grupo);
        if ($updateStmt->execute()) {
            echo 'success';
        } else {
            echo 'error';
        }
    }
}
?>
