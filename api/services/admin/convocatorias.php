<?php
// Se incluye la clase del modelo.
require_once('../../models/data/convocatorias_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $convocatoria = new ConvocatoriasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) /*and Validator::validateSessionTime()*/) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Crear
            case 'savesCalls':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$convocatoria->setPartido($_POST['partido'])
                ) {
                    $result['error'] = $convocatoria->getDataError();
                } else {
                    $convocatorias = json_decode($_POST['convocatoria'], true);
                    $success = true;
                    foreach ($convocatorias as $convocados) {
                        if (
                            !$convocatoria->setJugador($convocados['jugador']) or
                            !$convocatoria->setEstado($convocados['convocado'])
                        ) {
                            $result['error'] = $convocatoria->getDataError();
                            $success = false;
                            break;
                        } elseif (!$convocatoria->savesCalls()) {
                            $result['error'] = 'Ocurrió un problema al crear las características';
                            $success = false;
                            break;
                        }
                    }
                    if ($success) {
                        $result['status'] = 1;
                        $result['message'] = 'Convocatoria guardada correctamente';
                    }
                }
                break;
                // Leer todos
            case 'readAll':
                if (
                    !$convocatoria->setPartido($_POST['partido'])
                ) {
                    $result['error'] = $convocatoria->getDataError();
                } elseif ($result['dataset'] = $convocatoria->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay característica registradas';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
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
