<?php
header("Content-Type: application/json");
include '../../../server/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['token'], $data['newPassword'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

$email = $data['email'];
$token = $data['token'];
$newPassword = $data['newPassword'];

error_log("Email recibido: " . $email);
error_log("Token recibido: " . $token);
error_log("Nueva contraseña: " . $newPassword);


$usuario_actualizado = false;
$tablas = ['administrador', 'monitor', 'tutor'];

foreach ($tablas as $tabla) {
    // Verificar si el usuario existe y el token es válido
    $stmt_verificar = $connection->prepare("SELECT * FROM $tabla WHERE correo_electronico = ? AND codigo = ?");
    $stmt_verificar->bind_param("ss", $email, $token);
    $stmt_verificar->execute();
    $resultado = $stmt_verificar->get_result();

    if ($resultado->num_rows > 0) {
        // Actualizar la contraseña
        $stmt = $connection->prepare("UPDATE $tabla SET clave_usuario = ?, codigo = NULL WHERE correo_electronico = ? AND codigo = ?");
        $stmt->bind_param("sss", $newPassword, $email, $token);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $usuario_actualizado = true;
            break; // Salir del bucle, ya se actualizó la contraseña
        } else {
            error_log("Error en la actualización en la tabla $tabla: " . $stmt->error);
        }

        $stmt->close();
    } else {
        error_log("No se encontró un usuario en la tabla $tabla con el correo $email y token $token");
    }
    $stmt_verificar->close();
}

if ($usuario_actualizado) {
    echo json_encode(["success" => true, "message" => "Contraseña actualizada con éxito."]);
} else {
    echo json_encode(["success" => false, "message" => "No se pudo actualizar la contraseña. Verifica el enlace o intenta nuevamente."]);
}
?>
