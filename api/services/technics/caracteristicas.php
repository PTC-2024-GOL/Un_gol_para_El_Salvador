<?php
// Se incluye la clase del modelo.
require_once('../../models/data/caracteristicas_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $caracteristica = new CaracteristicasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idTecnico']) /*and Validator::validateSessionTime()*/) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $caracteristica->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                //crear
                case 'createRow':
                    $_POST = Validator::validateForm($_POST);
                    if (
                        !$caracteristica->setNombre($_POST['caracteristicaJugador']) or
                        !$caracteristica->setClasificacion($_POST['clasificacionCaracteristica']) 
                    ) {
                        $result['error'] = $caracteristica->getDataError();
                    } elseif ($caracteristica->createRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Caracteristica creada correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear la característica';
                    }
                    break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $caracteristica->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay característica registradas';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$caracteristica->setId($_POST['idCaracteristica'])) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($result['dataset'] = $caracteristica->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'característica inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$caracteristica->setId($_POST['idCaracteristica']) or
                    !$caracteristica->setNombre($_POST['caracteristicaJugador']) or
                    !$caracteristica->setClasificacion($_POST['clasificacionCaracteristica'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($caracteristica->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Característica modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la característica';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$caracteristica->setId($_POST['idCaracteristica'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($caracteristica->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'caracterísca eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la caracterísca. Por seguridad no la puedes eliminar porque se ocupa en otros registros';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        
    } else {
        switch ($_GET['action']) {

            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}