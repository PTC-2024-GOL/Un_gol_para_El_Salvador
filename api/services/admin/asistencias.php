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
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Crear
                case 'createRow':
                    //Se decodifica el arreglo de objetos que se envía por POST desde la petición.
                    $arregloAsistencia = json_decode($_POST['arregloAsistencia'], true);
                    $_POST = Validator::validateForm($_POST);
                    
                    // Validación y creación de cada registro en el arreglo
                    foreach ($arregloAsistencia as $asistencia) {
                        if (
                            !$asistencias->setIdEntrenamiento($asistencia['id_entrenamiento']) or
                            !$asistencias->setIdJugador($asistencia['id']) or
                            !$asistencias->setIdHorario($_POST['idHorario']) or
                            !$asistencias->setAsistencia($asistencia['asistencia']) or
                            !$asistencias->setIdObservacion($asistencia['observacion']) or
                            !$asistencias->setIdAsistenciaBool($_POST['idAsistenciaBool']) or
                            !$asistencias->setIdAsistencia($asistencia['id_asistencia'])
                        ) {
                            $result['error'] = $asistencias->getDataError();
                            break;
                        } elseif (!$asistencias->createRow()) {
                            $result['error'] = 'Ocurrió un problema al guardar la asistencia del jugador con ID ' . $asistencia['id'];
                            break;
                        }
                    }
    
                    if (!isset($result['error'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Asistencias guardadas correctamente';
                    }
                    break;
                // Leer todos caso normal
            case 'readAll':
                if (!$asistencias->setIdEntrenamiento($_POST['idEntrenamiento'])) {
                    $result['error'] = $asistencias->getDataError();
                } elseif ($result['dataset'] = $asistencias->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'este entrenamiento no existe, recargar página';
                }
                break;
                 // Leer todos caso default
            case 'readAlldefault':
                if (!$asistencias->setIdEntrenamiento($_POST['idEntrenamiento'])) {
                    $result['error'] = $asistencias->getDataError();
                } elseif ($result['dataset'] = $asistencias->readAlldefault()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'este entrenamiento no existe, recargar página';
                }
                break;
                // Saber si ya se ha registrado una asistencia
            case 'readOne':
                if (!$asistencias->setIdEntrenamiento($_POST['idEntrenamiento'])) {
                    $result['error'] = $asistencias->getDataError();
                } elseif ($result['dataset'] = $asistencias->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'este entrenamiento no existe, recargar página';
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
