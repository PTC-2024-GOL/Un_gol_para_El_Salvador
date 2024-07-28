<?php
// Se incluye la clase del modelo.
require_once('../../models/data/equipos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $equipo = new EquiposData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idTecnico']) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $equipo->searchRowsTecnicos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $equipo->readAllByIdTecnico()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen equipos registrados';
                }
                break;
                // Leer todos
            case 'readAllSelect':
                if ($result['dataset'] = $equipo->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen equipos registrados';
                }
                break;
                // Leer cuerpo tecnico del equipo
            case 'readAllStaff':
                if (!$equipo->setId($_POST['idEquipo'])) {
                    $result['error'] = $equipo->getDataError();
                } elseif ($result['dataset'] = $equipo->readAllStaff()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Equipo inexistente';
                }
                break;
                // Leer todos los equipos filtrados por genero
            case 'readAllByGender':
                if (!$equipo->setGeneroEquipo($_POST['generoEquipo'])) {
                    $result['error'] = $equipo->getDataError();
                } elseif ($result['dataset'] = $equipo->readAllByGenderTecnicos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Equipos inexistente';
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
