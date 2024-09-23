<?php
// Se incluye la clase del modelo.
require_once('../../models/data/tecnicos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tecnico = new TecnicosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'recaptcha' => 0, 'message' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idTecnico'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un técnico ha iniciado sesión.
        switch ($_GET['action']) {
                // Traer datos del usuario
            case 'getUser':
                if (isset($_SESSION['aliasTecnico'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['aliasTecnico'];
                    $result['foto'] = $_SESSION['fotoTecnico'];
                    $result['nombre'] = $_SESSION['nombreTecnico'];
                    $result['apellido'] = $_SESSION['apellidoTecnico'];
                } else {
                    $result['error'] = 'Alias de Tecnico indefinido';
                }
                break;
                case 'getUserMobile':
                    if (isset($_SESSION['correoTecnico'])) {
                        $result['status'] = 1;
                        $result['username'] = $_SESSION['nombreTecnico'];
                        $result['apellido'] = $_SESSION['apellidoTecnico'];
                        $result['foto'] = $_SESSION['fotoTecnico'];
                    } else {
                        $result['error'] = 'Nombre de Tecnico indefinido';
                    }
                    break;
                //leer perfil
            case 'readProfile':
                    if ($result['dataset'] = $tecnico->readProfile()) {
                        $result['status'] = 1;
                    } else {
                        $result['error'] = 'Ocurrió un problema al leer el perfil';
                        }
                break;
                // Ver uno en perfil
            case 'readOneProfile':
                if ($result['dataset'] = $tecnico->readOneProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Perfil inexistente';
                }
                break;
                // Ver uno
            case 'readOne':
                if ($result['dataset'] = $tecnico->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Perfil inexistente';
                }
                break;
                // Cambiar contraseña
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$tecnico->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveCliente'] == $_POST['claveActual']) {
                    $result['error'] = 'No puedes reutilizar la clave actual';
                } elseif ($_POST['claveCliente'] != $_POST['repetirclaveCliente']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$tecnico->setClave($_POST['claveCliente'],
                $tecnico->getNombre(),
                $tecnico->getApellido(),
                $tecnico->getNacimiento(),
                $tecnico->getTelefono(),
                $tecnico->getCorreo())) {
                    $result['error'] = $tecnico->getDataError();
                } elseif ($tecnico->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
             // Actualizar perfil
            case 'updateRowProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$tecnico->setNombre($_POST['nombrePerfil']) or
                    !$tecnico->setApellido($_POST['apellidoPerfil']) or
                    !$tecnico->setFilenameProfile() or
                    !$tecnico->setCorreo($_POST['correoPerfil']) or
                    !$tecnico->setTelefono($_POST['telefonoPerfil']) or
                    !$tecnico->setDUI($_POST['duiPerfil']) or
                    !$tecnico->setNacimiento($_POST['fechanacimientoPerfil']) or
                    !$tecnico->setImagen($_FILES['imagen'], $tecnico->getFilename())
                ) {
                    $result['error'] = $tecnico->getDataError();
                } elseif ($tecnico->updateRowProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagen'], $tecnico::RUTA_IMAGEN, $tecnico->getFilename());
                    $_SESSION['nombreTecnico'] = $_POST['nombrePerfil'];
                    $_SESSION['apellidoTecnico'] = $_POST['apellidoPerfil'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            // Leer usuarios para verificar que hayan en la base de datos
            case 'readUsers':
                if ($tecnico->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un técnico para comenzar';
                }
                break;
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                if (!$tecnico->checkUser($_POST['correo'], $_POST['clave'])) {
                    $result['error'] = 'Credenciales incorrectas';
                } elseif ($tecnico->checkStatus()) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                } else {
                    $result['error'] = 'La cuenta ha sido desactivada';
                }
                break;
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
