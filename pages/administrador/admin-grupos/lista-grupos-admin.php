<?php

include '../../../server/database.php';

if (isset($_POST['id_grupo'])) {
    $id_grupo = $_POST['id_grupo'];

    // Preparación de la sentencia SQL para prevenir SQL Injection
    $query = "SELECT 
                    h.id_hijo, 
                    h.nombre AS nombre_hijo, 
                    h.apellidos AS apellidos_hijo, 
                    h.fecha_nacimiento, 
                    h.dieta, 
                    h.alergias, 
                    t.nombre AS nombre_tutor, 
                    t.apellidos AS apellidos_tutor, 
                    t.telefono AS telefono_tutor, 
                    t.correo_electronico, 
                    ot.nombre AS nombre_otro_tutor, 
                    ot.apellidos AS apellidos_otro_tutor, 
                    ot.telefono AS telefono_otro_tutor
                FROM hijo h 
                JOIN tutor t ON h.id_tutor = t.id_tutor 
                LEFT JOIN persona_confianza ot ON t.id_tutor = ot.id_tutor
                WHERE h.id_grupo = ?";

    // Usar sentencias preparadas para evitar SQL Injection
    if ($stmt = $connection->prepare($query)) {
        $stmt->bind_param("i", $id_grupo);  // 'i' indica que es un parámetro de tipo entero
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Envio datos al js.
        $json = array();
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $json[] = array(
                'id_hijo' => $row['id_hijo'],
                'nombre_hijo' => $row['nombre_hijo'],
                'apellidos_hijo' => $row['apellidos_hijo'],
                'fecha_nacimiento' => $row['fecha_nacimiento'],
                'dieta' => $row['dieta'],
                'alergias' => $row['alergias'],
                'nombre_tutor' => $row['nombre_tutor'],
                'apellidos_tutor' => $row['apellidos_tutor'],
                'telefono_tutor' => $row['telefono_tutor'],
                'correo_electronico' => $row['correo_electronico'],
                'nombre_otro_tutor' => $row['nombre_otro_tutor'],
                'apellidos_otro_tutor' => $row['apellidos_otro_tutor'],
                'telefono_otro_tutor' => $row['telefono_otro_tutor']
            );
        }
        $jsonString = json_encode($json);
        echo $jsonString;

        $stmt->close();
    } else {
        echo "Error al preparar la consulta: " . $connection->error;
    }
}

