<?php

// Se incluye la clase del modelo.
require_once('../../models/data/tipos_jugadas_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tipoJugada = new TiposJugadasData();
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
                } elseif ($result['dataset'] = $tipoJugada->searchRows()) {
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
                    !$tipoJugada->setNombreJugada($_POST['nombreJugada'])
                ) {
                    $result['error'] = $tipoJugada->getDataError();
                } elseif ($tipoJugada->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de jugada creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el tipo de jugada, recuerda que el nombre debe ser único';
                }
                break;
            // Leer todos
            case 'readAll':
                if ($result['dataset'] = $tipoJugada->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen tipos de jugadas registrados';
                }
                break;
            // Leer uno
            case 'readOne':
                if (!$tipoJugada->setIdTipoJugada($_POST['idTipoJugada'])) {
                    $result['error'] = $tipoJugada->getDataError();
                } elseif ($result['dataset'] = $tipoJugada->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Tipo de jugada inexistente';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$tipoJugada->setIdTipoJugada($_POST['idTipoJugada']) or
                    !$tipoJugada->setNombreJugada($_POST['nombreJugada'])
                ) {
                    $result['error'] = $tipoJugada->getDataError();
                } elseif ($tipoJugada->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de jugada modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el tipo de jugada, recuerda que el nombre debe ser único';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$tipoJugada->setIdTipoJugada($_POST['idTipoJugada'])
                ) {
                    $result['error'] = $tipoJugada->getDataError();
                } elseif ($tipoJugada->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de jugada eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el tipo de jugada. Por seguridad no la puedes eliminar porque la estas ocupando en otra tablas.';
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
