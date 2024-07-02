<?php
// Se incluye la clase del modelo.
require_once('../../models/data/temporadas_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $temporada = new TemporadasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $temporada->searchRows()) {
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
                    !$temporada->setNombre($_POST['nombreTemporada'])
                ) {
                    $result['error'] = $temporada->getDataError();
                } elseif ($temporada->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Temporada creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la temporada, recuerda que el nombre de la temporada deber ser único';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $temporada->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen temporadas creadas';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$temporada->setId($_POST['idTemporada'])) {
                    $result['error'] = $temporada->getDataError();
                } elseif ($result['dataset'] = $temporada->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Temporada inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$temporada->setId($_POST['idTemporada']) or
                    !$temporada->setNombre($_POST['nombreTemporada'])
                ) {
                    $result['error'] = $temporada->getDataError();
                } elseif ($temporada->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Temporada modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la temporada, recuerda que el nombre de la temporada deber ser único';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$temporada->setId($_POST['idTemporada'])
                ) {
                    $result['error'] = $temporada->getDataError();
                } elseif ($temporada->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Temporada eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la temporada. Por seguridad no la puedes eliminar porque esta siendo utilizada en otros registros';
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
