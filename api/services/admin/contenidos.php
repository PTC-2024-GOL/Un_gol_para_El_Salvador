<?php
// Se incluye la clase del modelo.
require_once('../../models/data/contenidos_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $contenidos = new ContenidosData;
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
                } elseif ($result['dataset'] = $contenidos->searchRows()) {
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
                    !$contenidos->setZona($_POST['zona']) or
                    !$contenidos->setMomento($_POST['momento'])
                ) {
                    $result['error'] = $contenidos->getDataError();
                } elseif ($contenidos->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Momento de juego creado correctamente';
                } else {
                    $result['error'] = 'Esta combinación de zona y momento ya existe';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $contenidos->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen momentos registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$contenidos->setId($_POST['idContenido'])) {
                    $result['error'] = $contenidos->getDataError();
                } elseif ($result['dataset'] = $contenidos->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Momento de juego inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$contenidos->setId($_POST['idContenido']) or
                    !$contenidos->setZona($_POST['zona']) or
                    !$contenidos->setMomento($_POST['momento'])
                ) {
                    $result['error'] = $contenidos->getDataError();
                } elseif ($contenidos->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Momento de juego modificado correctamente';
                } else {
                    $result['error'] = 'Esta combinación de zona y momento ya existe';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$contenidos->setId($_POST['idContenido'])
                ) {
                    $result['error'] = $contenidos->getDataError();
                } elseif ($contenidos->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Momento de juego eliminado correctamente';
                } else {
                    $result['error'] = 'El momento de juego esta relacionado con un principio, elimina los principios relacionados primero';
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
