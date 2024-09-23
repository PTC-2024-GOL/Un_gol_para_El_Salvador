<?php
// Se incluye la clase del modelo.
require_once('../../models/data/tipologia_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tipologia = new TipologiaData;
    // Se instancia la clase de validación.
    $spider = new SpiderWeb();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime() and $spider->validateKey($_GET['key'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $tipologia->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                //crear
                case 'createRow':
                    $_POST = Validator::validateForm($_POST);
                    if (
                        !$tipologia->setNombre($_POST['nombreTipologia'])
                    ) {
                        $result['error'] = $tipologia->getDataError();
                    } elseif ($tipologia->createRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Tipología creada correctamente';
                    } else {
                        $result['error'] = 'No se ha podido crear tipología, porque ya ha sido creada.';
                    }
                    break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $tipologia->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay tipologías registradas';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$tipologia->setId($_POST['idTipologia'])) {
                    $result['error'] = $tipologia->getDataError();
                } elseif ($result['dataset'] = $tipologia->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Tipología inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$tipologia->setId($_POST['idTipologia']) or
                    !$tipologia->setNombre($_POST['nombreTipologia']) 
                ) {
                    $result['error'] = $tipologia->getDataError();
                } elseif ($tipologia->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipología modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la tipología';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$tipologia->setId($_POST['idTipologia'])
                ) {
                    $result['error'] = $tipologia->getDataError();
                } elseif ($tipologia->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipología eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la tipología. Por seguridad no puedes eliminarla porque esta siendo utilizada en otros registros.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        
    } else {
        switch ($_GET['action']) {

            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}