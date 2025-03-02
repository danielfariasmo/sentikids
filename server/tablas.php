<?php
/*---------------------------------------------------------------
Función para generar el hash de la contraseña
---------------------------------------------------------------*/
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/*---------------------------------------------------------------
ADMINISTRADORES
---------------------------------------------------------------*/
$admin = "CREATE TABLE IF NOT EXISTS administrador (
        id_administrador INT AUTO_INCREMENT PRIMARY KEY,
        nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
        clave_usuario VARCHAR(255) NOT NULL,
        nombre VARCHAR(20) NOT NULL,
        apellidos VARCHAR(20) NOT NULL,
        correo_electronico VARCHAR(50) NOT NULL,
        codigo VARCHAR(255)
    );";
mysqli_query($connection, $admin) or die("ERROR: no se puede crear la tabla administradores: " . mysqli_error($connection));

$insertAdmin = "INSERT INTO administrador (id_administrador, nombre_usuario, clave_usuario, nombre, apellidos, correo_electronico) VALUES 
                    (1, 'danielfarias', '" . hashPassword('daniel') . "', 'Daniel', 'Farias Morales', 'fariasd99@gmail.com')";
mysqli_query($connection, $insertAdmin) or die("ERROR: no se puede insertar en la tabla administradores: " . mysqli_error($connection));

/*---------------------------------------------------------------
MONITORES
---------------------------------------------------------------*/
$coach = "CREATE TABLE IF NOT EXISTS monitor (
    id_monitor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    clave_usuario VARCHAR(255) NOT NULL,
    dni VARCHAR(9) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    codigo VARCHAR(255)
);";
mysqli_query($connection, $coach) or die("ERROR: no se puede crear la tabla monitores: " . mysqli_error($connection));

$insertCoach = "INSERT INTO monitor (id_monitor, nombre_usuario, clave_usuario, dni, nombre, apellidos, correo_electronico, telefono) VALUES 
                    (1, 'danielgonzalez', '" . hashPassword('daniel') . "', '43456952Y', 'Daniel', 'Gonzalez Garrote', 'danielgonzalez@gmail.com', '658991011'),
                    (2, 'mariahernandez', '" . hashPassword('maria') . "', '12345678X', 'Maria', 'Hernandez Lopez', 'mariahernandez@gmail.com', '612345678'),
                    (3, 'pedrolopez', '" . hashPassword('pedro') . "', '23456789Y', 'Pedro', 'Lopez Garcia', 'pedrolopez@gmail.com', '623456789'),
                    (4, 'juanperez', '" . hashPassword('juan') . "', '34567890Z', 'Juan', 'Perez Martinez', 'juanperez@gmail.com', '634567890'),
                    (5, 'luisgarcia', '" . hashPassword('luis') . "', '45678901A', 'Luis', 'Garcia Fernandez', 'luisgarcia@gmail.com', '645678901'),
                    (6, 'davidarranz', '" . hashPassword('david') . "', '45876315G', 'David', 'Arranz Fernandez', 'davidarranz@gmail.com', '687996633')";

mysqli_query($connection, $insertCoach) or die("ERROR: no se puede insertar en la tabla monitores: " . mysqli_error($connection));

/*---------------------------------------------------------------
TUTORES
---------------------------------------------------------------*/
// Crear la tabla tutor
$tutor = "CREATE TABLE IF NOT EXISTS tutor (
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50),
    clave_usuario VARCHAR(255),  
    dni VARCHAR(9) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    alta VARCHAR(2) DEFAULT 'NO',
    codigo VARCHAR(255) 
);";
mysqli_query($connection, $tutor) or die("ERROR: no se puede crear la tabla tutores: " . mysqli_error($connection));

