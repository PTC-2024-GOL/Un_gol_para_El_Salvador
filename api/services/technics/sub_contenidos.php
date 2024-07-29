<?php
// Se incluye la clase del modelo.
require_once('../../models/data/sub_contenidos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $subcontenidos = new SubContenidosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if ((isset($_SESSION['idTecnico'])) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $subcontenidos->searchRows()) {
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
                    !$subcontenidos->setSubContenido($_POST['SubContenido']) or
                    !$subcontenidos->setIdContenido($_POST['idContenido'])  
                ) {
                    $result['error'] = $subcontenidos->getDataError();
                } elseif ($subcontenidos->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Subcontenido creado correctamente';
                } else {
                    $result['error'] = 'El nombre del subcontenido debe ser único';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $subcontenidos->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen subcontenidos registrados';
                }
                break;
                // Leer todos
            case 'readOneContents':
                if ($result['dataset'] = $subcontenidos->readOneContents()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen contenidos registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$subcontenidos->setId($_POST['idSubContenido'])) {
                    $result['error'] = $subcontenidos->getDataError();
                } elseif ($result['dataset'] = $subcontenidos->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Subcontenido inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$subcontenidos->setIdContenido($_POST['idContenido']) or
                    !$subcontenidos->setSubContenido($_POST['SubContenido']) or
                    !$subcontenidos->setId($_POST['idSubcontenido'])
                ) {
                    $result['error'] = $subcontenidos->getDataError();
                } elseif ($subcontenidos->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Subcontenido modificado correctamente';
                } else {
                    $result['error'] = 'El nombre del subcontenido debe ser único';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$subcontenidos->setId($_POST['idSubContenido'])
                ) {
                    $result['error'] = $subcontenidos->getDataError();
                } elseif ($subcontenidos->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Subcontenido eliminado correctamente';
                } else {
                    $result['error'] = 'No puedes eliminar este subcontenido porque esta siendo utilizado por contenido por entrenamiento';
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
