<?php
// Se incluye la clase del modelo.
require_once('../../models/data/tareas_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tarea = new TareasData;
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
                } elseif ($result['dataset'] = $tarea->searchRows()) {
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
                    !$tarea->setNombre($_POST['nombreTarea'])
                ) {
                    $result['error'] = $tarea->getDataError();
                } elseif ($tarea->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tarea creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la tarea';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $tarea->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen tareas registradas';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$tarea->setId($_POST['idTarea'])) {
                    $result['error'] = $tarea->getDataError();
                } elseif ($result['dataset'] = $tarea->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Tarea inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$tarea->setId($_POST['idTarea']) or
                    !$tarea->setNombre($_POST['nombreTarea'])
                ) {
                    $result['error'] = $tarea->getDataError();
                } elseif ($tarea->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tarea modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la tarea';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$tarea->setId($_POST['idTarea'])
                ) {
                    $result['error'] = $tarea->getDataError();
                } elseif ($tarea->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tarea eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la tarea. Por seguridad no puedes eliminar este tarea porque esta siendo utilizado en otras tablas.';
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
