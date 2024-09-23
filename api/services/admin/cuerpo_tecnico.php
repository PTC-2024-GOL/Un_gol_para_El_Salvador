<?php
// Se incluye la clase del modelo.
require_once('../../models/data/cuerpo_tecnico_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $cuerpotecnico = new CuerpoTecnicoData;
    // Se instancia la clase de validación.
    $spider = new SpiderWeb();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime() and $spider->validateKey($_GET['key'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $cuerpotecnico->searchRows()) {
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
                        !$cuerpotecnico->setNombre($_POST['cuerpoTecnico'])
                    ) {
                        $result['error'] = $cuerpotecnico->getDataError();
                    } elseif ($cuerpotecnico->createRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Cuerpo técnico creado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el cuerpo técnico';
                    }
                    break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $cuerpotecnico->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay cuerpos técnicos registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$cuerpotecnico->setId($_POST['idCuerpotecnico'])) {
                    $result['error'] = $cuerpotecnico->getDataError();
                } elseif ($result['dataset'] = $cuerpotecnico->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cuerpo técnico inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cuerpotecnico->setId($_POST['idCuerpotecnico']) or
                    !$cuerpotecnico->setNombre($_POST['cuerpoTecnico']) 
                ) {
                    $result['error'] = $cuerpotecnico->getDataError();
                } elseif ($cuerpotecnico->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cuerpo técnico modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el cuerpo técnico';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$cuerpotecnico->setId($_POST['idCuerpotecnico'])
                ) {
                    $result['error'] = $cuerpotecnico->getDataError();
                } elseif ($cuerpotecnico->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cuerpo técnico eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el cuerpo técnico. Por seguridad no puedes eliminar este cuerpo técnico porque esta siendo utilizado en otras tablas.';
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