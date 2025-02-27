<?php
include '../../../server/database.php'; // Asegúrate de que esta ruta es correcta

$search = $_GET['search'] ?? '';

if (!$search) {
    echo json_encode([]);
    exit;
}

$query = "
    SELECT 'administrador' AS tipo, id_administrador AS id, nombre, apellidos FROM administrador WHERE nombre LIKE ? OR apellidos LIKE ?
    UNION
    SELECT 'monitor' AS tipo, id_monitor AS id, nombre, apellidos FROM monitor WHERE nombre LIKE ? OR apellidos LIKE ?
    UNION
    SELECT 'tutor' AS tipo, id_tutor AS id, nombre, apellidos FROM tutor WHERE nombre LIKE ? OR apellidos LIKE ?
";

$stmt = $connection->prepare($query);
$searchTerm = "%$search%";
$stmt->bind_param("ssssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);
?>
