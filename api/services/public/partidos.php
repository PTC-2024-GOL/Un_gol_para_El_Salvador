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
            // Leer todos
        case 'readAll':
            if ($result['dataset'] = $partido->readAll()) {
                $result['status'] = 1;
                $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
            } else {
                $result['error'] = 'No existen partidos registrados';
            }
            break;
        case 'readAllTheLast5':
            if ($result['dataset'] = $partido->readAllTheLast5()) {
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
        case 'readAllByIdEquiposTop20':
            if (!$partido->setIdEquipo($_POST['idEquipo'])) {
                $result['error'] = $partido->getDataError();
            } elseif ($result['dataset'] = $partido->readAllByIdEquipoLimit20()) {
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
            // Leer uno
        case 'readOnePublic':
            if (!$partido->setIdPartido($_POST['idPartido'])) {
                $result['error'] = $partido->getDataError();
            } elseif ($result['dataset'] = $partido->readOnePublic()) {
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
        default:
            $result['error'] = 'Acción no disponible';
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al contplantillaador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
