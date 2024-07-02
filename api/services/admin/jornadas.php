<?php
// Se incluye la clase del modelo.
require_once('../../models/data/jornadas_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $jornada = new JornadasData;
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
                } elseif ($result['dataset'] = $jornada->searchRows()) {
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
                    !$jornada->setNombre($_POST['nombreJornada']) or
                    !$jornada->setNumero($_POST['numeroJornada']) or
                    !$jornada->setPlantilla($_POST['plantilla']) or
                    !$jornada->setFechaInicio($_POST['fechaInicial']) or
                    !$jornada->setFechaFin($_POST['fechaFinal'])
                ) {
                    $result['error'] = $jornada->getDataError();
                } elseif ($jornada->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Jornada creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el jornada';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $jornada->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen jornadas registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$jornada->setId($_POST['idJornada'])) {
                    $result['error'] = $jornada->getDataError();
                } elseif ($result['dataset'] = $jornada->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Jornada inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$jornada->setId($_POST['idJornada']) or
                    !$jornada->setNombre($_POST['nombreJornada']) or
                    !$jornada->setNumero($_POST['numeroJornada']) or
                    !$jornada->setPlantilla($_POST['plantilla']) or
                    !$jornada->setFechaInicio($_POST['fechaInicial']) or
                    !$jornada->setFechaFin($_POST['fechaFinal'])
                ) {
                    $result['error'] = $jornada->getDataError();
                } elseif ($jornada->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Jornada modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la jornada';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$jornada->setId($_POST['idJornada'])
                ) {
                    $result['error'] = $jornada->getDataError();
                } elseif ($jornada->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Jornada eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la jornada';
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
