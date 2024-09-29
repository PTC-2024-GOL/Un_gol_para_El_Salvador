<?php
// Se incluye la clase del modelo.
require_once('../../models/data/palmares_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $palmares = new PalmaresData;
    // Se instancia la clase de validación.
    $spider = new SpiderWeb();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime() and $spider->validateKey($_GET['key'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $palmares->searchRows()) {
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
                    !$palmares->setEquipo($_POST['equipo']) or
                    !$palmares->setTemporada($_POST['temporada']) or
                    !$palmares->setLugar($_POST['lugar'])
                ) {
                    $result['error'] = $palmares->getDataError();
                } elseif ($palmares->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Reconocimiento ingresado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al ingresar el reconocimiento';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $palmares->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen reconocimientos registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$palmares->setId($_POST['idPalmares'])) {
                    $result['error'] = $palmares->getDataError();
                } elseif ($result['dataset'] = $palmares->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Reconocimiento inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$palmares->setId($_POST['idPalmares']) or
                    !$palmares->setEquipo($_POST['equipo']) or
                    !$palmares->setTemporada($_POST['temporada']) or
                    !$palmares->setLugar($_POST['lugar'])
                ) {
                    $result['error'] = $palmares->getDataError();
                } elseif ($palmares->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Reconocimiento editado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al editar el reconocimiento';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$palmares->setId($_POST['idPalmares'])
                ) {
                    $result['error'] = $palmares->getDataError();
                } elseif ($palmares->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Reconocimiento eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la reconocimiento.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al contTareaador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
