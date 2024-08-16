<?php
// Se incluye la clase del modelo.
require_once('../../models/data/documentos_tecnicos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $documento = new DocumentosTecnicosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como Archivo, de lo contrario se finaliza el script con un mensaje de error.
    // También se verifica que el tiempo de su sesión no haya caducado aun.
    if (isset($_SESSION['idAdministrador'])/*and Validator::validateSessionTime()*/) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un Archivo ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!$documento->setTecnico($_POST['tecnico']) or
                    !Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $documento->searchRows()) {
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
                    !$documento->setNombre($_POST['nombreArchivo']) or
                    !$documento->setTecnico($_POST['tecnico']) or
                    !$documento->setArchivo($_FILES['archivo'])
                ) {
                    $result['error'] = $documento->getDataError();
                } elseif ($documento->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Archivo creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['archivo'], $documento::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el Archivo';
                }
                break;
                // Ver todo
            case 'readAll':
                if (!$documento->setTecnico($_POST['tecnico'])) {
                    $result['error'] = 'No hay documentos para este técnico';
                } elseif ($result['dataset'] = $documento->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen Archivos registrados';
                }
                break;
                // Ver uno
            case 'readOne':
                if (!$documento->setId($_POST['idDocumento'])) {
                    $result['error'] = 'Archivo incorrecto';
                } elseif ($result['dataset'] = $documento->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Archivo inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$documento->setId($_POST['idDocumento']) or
                    !$documento->setFilename() or
                    !$documento->setNombre($_POST['nombreArchivo']) or
                    !$documento->setTecnico($_POST['tecnico']) or
                    !$documento->setArchivo($_FILES['archivo'], $documento->getFilename())
                ) {
                    $result['error'] = $documento->getDataError();
                } elseif ($documento->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Archivo modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['archivo'], $documento::RUTA_IMAGEN, $documento->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el archivo';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$documento->setId($_POST['idDocumento']) or
                    !$documento->setFilename()
                ) {
                    $result['error'] = $documento->getDataError();
                } elseif ($documento->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Archivo eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($documento::RUTA_IMAGEN, $documento->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el archivo. Por seguridad no puedes eliminar este archivo porque esta siendo utilizado en otras tablas.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el Archivo no ha iniciado sesión.
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
