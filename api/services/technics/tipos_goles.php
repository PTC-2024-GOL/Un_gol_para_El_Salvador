<?php


// Se incluye la clase del modelo.
require_once('../../models/data/tipos_goles_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tipoGol = new TiposGolesData();
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
                } elseif ($result['dataset'] = $tipoGol->searchRows()) {
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
                    !$tipoGol->setNombreGol($_POST['nombreGol']) or
                    !$tipoGol->setIdTipoJugada($_POST['idJugada'])
                ) {
                    $result['error'] = $tipoGol->getDataError();
                } elseif ($tipoGol->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de gol creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el tipo de gol';
                }
                break;
            // Leer todos
            case 'readAll':
                if ($result['dataset'] = $tipoGol->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen tipos de goles registrados';
                }
                break;
            // Leer uno
            case 'readOne':
                if (!$tipoGol->setIdTipoGol($_POST['idGol'])) {
                    $result['error'] = $tipoGol->getDataError();
                } elseif ($result['dataset'] = $tipoGol->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Tipo de gol inexistente';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$tipoGol->setIdTipoGol($_POST['idGol']) or
                    !$tipoGol->setIdTipoJugada($_POST['idJugada']) or
                    !$tipoGol->setNombreGol($_POST['nombreGol'])
                ) {
                    $result['error'] = $tipoGol->getDataError();
                } elseif ($tipoGol->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de gol modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el tipo de gol';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$tipoGol->setIdTipoGol($_POST['idGol'])
                ) {
                    $result['error'] = $tipoGol->getDataError();
                } elseif ($tipoGol->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de gol eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el tipo de gol. Por seguridad no puedes elimininarlo cuando lo estas ocupando en otras tablas';
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
