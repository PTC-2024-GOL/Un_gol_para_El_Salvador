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
    if (isset($_SESSION['idTecnico']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $participacion->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $participacion->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen participaciones registradas';
                }
                break;
            // Leer todos los jugadores de un equipo
            case 'readAllByIdEquipo':
                if (!$participacion->setIdEquipo($_POST['idEquipo'])) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($result['dataset'] = $participacion->readAllByIdEquipo()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Aún no hay jugadores agregados a este equipo';
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
            case 'readAllByAreaJuego':
                if (
                    !$participacion->setAreaJuego($_POST['areaJuego']) or
                    !$participacion->setIdEquipo($_POST['idEquipo'])
                ) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($result['dataset'] = $participacion->readByPlayerArea()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Aún no hay jugadores ingresados en esta área de juego';
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
