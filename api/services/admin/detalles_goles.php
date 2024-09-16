<?php

// Se incluye la clase del modelo.
require_once('../../models/data/detalles_goles_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $detalleGol = new detallesGolesData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$detalleGol->setIdParticipacion($_POST['idParticipacion']) or
                    !$detalleGol->setCantidadGol($_POST['cantidadGol']) or
                !   $detalleGol->setIdTipoGol($_POST['tipoGol'])
                ) {
                    $result['error'] = $detalleGol->getDataError();
                } elseif ($detalleGol->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de gol creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el tipo de gol';
                }
                break;
            // Leer todos los goles de una participacion
            case 'readAllByIdParticipacion':
                if (!$detalleGol->setIdParticipacion($_POST['idParticipacion'])) {
                    $result['error'] = $detalleGol->getDataError();
                } elseif ($result['dataset'] = $detalleGol->readAllGoles()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'El jugador seleccionado no tiene goles en este partido';
                }
                break;
            case 'readOne':
                if (!$detalleGol->setIdDetalleGol($_POST['idDetalleGol'])) {
                    $result['error'] = $detalleGol->getDataError();
                } elseif ($result['dataset'] = $detalleGol->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrio un error';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$detalleGol->setCantidadGol($_POST['cantidadGol']) or
                    !$detalleGol->setIdTipoGol($_POST['tipoGol']) or
                    !$detalleGol->setIdDetalleGol($_POST['idDetalleGol'])
                ) {
                    $result['error'] = $detalleGol->getDataError();
                } elseif ($detalleGol->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de gol modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el tipo de gol';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$detalleGol->setIdDetalleGol($_POST['idDetalleGol'])
                ) {
                    $result['error'] = $detalleGol->getDataError();
                } elseif ($detalleGol->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de gol eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el tipo de gol';
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
