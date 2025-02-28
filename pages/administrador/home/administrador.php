<?php

session_start();

if (isset($_SESSION['id_usuario'])) {
    echo json_encode([
        "status" => "success",
        "id_usuario" => $_SESSION['id_usuario'],  
        "rol" => $_SESSION['rol']
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Sesión no válida"]);
}
