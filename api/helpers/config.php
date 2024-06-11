<?php
// Encabezado para permitir solicitudes de cualquier origen.
header('Access-Control-Allow-Origin: *');
// Se establece la zona horaria local para la fecha y hora del servidor.
date_default_timezone_set('America/El_Salvador');
// Constantes para establecer las credenciales de conexión con el servidor de bases de datos.
define('SERVER', 'localhost');
define('DATABASE', 'db_gol_sv');
define('USERNAME', 'dbGol'); //Poner dbGol de usuario
define('PASSWORD', '1234'); //Poner de clave del 1 al 4
?>