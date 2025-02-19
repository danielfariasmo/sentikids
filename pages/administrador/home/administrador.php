<?php

session_start();

if (isset($_SESSION['id_usuario'])) {
    echo json_encode(["status" => "success", "rol" => $_SESSION['rol']]);
} else {
    echo json_encode(["status" => "error", "message" => "Sesión no válida"]);
}
