<?php
// Se incluye la clase del modelo.
require_once ('../../models/data/participaciones_partidos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $participacion = new ParticipacionesPartidosData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if ((isset($_SESSION['idJugador'])) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Leer todos
            case 'readOne':
                if (!$participacion->setIdPartido($_POST['idPartido']) or
                    !$participacion->setIdJugador($_POST['idJugador'])
                ) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($result['dataset'] = $participacion->readParticipationPlayer()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Entrenamientos inexistentes';
                }
                break;
            case 'updateMoodRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$participacion->setEstadoAnimo($_POST['animo']) or
                    !$participacion->setIdParticipacion($_POST['idParticipacion'])
                ) {
                    $result['error'] = $participacion->getDataError();
                } elseif ($participacion->updateMoodRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado de ánimo guardado exitosamente';
                } else {
                    $result['error'] = 'Aún no has ingresado la participación del jugador. Ingresa su participación de este partido';
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
        print (json_encode($result));
    } else {
        print (json_encode('Acceso denegado'));
    }
} else {
    print (json_encode('Recurso no disponible'));
}
