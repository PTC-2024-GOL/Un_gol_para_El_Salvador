<?php
// Se incluye la clase del modelo.
require_once('../../models/data/jugadores_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $jugador = new JugadoresData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'recaptcha' => 0, 'message' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idJugador'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un técnico ha iniciado sesión.
        switch ($_GET['action']) {
                // Traer datos del usuario
            case 'getUser':
                if (isset($_SESSION['aliasJugador'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['aliasJugador'];
                    $result['foto'] = $_SESSION['fotoJugador'];
                    $result['nombre'] = $_SESSION['nombreJugador'];
                    $result['apellido'] = $_SESSION['apellidoJugador'];
                } else {
                    $result['error'] = 'Alias de Jugador indefinido';
                }
                break;
            case 'getUserMobile':
                if (isset($_SESSION['correoJugador'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['nombreJugador'];
                    $result['apellido'] = $_SESSION['apellidoJugador'];
                    $result['foto'] = $_SESSION['fotoJugador'];
                } else {
                    $result['error'] = 'Nombre de Jugador indefinido';
                }
                break;
            case 'graphicMobile':
                if ($result['dataset'] = $jugador->graphicMobile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No se encontraron datos para la gráfica';
                }
                break;
            case 'promByPlayerMobilePlayers':
                if ($result['dataset'] = $jugador->promByPlayerMobilePlayers()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema el promedio';
                }
                break;
            case 'matchesByPlayeMobilePLayers':
                if ($result['dataset'] = $jugador->matchesByPlayeMobilePLayers()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el jugador';
                }
                break;
            case 'notesByPlayerMobilePlayers':
                if ($result['dataset'] = $jugador->notesByPlayerMobilePlayers()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer las notas del jugador';
                }
                break;
            case 'readOneMobile':
                if ($result['dataset'] = $jugador->readOneMobile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'readOneStats':
                if ($result['dataset'] = $jugador->readOneStats()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
                // Cambiar contraseña
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$jugador->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveCliente'] == $_POST['claveActual']) {
                    $result['error'] = 'No puedes reutilizar la clave actual';
                } elseif ($_POST['claveCliente'] != $_POST['repetirclaveCliente']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$jugador->setClave($_POST['claveCliente'])) {
                    $result['error'] = $jugador->getDataError();
                } elseif ($jugador->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
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
                if ($jugador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un técnico para comenzar';
                }
                break;
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                if (!$jugador->checkUser($_POST['correo'], $_POST['clave'])) {
                    $result['error'] = 'Credenciales incorrectas';
                } elseif ($jugador->checkStatus()) {
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
