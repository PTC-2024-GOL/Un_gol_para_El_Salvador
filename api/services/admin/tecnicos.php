<?php
// Se incluye la clase del modelo.
require_once('../../models/data/tecnicos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $Tecnico = new TecnicosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como Tecnico, de lo contrario se finaliza el script con un mensaje de error.
    // También se verifica que el tiempo de su sesión no haya caducado aun.
    if (isset($_SESSION['idAdministrador'])/*and Validator::validateSessionTime()*/) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un Tecnico ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $Tecnico->searchRows()) {
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
                    !$Tecnico->setNombre($_POST['nombreTecnico']) or
                    !$Tecnico->setApellido($_POST['apellidoTecnico']) or
                    !$Tecnico->setClave($_POST['claveTecnico']) or
                    !$Tecnico->setCorreo($_POST['correoTecnico']) or
                    !$Tecnico->setTelefono($_POST['telefonoTecnico']) or
                    !$Tecnico->setDUI($_POST['duiTecnico']) or
                    !$Tecnico->setNacimiento($_POST['nacimientoTecnico']) or
                    !$Tecnico->setImagen($_FILES['imagenTecnico'])
                ) {
                    $result['error'] = $Tecnico->getDataError();
                } elseif ($_POST['claveTecnico'] != $_POST['repetirclaveTecnico']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($Tecnico->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Técnico creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenTecnico'], $Tecnico::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el técnico';
                }
                break;
                // Ver todo
            case 'readAll':
                if ($result['dataset'] = $Tecnico->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen técnicos registrados';
                }
                break;
                // Ver uno
            case 'readOne':
                if (!$Tecnico->setId($_POST['idTecnico'])) {
                    $result['error'] = 'Técnico incorrecto';
                } elseif ($result['dataset'] = $Tecnico->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Técnico inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Tecnico->setId($_POST['idTecnico']) or
                    !$Tecnico->setFilename() or
                    !$Tecnico->setNombre($_POST['nombreTecnico']) or
                    !$Tecnico->setApellido($_POST['apellidoTecnico']) or
                    !$Tecnico->setCorreo($_POST['correoTecnico']) or
                    !$Tecnico->setTelefono($_POST['telefonoTecnico']) or
                    !$Tecnico->setDUI($_POST['duiTecnico']) or
                    !$Tecnico->setNacimiento($_POST['nacimientoTecnico']) or
                    !$Tecnico->setImagen($_FILES['imagenTecnico'], $Tecnico->getFilename())
                ) {
                    $result['error'] = $Tecnico->getDataError();
                } elseif ($Tecnico->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Técnico modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenTecnico'], $Tecnico::RUTA_IMAGEN, $Tecnico->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el técnico';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$Tecnico->setId($_POST['idTecnico']) or
                    !$Tecnico->setFilename()
                ) {
                    $result['error'] = $Tecnico->getDataError();
                } elseif ($Tecnico->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Técnico eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($Tecnico::RUTA_IMAGEN, $Tecnico->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el técnico';
                }
                break;
                // Estado
            case 'changeState':
                if (
                    !$Tecnico->setId($_POST['idTecnico'])
                ) {
                    $result['error'] = $Tecnico->getDataError();
                } elseif ($Tecnico->changeState()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado del técnico cambiado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al alterar el estado del técnico';
                }
                break;
                // Traer datos del usuario
            case 'getUser':
                if (isset($_SESSION['aliasTecnico'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['aliasTecnico'];
                    $result['foto'] = $_SESSION['fotoTecnico'];
                    $result['nombre'] = $_SESSION['nombreTecnico'];
                } else {
                    $result['error'] = 'Alias de Tecnico indefinido';
                }
                break;
                // Cambiar contraseña -- mas adelante
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$Tecnico->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveTecnico'] == $_POST['claveActual']) {
                    $result['error'] = 'No puedes reutilizar la clave actual';
                } elseif ($_POST['claveTecnico'] != $_POST['repetirclaveTecnico']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$Tecnico->setClave($_POST['claveTecnico'])) {
                    $result['error'] = $Tecnico->getDataError();
                } elseif ($Tecnico->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el Tecnico no ha iniciado sesión.
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
