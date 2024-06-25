<?php


// Se incluye la clase del modelo.
require_once('../../models/data/detalles_amonestaciones_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $detalleAmonestacion = new detallesAmonestacionesData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$detalleAmonestacion->setIdParticipacion($_POST['idParticipacion']) or
                    !$detalleAmonestacion->setAmonestacion($_POST['amonestacion']) or
                    !$detalleAmonestacion->setNumeroAmonestacion($_POST['numeroAmonestacion'])
                ) {
                    $result['error'] = $detalleAmonestacion->getDataError();
                } elseif ($detalleAmonestacion->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Amonestación creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al ingresar la amonestación';
                }
                break;
            // Leer todos los goles de una participacion
            case 'readAllByIdParticipacion':
                if (!$detalleAmonestacion->setIdParticipacion($_POST['idParticipacion'])) {
                    $result['error'] = $detalleAmonestacion->getDataError();
                } elseif ($result['dataset'] = $detalleAmonestacion->readAllAmonestaciones()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Aún no se han registrado amonestaciones';
                }
                break;
            case 'readOne':
                if (!$detalleAmonestacion->setIdDetalleAmonestacion($_POST['idDetalleAmonestacion'])) {
                    $result['error'] = $detalleAmonestacion->getDataError();
                } elseif ($result['dataset'] = $detalleAmonestacion->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrio un error';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$detalleAmonestacion->setAmonestacion($_POST['amonestacion']) or
                    !$detalleAmonestacion->setNumeroAmonestacion($_POST['numeroAmonestacion']) or
                    !$detalleAmonestacion->setIdDetalleAmonestacion($_POST['idDetalleAmonestacion'])
                ) {
                    $result['error'] = $detalleAmonestacion->getDataError();
                } elseif ($detalleAmonestacion->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Amonestación modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la amonestación';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$detalleAmonestacion->setIdDetalleAmonestacion($_POST['idDetalleAmonestacion'])
                ) {
                    $result['error'] = $detalleAmonestacion->getDataError();
                } elseif ($detalleAmonestacion->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Amonestación eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la amonestación';
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