// Insertar tutores con contraseñas cifradas
$insertTutor = "INSERT INTO tutor (id_tutor, nombre_usuario, clave_usuario, dni, nombre, apellidos, correo_electronico, telefono) VALUES 
                (1, 'candela', '" . hashPassword('candela') . "', '50558596J', 'Candela', 'Martinez Sanchez', 'candelamartinez@gmail.com', '654591011'),
                (2, 'sara', '" . hashPassword('sara') . "', '48978563P', 'Sara', 'Villanueva Rosa', 'saravillanueva@gmail.com', '600002563'),
                (3, 'irene', '" . hashPassword('irene') . "', '43854741M', 'Irene', 'del Rincon Bello', 'irenedelrincon@gmail.com', '677889630'),
                (4, 'raquel', '" . hashPassword('raquel') . "', '41456789F', 'Raquel', 'Cerdá Losa', 'raquelcerda@gmail.com', '630901045'),
                (5, 'raul', '" . hashPassword('raul') . "', '55789635L', 'Raúl', 'Perez Jiménez', 'raulperez@gmail.com', '777985236');";
mysqli_query($connection, $insertTutor) or die("ERROR: no se puede insertar en la tabla tutores: " . mysqli_error($connection));

/*---------------------------------------------------------------
OTRO TUTOR: persona de confianza del tutor
---------------------------------------------------------------*/
$otherTutor = "CREATE TABLE IF NOT EXISTS persona_confianza (
    id_otro_tutor INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT NOT NULL,                    
    nombre VARCHAR(255) NOT NULL,              
    apellidos VARCHAR(255) NOT NULL,   
    telefono VARCHAR(9) NOT NULL,
    dni VARCHAR(9) NOT NULL,          
    FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor)      
);";
mysqli_query($connection, $otherTutor) or die("ERROR: no se puede crear la tabla persona_confianza: " . mysqli_error($connection));

$insertOtherTutor = "INSERT INTO persona_confianza (id_otro_tutor, id_tutor, nombre, apellidos, telefono, dni) VALUES
                (1, 3, 'Juan', 'Perez Gutierrez', '687124563', '4878963A'),
                (2, 4, 'Guillermo', 'Simon Diaz', '620101417', '78996614J');";
mysqli_query($connection, $insertOtherTutor) or die("ERROR: no se puede insertar en la tabla persona_confianza: " . mysqli_error($connection));

/*---------------------------------------------------------------
NOTIFICACIONES
---------------------------------------------------------------*/
$notification = "CREATE TABLE IF NOT EXISTS notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_monitor INT NULL,
    id_tutor INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje VARCHAR(1000) NOT NULL,
    fecha DATE,
    FOREIGN KEY (id_monitor) REFERENCES monitor(id_monitor),
    FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor));";
mysqli_query($connection, $notification) or die("ERROR: no se puede crear la tabla Notificaciones: " . mysqli_error($connection));

$insertNotification = "INSERT INTO notificacion (id_notificacion, id_monitor, id_tutor, titulo, mensaje, fecha) VALUES
                (1, 1, 1, 'Nuevas actividades temáticas', '¡Tenemos nuevas actividades temáticas para que la diversión no pare! 🎭✨ Ven a disfrutar de experiencias únicas llenas de emoción y sorpresas. ¡No te lo pierdas! 🚀🎉', '2025-02-03'),
                (2, 1, 2, 'Nuevas actividades temáticas', '¡Tenemos nuevas actividades temáticas para que la diversión no pare! 🎭✨ Ven a disfrutar de experiencias únicas llenas de emoción y sorpresas. ¡No te lo pierdas! 🚀🎉', '2025-02-03'),
                (3, 1, 1, 'No se cancelan las actividades por lluvias', '¡La diversión sigue llueva o truene! ☔🌞 Nuestras actividades no se cancelan por lluvia, así que ven preparado para disfrutar al máximo. 💪🎉', '2025-02-10'),
                (4, 2, 2, 'Cambio de monitor', '⚠️ ¡Atención! Ha habido un cambio de monitor. Consulta los detalles para conocer a tu nuevo responsable. 👤✅', '2025-02-13'),
                (5, 2, 3, 'Cambio de monitor', '⚠️ ¡Atención! Ha habido un cambio de monitor. Consulta los detalles para conocer a tu nuevo responsable. 👤✅', '2025-02-13');";
mysqli_query($connection, $insertNotification) or die("ERROR: no se puede insertar en la tabla notificacion: " . mysqli_error($connection));

