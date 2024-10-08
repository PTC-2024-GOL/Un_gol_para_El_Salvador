<?php
// Se incluye la clase del modelo.
require_once('../../models/data/notificaciones_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $notificaciones = new NotificacionesData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idJugador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readMyNotis':
                if ($result['dataset'] = $notificaciones->readMyNotis()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen notificaciones registradas';
                }
                break;
            case 'filterNotis':
                if (!$notificaciones->setTipo($_POST['tipo'])) {
                    $result['error'] = $notificaciones->getDataError();
                } elseif ($result['dataset'] = $notificaciones->filterNotis()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen notificaciones registradas';
                }
                break;
            case 'markAsRead':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$notificaciones->setId($_POST['id'])
                ) {
                    $result['error'] = $notificaciones->getDataError();
                } elseif ($notificaciones->markAsRead()) {
                    $result['status'] = 1;
                    $result['message'] = 'Notificación vista';
                    // Se asigna el estado del archivo después de actualizar.
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la chat';
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
