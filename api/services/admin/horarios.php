<?php
// Se incluye la clase del modelo.
require_once('../../models/data/horarios_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $horario = new HorariosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $horario->searchRows()) {
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
                    !$horario->setNombre($_POST['nombreHora']) or
                    !$horario->setDia($_POST['diaEntreno']) or
                    !$horario->setCampo($_POST['campoEntreno']) or
                    !$horario->setHoraInicio($_POST['horarioInicial']) or
                    !$horario->setHoraFinal($_POST['horarioFinal'])
                ) {
                    $result['error'] = $horario->getDataError();
                } elseif ($horario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Horario creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el horario';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $horario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen horario registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$horario->setId($_POST['idHorario'])) {
                    $result['error'] = $horario->getDataError();
                } elseif ($result['dataset'] = $horario->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Horario inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$horario->setId($_POST['idHorario']) or
                    !$horario->setNombre($_POST['nombreHora']) or
                    !$horario->setDia($_POST['diaEntreno']) or
                    !$horario->setCampo($_POST['campoEntreno']) or
                    !$horario->setHoraInicio($_POST['horarioInicial']) or
                    !$horario->setHoraFinal($_POST['horarioFinal'])
                ) {
                    $result['error'] = $horario->getDataError();
                } elseif ($horario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Horario modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el horario';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$horario->setId($_POST['idHorario'])
                ) {
                    $result['error'] = $horario->getDataError();
                } elseif ($horario->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Horario eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el horario';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
