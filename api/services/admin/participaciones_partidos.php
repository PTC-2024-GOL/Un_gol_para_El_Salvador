<?php


// Se incluye la clase del modelo.
require_once('../../models/data/participaciones_partidos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $participacion = new ParticipacionesPartidosData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$participacion->setIdPartido($_POST['idPartido']) or
                    !$participacion->setIdJugador($_POST['idJugador']) or
                    !$participacion->setTitularidad($_POST['titular']) or
                    !$participacion->setSustitucion($_POST['sustitucion']) or
                    !$participacion->setMinutosJugados($_POST['minutos']) or
                    !$participacion->setAsistencias($_POST['asistencia']) or
                    !$participacion->setEstadoAnimo($_POST['animo']) or
                    !$participacion->setPuntuacion($_POST['puntuacion'])
                ) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($participacion->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Participación creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la participación';
                }
                break;
            // Leer todos
            case 'readAll':
                if ($result['dataset'] = $participacion->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen lesiones registradas';
                }
                break;
            // Leer todos los jugadores de un equipo
            case 'readAllByIdEquipo':
                if ($result['dataset'] = $participacion->readAllByIdEquipo()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen jugadores registrados en este equipo';
                }
                break;
            // Leer uno
            case 'readOne':
                if (!$participacion->setIdParticipacion($_POST['idParticipacion'])) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($result['dataset'] = $participacion->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Participación inexistente';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$participacion->setIdPartido($_POST['idPartido']) or
                    !$participacion->setIdJugador($_POST['idJugador']) or
                    !$participacion->setTitularidad($_POST['titular']) or
                    !$participacion->setSustitucion($_POST['sustitucion']) or
                    !$participacion->setMinutosJugados($_POST['minutos']) or
                    !$participacion->setAsistencias($_POST['asistencia']) or
                    !$participacion->setEstadoAnimo($_POST['animo']) or
                    !$participacion->setPuntuacion($_POST['puntuacion']) or
                    !$participacion->setIdParticipacion($_POST['idParticipacion'])
                ) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($participacion->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Participación modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la participación';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$participacion->setIdParticipacion($_POST['idParticipacion'])
                ) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($participacion->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Participación eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la participación';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al conttipos de lesionador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
