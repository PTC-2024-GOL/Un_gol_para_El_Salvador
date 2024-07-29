<?php
// Se incluye la clase del modelo.
require_once('../../models/data/partidos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $partido = new PartidosData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if ((isset($_SESSION['idAdministrador'])or isset($_SESSION['idTecnico']))/*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $partido->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$partido->setIdEquipo($_POST['idEquipo']) or
                    !$partido->setIdJornada($_POST['idJornada']) or
                    !$partido->setIdRival($_POST['idRival']) or
                    !$partido->setCancha($_POST['cancha']) or
                    !$partido->setResultadoPartido($_POST['resultado']) or
                    !$partido->setLocalidad($_POST['Localidad']) or
                    !$partido->setTipoResultadoPartido($_POST['tipoResultado']) or
                    !$partido->setFechaPartido($_POST['fechaPartido'])
                ) {
                    $result['error'] = $partido->getDataError();
                } elseif ($partido->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Partiddo creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el partido';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $partido->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen partidos registrados';
                }
                break;
            // Leer uno
            case 'readAllByIdEquipos':
                if (!$partido->setIdEquipo($_POST['idEquipo'])) {
                    $result['error'] = $partido->getDataError();
                } elseif ($result['dataset'] = $partido->readAllByIdEquipo()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'El equipo seleccionado aún no ha tenido partidos';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$partido->setIdPartido($_POST['idPartido'])) {
                    $result['error'] = $partido->getDataError();
                } elseif ($result['dataset'] = $partido->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Partido inexistente';
                }
                break;
                // Leer jornadas
            case 'readJornadas':
                if ($result['dataset'] = $partido->readOneJornada()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
                // Leer rivales
                case 'readRivales':
                    if ($result['dataset'] = $partido->readOneRivales()) {
                        $result['status'] = 1;
                        $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                    } else {
                        $result['error'] = 'No existen registros';
                    }
                    break;
                // Leer equipos
            case 'readEquipos':
                if ($result['dataset'] = $partido->readOneEquipos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$partido->setIdEquipo($_POST['idEquipo']) or
                    !$partido->setIdJornada($_POST['idJornada']) or
                    !$partido->setCancha($_POST['cancha']) or
                    !$partido->setResultadoPartido($_POST['resultado']) or
                    !$partido->setLocalidad($_POST['Localidad']) or
                    !$partido->setTipoResultadoPartido($_POST['tipoResultado']) or
                    !$partido->setIdPartido($_POST['idPartido']) or 
                    !$partido->setIdRival($_POST['idRival']) or
                    !$partido->setFechaPartido($_POST['fechaPartido'])
                ) {
                    $result['error'] = $partido->getDataError();
                } elseif ($partido->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Partido modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el partido';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$partido->setIdPartido($_POST['idPartido'])
                ) {
                    $result['error'] = $partido->getDataError();
                } elseif ($partido->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Partido eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el partido. Por seguridad no puedes eliminar este partido porque esta siendo ocupado por otras tablas.';
                }
                break;
            case 'lastMatch':
                if ($result['dataset'] = $partido->lastMatch()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
            case 'matchesResult':
                if (!$partido->setIdEquipo($_POST['idEquipo'])) {
                    $result['error'] = $partido->getDataError();
                } elseif ($result['dataset'] = $partido->matchesResult()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'El equipo seleccionado aún no ha tenido partidos';
                }
                break;
            case 'trainingAnylsis':
                if (!$partido->setIdEquipo($_POST['idEquipo'])) {
                    $result['error'] = $partido->getDataError();
                } elseif ($result['dataset'] = $partido->trainingAnylsis()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'El equipo seleccionado aún no ha tenido pruebas en los entrenamientos';
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
