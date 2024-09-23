<?php
// Se incluye la clase del modelo.
require_once('../../models/data/jugadores_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $jugador = new JugadoresData;
    // Se instancia la clase de validación.
    $spider = new SpiderWeb();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime() and $spider->validateKey($_GET['key'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $jugador->searchRows()) {
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
                    !$jugador->setDorsal($_POST['dorsal']) or
                    !$jugador->setNombre($_POST['nombre']) or
                    !$jugador->setApellido($_POST['apellido']) or
                    !$jugador->setEstatus($_POST['estado']) or
                    !$jugador->setNacimiento($_POST['nacimiento']) or
                    !$jugador->setGenero($_POST['genero']) or
                    !$jugador->setPerfil($_POST['perfil']) or
                    !$jugador->setBecado($_POST['beca']) or
                    !$jugador->setIdPosicion1($_POST['posicion1']) or
                    !$jugador->setIdPosicion2($_POST['posicion2']) or
                    !$jugador->setTelefono($_POST['telefono']) or
                    !$jugador->setTelefonoEmergencia($_POST['telefonoEmergencia']) or
                    !$jugador->setCorreo($_POST['correo']) or
                    !$jugador->setTipoSangre($_POST['tipoSangre']) or
                    !$jugador->setObservacionMedica($_POST['observacionMedica']) or
                    !$jugador->setClave($_POST['clave']) or
                    !$jugador->setImagen($_FILES['imagen'])
                ) {
                    $result['error'] = $jugador->getDataError();
                } elseif ($_POST['clave'] != $_POST['repetirClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($jugador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Jugador creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagen'], $jugador::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al ingresar al jugador.';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $jugador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen jugadores registrados';
                }
                break;
            // Ver uno
            case 'readOne':
                if (!$jugador->setId($_POST['idJugador'])) {
                    $result['error'] = 'Jugador incorrecto';
                } elseif ($result['dataset'] = $jugador->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Jugador inexistente';
                }
                break;
            // Ver uno
            case 'readAllByGender':
                if (!$jugador->setGenero($_POST['genero'])) {
                    $result['error'] = 'Jugador incorrecto';
                } elseif ($result['dataset'] = $jugador->readAllByGender()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Jugador inexistente';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$jugador->setId($_POST['idJugador']) or
                    !$jugador->setFilename() or
                    !$jugador->setNombre($_POST['nombre']) or
                    !$jugador->setApellido($_POST['apellido']) or
                    !$jugador->setDorsal($_POST['dorsal']) or
                    !$jugador->setEstatus($_POST['estado']) or
                    !$jugador->setNacimiento($_POST['nacimiento']) or
                    !$jugador->setGenero($_POST['genero']) or
                    !$jugador->setPerfil($_POST['perfil']) or
                    !$jugador->setBecado($_POST['beca']) or
                    !$jugador->setIdPosicion1($_POST['posicion1']) or
                    !$jugador->setIdPosicion2($_POST['posicion2']) or
                    !$jugador->setTelefono($_POST['telefono']) or
                    !$jugador->setTelefonoEmergencia($_POST['telefonoEmergencia']) or
                    !$jugador->setCorreo($_POST['correo']) or
                    !$jugador->setTipoSangre($_POST['tipoSangre']) or
                    !$jugador->setObservacionMedica($_POST['observacionMedica']) or
                    !$jugador->setImagen($_FILES['imagen'], $jugador->getFilename())
                ) {
                    $result['error'] = $jugador->getDataError();
                } elseif ($jugador->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Jugador modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagen'], $jugador::RUTA_IMAGEN, $jugador->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar al jugador';
                }
                break;
            // Eliminar
            case 'deleteRow':
                if (
                    !$jugador->setId($_POST['idJugador']) or
                    !$jugador->setFilename()
                ) {
                    $result['error'] = $jugador->getDataError();
                } elseif ($jugador->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Jugador eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($jugador::RUTA_IMAGEN, $jugador->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar al jugador. Por seguridad no puedes eliminar este jugador porque esta siendo utilizado en otras tablas.';
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