/*---------------------------------------------------------------
GRUPOS
---------------------------------------------------------------*/
$group = "CREATE TABLE IF NOT EXISTS grupo (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_monitor INT NOT NULL,
    nombre VARCHAR(255),
    horario_url VARCHAR(255) NULL, 
    fotos_url VARCHAR(255) NULL, 
    FOREIGN KEY (id_monitor) REFERENCES monitor(id_monitor)
);";
mysqli_query($connection, $group) or die("ERROR: no se puede crear la tabla Grupos: " . mysqli_error($connection));

$insertGroups = "INSERT INTO grupo (id_grupo, id_monitor, nombre, horario_url, fotos_url) VALUES
                (1, 1, 'Grupo A', '/sentikids/assets/img/horario1.png', 'https://photos.app.goo.gl/QVjuRxLqkkSU4QfL8'),
                (2, 2, 'Grupo B', '/sentikids/assets/img/horario2.png', 'https://photos.app.goo.gl/Lfgxp9aoYAjCa5DW8'),
                (3, 3, 'Grupo C', '/sentikids/assets/img/horario3.png', 'https://photos.app.goo.gl/4ZtkHEBxU7rSvcGt6'),
                (4, 4, 'Grupo D', '/sentikids/assets/img/horario4.png', 'https://photos.app.goo.gl/4mSmEPHWhUgJvh8W7'),
                (5, 5, 'Grupo E', '/sentikids/assets/img/horario5.png', 'https://photos.app.goo.gl/PeVkrjBMcqFdfQdz8');";  
mysqli_query($connection, $insertGroups) or die("ERROR: no se puede insertar en la tabla grupos: " . mysqli_error($connection));

/*---------------------------------------------------------------
NIÑOS
---------------------------------------------------------------*/
$kid = "CREATE TABLE IF NOT EXISTS hijo (
    id_hijo INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT,
    id_grupo INT,
    nombre VARCHAR(255) NOT NULL, 
    apellidos VARCHAR(255) NOT NULL, 
    fecha_nacimiento DATE, 
    dieta VARCHAR(255) NOT NULL,
    alergias VARCHAR(255), 
    FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
);";
mysqli_query($connection, $kid) or die("ERROR: no se puede crear la tabla Niños: " . mysqli_error($connection));

$insertKid = "INSERT INTO hijo (id_tutor, id_grupo, nombre, apellidos, fecha_nacimiento, dieta, alergias) VALUES
                (1, 1, 'Lucia', 'Gomez Fernandez', '2015-03-20', 'sin gluten', 'ninguna'),
                (2, 1, 'Carlos', 'Lopez Perez', '2014-07-15', 'sin lacteos', 'polen'),
                (3, 1, 'Elena', 'Rodriguez Ruiz', '2016-11-01', 'sin restricciones', 'ninguna'),
                (4, 1, 'Perdo', 'Lopez Guerra', '2016-01-01', 'sin restricciones', 'ninguna'),
                (5, 1, 'Ana', 'Ruiz Mora', '2016-12-01', 'sin restricciones', 'ninguna'),
                (1, 1, 'Elena', 'Rodriguez Perez', '2016-08-09', 'sin restricciones', 'ninguna'),
                (2, 1, 'Jose', 'Guevara Martin', '2016-11-01', 'sin restricciones', 'ninguna'),
                (2, 1, 'Pablo', 'Romero Luiz', '2015-02-01', 'sin restricciones', 'ninguna'),
                (3, 1, 'Daniel', 'Lloris Picasso', '2016-07,15', 'sin restricciones', 'ninguna'),
                (5, 1, 'Dora', 'Negrillo de la Rosa', '2016-11-01', 'sin restricciones', 'ninguna');";
mysqli_query($connection, $insertKid) or die("ERROR: no se puede insertar en la tabla niños: " . mysqli_error($connection));

/*---------------------------------------------------------------
ACTIVIDADES
---------------------------------------------------------------*/
$activity = "CREATE TABLE IF NOT EXISTS actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL);";
mysqli_query($connection, $activity) or die("ERROR: no se puede crear la tabla Actividades: " . mysqli_error($connection));




