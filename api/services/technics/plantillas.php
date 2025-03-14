<?php
// Se incluye la clase del modelo.
require_once('../../models/data/plantillas_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $plantilla = new PlantillasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idTecnico']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $plantilla->searchRowsTechnics()) {
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
                    !$plantilla->setNombre($_POST['nombrePlantilla'])
                ) {
                    $result['error'] = $plantilla->getDataError();
                } elseif ($plantilla->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Plantilla creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el plantilla';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $plantilla->readAllTechnics()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen plantillas registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$plantilla->setId($_POST['idPlantilla'])) {
                    $result['error'] = $plantilla->getDataError();
                } elseif ($result['dataset'] = $plantilla->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Plantilla inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$plantilla->setId($_POST['idPlantilla']) or
                    !$plantilla->setNombre($_POST['nombrePlantilla'])
                ) {
                    $result['error'] = $plantilla->getDataError();
                } elseif ($plantilla->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Plantilla modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la plantilla';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$plantilla->setId($_POST['idPlantilla'])
                ) {
                    $result['error'] = $plantilla->getDataError();
                } elseif ($plantilla->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Plantilla eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la plantilla. Por seguridad no puedes eliminar esta plantilla porque esta siendo utilizada en otras tablas.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al contplantillaador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
