<?php
// Se incluye la clase del modelo.
require_once('../../models/data/asistencias_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $asistencias = new AsistenciasData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if ((isset($_SESSION['idJugador'])) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Leer información de entrenamiento por jugador
            case 'readOnePlayer':
                if (!$asistencias->setIdJugador($_SESSION['idJugador']) or
                    !$asistencias->setIdJornada($_POST['idJornada'])) {
                    $result['error'] = $asistencias->getDataError();
                } elseif ($result['dataset'] = $asistencias->readOnePlayer()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Este jugador no tiene entrenamientos con asistencia';
                }
                break;
            // Leer información estadistica de asistencias por jugador
            case 'readOnePlayerStadistic':
                if (!$asistencias->setIdJugador($_SESSION['idJugador']) or
                    !$asistencias->setIdJornada($_POST['idJornada'])) {
                    $result['error'] = $asistencias->getDataError();
                } elseif ($result['dataset'] = $asistencias->readOnePlayerStadistic()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Este jugador no tiene entrenamientos con asistencia';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al contplantillaador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
