<?php

// Se incluye la clase del modelo.
require_once('../../models/data/calendario_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $calendario = new CalendarioData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idTecnico']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$calendario->setTitulo($_POST['titulo']) or
                    !$calendario->setFechaInicial($_POST['fechaInicial']) or
                    !$calendario->setFechaFinal($_POST['fechaFinal']) or
                    !$calendario->setColor($_POST['color'])
                ) {
                    $result['error'] = $calendario->getDataError();
                } else {
                    $newEventId = $calendario->createRow();
                    if($newEventId){
                        $result['status'] = 1;
                        $result['message'] = 'Evento creado exitosamente';
                        $result['dataset'] = ['idCalendario' => $newEventId];
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el evento';
                    }
                }
                break;
            // Leer todos
            case 'readAll':
                if ($result['dataset'] = $calendario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen eventos registrados';
                }
                break;
            case 'readOne':
                if (!$calendario->setIdCalendario($_POST['idCalendario'])) {
                    $result['error'] = $calendario->getDataError();
                } elseif ($result['dataset'] = $calendario->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrio un error al ver este evento';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$calendario->setIdCalendario($_POST['idCalendario']) or
                    !$calendario->setTitulo($_POST['titulo']) or
                    !$calendario->setFechaInicial($_POST['fechaInicial']) or
                    !$calendario->setFechaFinal($_POST['fechaFinal']) or
                    !$calendario->setColor($_POST['color'])
                ) {
                    $result['error'] = $calendario->getDataError();
                } elseif ($calendario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Evento modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el evento';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$calendario->setIdCalendario($_POST['idCalendario'])
                ) {
                    $result['error'] = $calendario->getDataError();
                } elseif ($calendario->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Evento eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el evento.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna a la petición.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}

