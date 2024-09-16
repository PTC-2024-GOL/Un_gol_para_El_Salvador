<?php
// Se incluye la clase del modelo.
require_once('../../models/data/rivales_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $Rival = new RivalesData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como Rival, de lo contrario se finaliza el script con un mensaje de error.
    // También se verifica que el tiempo de su sesión no haya caducado aun.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un Rival ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $Rival->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // Agregar
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Rival->setNombre($_POST['nombreRival']) or
                    !$Rival->setLogo($_FILES['logoRival'])
                ) {
                    $result['error'] = $Rival->getDataError();
                } elseif ($Rival->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Rival creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['logoRival'], $Rival::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el rival';
                }
                break;
                // Ver todo
            case 'readAll':
                if ($result['dataset'] = $Rival->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen Rivales registrados';
                }
                break;
                // Ver uno
            case 'readOne':
                if (!$Rival->setId($_POST['idRival'])) {
                    $result['error'] = 'Rival incorrecto';
                } elseif ($result['dataset'] = $Rival->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Rival inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Rival->setId($_POST['idRival']) or
                    !$Rival->setFilename() or
                    !$Rival->setNombre($_POST['nombreRival']) or
                    !$Rival->setLogo($_FILES['logoRival'], $Rival->getFilename())
                ) {
                    $result['error'] = $Rival->getDataError();
                } elseif ($Rival->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Rival modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['logoRival'], $Rival::RUTA_IMAGEN, $Rival->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el rival';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$Rival->setId($_POST['idRival']) or
                    !$Rival->setFilename()
                ) {
                    $result['error'] = $Rival->getDataError();
                } elseif ($Rival->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Rival eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($Rival::RUTA_IMAGEN, $Rival->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el rival. Por seguridad no puedes eliminar este rival porque esta siendo utilizado en otras tablas.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el Rival no ha iniciado sesión.
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
