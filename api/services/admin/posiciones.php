<?php
// Se incluye la clase del modelo.
require_once('../../models/data/posiciones_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $posicion = new PosicionesData();
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
                } elseif ($result['dataset'] = $posicion->searchRows()) {
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
                    !$posicion->setPosicion($_POST['nombrePosicion']) or
                    !$posicion->setAreaJuego($_POST['areaJuego'])
                ) {
                    $result['error'] = $posicion->getDataError();
                } elseif ($posicion->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Posición creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la posición, recuerda que el nombre de la posición debe ser única';
                }
                break;
            // Leer todos
            case 'readAll':
                if ($result['dataset'] = $posicion->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen posiciones registradas';
                }
                break;
            // Leer uno
            case 'readOne':
                if (!$posicion->setIdPosicion($_POST['idPosicion'])) {
                    $result['error'] = $posicion->getDataError();
                } elseif ($result['dataset'] = $posicion->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Posición inexistente';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$posicion->setIdPosicion($_POST['idPosicion']) or
                    !$posicion->setPosicion($_POST['nombrePosicion']) or
                    !$posicion->setAreaJuego($_POST['areaJuego'])
                ) {
                    $result['error'] = $posicion->getDataError();
                } elseif ($posicion->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Posición modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la posición, recuerda que el nombre de la posición debe ser única';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$posicion->setIdPosicion($_POST['idPosicion'])
                ) {
                    $result['error'] = $posicion->getDataError();
                } elseif ($posicion->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Posición eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la posición. Por seguridad no puedes eliminarla porque esta siendo ocupada en otros registros.';
                }
                break;
            // Gráfica
            case 'graphic':
                if ($result['dataset'] = $posicion->graphic()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Gráfica inexistente';
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
