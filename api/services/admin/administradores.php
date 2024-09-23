<?php
// Se incluye la clase del modelo.
require_once('../../models/data/administradores_data.php');
require_once('../../models/data/recuperacion_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action']) && isset($_GET['key'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $administrador = new AdministradoresData;
    $cambio_contra = new RecuperacionData;
    // Se instancia la clase de validación.
    $spider = new SpiderWeb();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'fecha' => null, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null, 'TwoFA_required' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
   // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
   if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime() and $spider->validateKey($_GET['key'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch2($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $administrador->searchRows()) {
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
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setClave($_POST['claveAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador']) or
                    !$administrador->setTelefono($_POST['telefonoAdministrador']) or
                    !$administrador->setDUI($_POST['duiAdministrador']) or
                    !$administrador->setNacimiento($_POST['nacimientoAdministrador']) or
                    !$administrador->setImagen($_FILES['imagenAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($_POST['claveAdministrador'] != $_POST['repetirclaveAdministrador']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($administrador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenAdministrador'], $administrador::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el administrador';
                }
                break;
                // Ver todo
            case 'readAll':
                if ($result['dataset'] = $administrador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen administradores registrados';
                }
                break;
            case 'readProfile':
                if ($result['dataset'] = $administrador->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
                // Ver uno
            case 'readOne':
                if (!$administrador->setId($_POST['idAdministrador'])) {
                    $result['error'] = 'Administrador incorrecto';
                } elseif ($result['dataset'] = $administrador->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Administrador inexistente';
                }
                break;
                // Ver uno en perfil
            case 'readOneProfile':
                if ($result['dataset'] = $administrador->readOneProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Perfil inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setId($_POST['idAdministrador']) or
                    !$administrador->setFilename() or
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador']) or
                    !$administrador->setTelefono($_POST['telefonoAdministrador']) or
                    !$administrador->setDUI($_POST['duiAdministrador']) or
                    !$administrador->setNacimiento($_POST['nacimientoAdministrador']) or
                    !$administrador->setImagen($_FILES['imagenAdministrador'], $administrador->getFilename())
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenAdministrador'], $administrador::RUTA_IMAGEN, $administrador->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el administrador';
                }
                break;
                // Actualizar perfil
            case 'updateRowProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['nombrePerfil']) or
                    !$administrador->setApellido($_POST['apellidoPerfil']) or
                    !$administrador->setFilenameProfile() or
                    !$administrador->setCorreo($_POST['correoPerfil']) or
                    !$administrador->setTelefono($_POST['telefonoPerfil']) or
                    !$administrador->setDUI($_POST['duiPerfil']) or
                    !$administrador->setNacimiento($_POST['fechanacimientoPerfil']) or
                    !$administrador->setImagen($_FILES['imagen'], $administrador->getFilename())
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->updateRowProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagen'], $administrador::RUTA_IMAGEN, $administrador->getFilename());
                    $_SESSION['nombreAdministrador'] = $_POST['nombrePerfil'];
                    $_SESSION['apellidoAdministrador'] = $_POST['apellidoPerfil'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if ($_POST['idAdministrador'] == $_SESSION['idAdministrador']) {
                    $result['error'] = 'No se puede eliminar a sí mismo';
                } elseif (
                    !$administrador->setId($_POST['idAdministrador']) or
                    !$administrador->setFilename()
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($administrador::RUTA_IMAGEN, $administrador->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el administrador';
                }
                break;
                // Estado
            case 'changeState':
                if ($_POST['idAdministrador'] == $_SESSION['idAdministrador']) {
                    $result['error'] = 'No se puede bloquear a sí mismo';
                } elseif (
                    !$administrador->setId($_POST['idAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->changeState()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado de administrador cambiado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al alterar el estado del administrador';
                }
                break;
                // Traer datos del usuario
            case 'getUser':
                if (isset($_SESSION['aliasAdministrador'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['aliasAdministrador'];
                    $result['foto'] = $_SESSION['fotoAdministrador'];
                    $result['nombre'] = $_SESSION['nombreAdministrador'];
                    $result['apellido'] = $_SESSION['apellidoAdministrador'];
                } else {
                    $result['error'] = 'Alias de administrador indefinido';
                }
                break;
                // Cerrar sesión
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
                // Cambiar contraseña
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$administrador->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveAdministrador'] == $_POST['claveActual']) {
                    $result['error'] = 'No puedes reutilizar la clave actual';
                } elseif ($_POST['claveAdministrador'] != $_POST['repetirclaveAdministrador']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$administrador->setClave($_POST['claveAdministrador'])) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            //Metodo para crear el codigo de autenticacion por primera vez.
            case 'newAuthenticationCode':
                $_POST = Validator::validateForm($_POST);
                if (!$administrador->setCorreo($_POST['correo'])){
                    $result['error'] = $administrador->getDataError();
                }else{
                    //Generamos y guardamos el codigo de autenticacion.
                    $qrCodeUrl = $administrador->saveAuthenticationCode();

                    if($qrCodeUrl){
                        $result['status'] = 1;
                        $result['dataset'] = $qrCodeUrl;
                    }else{
                        $result['error'] = 'No se pudo generar el código de autenticación.';
                    }
                }
            // Verifica si el usuario ya tiene segundo factor de autenticacion activado
            case 'verify2Fa':
                if ($administrador->getCode()) {
                    $result['status'] = 1;
                    $result['message'] = '2FA activado.';
                } else {
                    $result['error'] = 'Aún no tienes el 2FA activado.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action'] and $spider->validateKey($_GET['key'])) {

                // Leer usuarios para verificar que hayan en la base de datos
            case 'readUsers':
                if ($administrador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar oa';
                } else {
                    $result['error'] = 'Debe crear un administrador para comenzar';
                }
                break;
                // Metodo para el primer uso
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setClave($_POST['claveAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador']) or
                    !$administrador->setTelefono($_POST['telefonoAdministrador']) or
                    !$administrador->setDUI($_POST['duiAdministrador']) or
                    !$administrador->setNacimiento($_POST['nacimientoAdministrador']) or
                    !$administrador->setImagen($_FILES['imagenAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($_POST['claveAdministrador'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($administrador->firstUser()) {
                    $result['status'] = 1;
                    $result['message'] = 'Primer administrador registrado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenAdministrador'], $administrador::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar al primer administrador';
                }
                break;
                // Metodo para el inicio de sesión
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                //Autenticación exitosa
                if ($administrador->checkUser($_POST['alias'], $_POST['clave'])) {
                        $result['message'] = $spider->validateKey($_GET['key']);
                    if ($administrador->getCondicion() == 'temporizador') {
                        if ($result['fecha'] = $administrador->getHoy()) {
                            //el usuario tiene un contador de tiempo para iniciar sesión
                            $result['error'] = 'Intento iniciar sesión varias veces y su tiempo de bloqueo aun no ha acabado';
                        }
                    } elseif ($administrador->getCondicion() == 'clave') {
                        $correos = $administrador->getCorreo();
                        $fecha = new DateTime(); // Si deseas obtener la fecha actual
                        $nivel = 1; // Asignas un valor predeterminado al nivel
                        if (
                            !$cambio_contra->setFecha($fecha->format('Y-m-d H:i:s')) or
                            !$cambio_contra->setNivel($nivel) or
                            !$cambio_contra->setCorreo($correos)
                        ) {
                            $result['error'] = $cambio_contra->getDataError();
                        } elseif ($cambio_contra->readIdUsuario()) {
                            if ($cambio_contra->createHash()) {
                                if ($cambio_contra->updateHash()) {
                                    //aqui pondré lo del envio del correo y allí acaba el proceso
                                    if ($cambio_contra->envioCorreo()) {
                                        $result['error'] = 'Debes cambiar la contraseña, porque ya son 90 dias, se te envio un correo al gmail para que hagas el proceso';
                                    } else {
                                        $result['error'] = 'Ocurrió un problema al enviar el correo';
                                    }
                                } else {
                                    $result['error'] = 'Ocurrió un problema al agregar a la base el hash';
                                }
                            } else {
                                $result['error'] = 'Ocurrió un problema al crear el hash';
                            }
                        } else {
                            $result['error'] = 'Ocurrió un problema al leer el id del usuario';
                        }
                    } elseif ($administrador->getCondicion() == 'tiempo') {
                        //el usuario intento iniciar sesión demasiadas veces por lo que se le pondra un contador de tiempo
                        if ($administrador->uploadTimeAttempt()) {
                            //el usuario será bloqueado por acumular intentos fallidos.
                            if ($administrador->blockUser()) {
                                $result['error'] = 'Ha intentado iniciar sesión demasiadas veces, su cuenta sera desactivada durante un día';
                            } else {
                                $result['exception'] = 'Error en el servidor';
                            }
                        } else {
                            $result['exception'] = 'Error en el servidor';
                        }
                    } else {
                        if ($administrador->getCondicion() == 'bloqueado') {
                            //el usuario será bloqueado por acumular intentos fallidos.
                            if ($administrador->blockUser2()) {
                                //El usuario esta bloqueado
                                $result['error'] = 'Su cuenta ha sido bloqueada. Contacte a los administradores.';
                            } else {
                                $result['exception'] = 'Error en el servidor';
                            }
                            //El usuario esta bloqueado
                            $result['error'] = 'Su cuenta ha sido bloqueada. Contacte a los administradores.';
                        } else {
                            //Se reinician los intentos del inicio de sesión
                            if ($administrador->resetAttempts()) {
                            // Verifica si el usuario tiene activada la autenticación de dos factores
                                if($administrador->getCode() !== null){
                                    // Verifica si no se ha enviado aún el código 2FA desde el frontend
                                    if (!isset($_POST['code'])) {
                                        // Enviar respuesta al frontend para indicar que se requiere 2FA
                                        $result['TwoFA_required'] = true;
                                        $result['error'] = 'Se requiere autenticación de dos factores. Ingresa tu código';
                                        //Se destruye la sesion si verifica que no viene el codigo.
                                        session_destroy();
                                    } else {
                                        // El código de 2FA debe venir del frontend, ingresado por el usuario, se verifica que viene bien
                                        if($administrador->checkAuthenticationCode($_POST['code'])){
                                            $codigo = $_POST['code'];
                                            // Verificamos el código TOTP
                                            if($administrador->getAuthenticationCode($codigo)){
                                                // Código 2FA correcto, procedemos a la autenticación completa
                                                $result['status'] = 1;
                                                $result['message'] = 'Autenticación correcta';
                                                $result['username'] = $spider->validateKey($_GET['key']); 
                                                $_SESSION['tiempo'] = time();
                                            }else{
                                                // El código de 2FA es incorrecto
                                                $result['error'] = 'Código de autenticación incorrecto.';
                                                //se destruye la sesion si el codigo esta mal.
                                                session_destroy();
                                            }
                                        }else{
                                            $result['error'] = $administrador->getDataError();
                                        }
                                    }
                                }else{
                                    // Si no hay autenticación de dos factores activada inicia normalmente
                                    $result['status'] = 1;
                                    $result['message'] = 'Autenticación correcta';
                                    $_SESSION['tiempo'] = time();
                                    $result['TwoFA_required'] = false; //Segundo factor de autenticacion desactivado.
                                }
                            }
                            //Se controla algún error en el servidor al reiniciar los intentos 
                            else {
                                $result['exception'] = 'Error en el servidor';
                            }
                        }
                    }
                }
                //Autenticación fallida 
                else {
                    //El usuario falló el intento de sesión al no introducir sus credenciales correctamente, se le añade un intento a su cuenta
                    if ($administrador->addAttempt()) {
                        $result['error'] = 'Credenciales incorrectas';
                    }
                    //Se controla algún error en el servidor al agregarle un intento de inicio de sesión
                    else {
                        $result['exception'] = 'Error en el servidor';
                    }
                }
                $administrador->resetCondition();
                break;
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión o key incorrecta ';
                $result['exception'] =  $spider->validateKey($_GET['key']);
                $result['message'] =  $_GET['key'];
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
