<?php
// Se incluye la clase del modelo.
require_once('../../models/data/roles_tecnicos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $rol = new RolTecnicoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $rol->searchRows()) {
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
                    !$rol->setNombre($_POST['nombreRol'])
                ) {
                    $result['error'] = $rol->getDataError();
                } elseif ($rol->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Rol creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el rol';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $rol->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen roles registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$rol->setId($_POST['idRol'])) {
                    $result['error'] = $rol->getDataError();
                } elseif ($result['dataset'] = $rol->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Rol inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$rol->setId($_POST['idRol']) or
                    !$rol->setNombre($_POST['nombreRol'])
                ) {
                    $result['error'] = $rol->getDataError();
                } elseif ($rol->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Rol modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el rol';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$rol->setId($_POST['idRol'])
                ) {
                    $result['error'] = $rol->getDataError();
                } elseif ($rol->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Rol eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el rol. Por seguridad no puedes eliminar este rol porque esta siendo utilizado en otras tablas.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
