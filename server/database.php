<?php

/*---------------------------------------------------------------
Variables de conexión
---------------------------------------------------------------*/
$server = "localhost";
$user = "root";
$password = "";

// Petición de para la conexión
$connection = mysqli_connect($server, $user, $password);

/*---------------------------------------------------------------
BASE DE DATOS
---------------------------------------------------------------*/
$sql = "SHOW DATABASES LIKE 'sentikids'";
$query = mysqli_query($connection, $sql) or die("ERROR: no se crea la Base de Datos");
if (mysqli_fetch_array($query) <= 0) {
    $sql = "CREATE DATABASE sentikids";
    if (mysqli_query($connection, $sql)) {
        echo "";
        mysqli_select_db($connection, 'sentikids');
        require_once "tablas.php";
    } else {
        echo "ERROR: no se crea la Base de Datos: " . mysqli_error($connection) . "<br>";
    }
} else {
    mysqli_select_db($connection, 'sentikids');
}