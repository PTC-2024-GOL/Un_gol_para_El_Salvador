<?php
// Se incluye la clase del modelo.
require_once ('../../models/data/entrenamientos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $entrenamientos = new EntrenamientosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if ((isset($_SESSION['idAdministrador']) or true) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $entrenamientos->searchRows()) {
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
                    !$entrenamientos->setFechaEntrenamiento($_POST['fecha']) or
                    !$entrenamientos->setSesion($_POST['sesion']) or
                    !$entrenamientos->setIdEquipo($_POST['idEquipo']) or
                    !$entrenamientos->setIdCategoria($_POST['idCategoria']) or
                    !$entrenamientos->setIdHorario($_POST['idHorario']) or
                    !$entrenamientos->setIdJornada($_POST['idJornada']) 
                ) {
                    $result['error'] = $entrenamientos->getDataError();
                } elseif ($entrenamientos->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Entrenamiento creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el entrenamiento';
                }
                break;
            // Leer todos
            case 'readAll':
                if (!$entrenamientos->setIdJornada($_POST['idJornada'])) {
                    $result['error'] = $entrenamientos->getDataError();
                } elseif ($result['dataset'] = $entrenamientos->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Entrenamientos inexistentes';
                }
                break;
            // Leer uno
            case 'readOneDetalles':
                if (!$entrenamientos->setIdEntrenamiento($_POST['idEntrenamiento'])) {
                    $result['error'] = $entrenamientos->getDataError();
                } elseif ($result['dataset'] = $entrenamientos->readOneDetalles()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Aún no se han asignado contenidos a este entrenamiento, presiona aceptar para agregar contenidos al entrenamiento';
                }
                break;
                 // Leer uno
            case 'readOneTitulo':
                if (!$entrenamientos->setIdJornada($_POST['idJornada'])) {
                    $result['error'] = $entrenamientos->getDataError();
                } elseif ($result['dataset'] = $entrenamientos->readOneTitulo()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Detalle del entrenamiento inexistente';
                }
                break;
            // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$entrenamientos->setFechaEntrenamiento($_POST['fecha']) or
                    !$entrenamientos->setSesion($_POST['sesion']) or
                    !$entrenamientos->setIdJornada($_POST['idJornada']) or
                    !$entrenamientos->setIdEntrenamiento($_POST['idEntrenamiento']) or
                    !$entrenamientos->setIdCategoria($_POST['idCategoria']) or
                    !$entrenamientos->setIdHorario($_POST['idHorario'])
                ) {
                    $result['error'] = $entrenamientos->getDataError();
                } elseif ($entrenamientos->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Entrenamiento modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el entrenamiento';
                }
                break;
            //Desde aqui van los select

            // Leer todos
            case 'readJornadas':
                if ($result['dataset'] = $entrenamientos->readOneJornada()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
                case 'readEquipos':
                    if ($result['dataset'] = $entrenamientos->readOneEquipos()) {
                        $result['status'] = 1;
                        $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                    } else {
                        $result['error'] = 'No existen registros';
                    }
                    break;
            // Leer equipos
            case 'readOneHorario':
                if ($result['dataset'] = $entrenamientos->readOneHorario()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
            // Leer equipos
            case 'readOneCategoria':
                if ($result['dataset'] = $entrenamientos->readOneCategoria()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
            case 'readOne':
                if (!$entrenamientos->setIdEntrenamiento($_POST['idEntrenamiento'])) {
                    $result['error'] = $entrenamientos->getDataError();
                } elseif ($result['dataset'] = $entrenamientos->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Entrenamiento inexistente';
                }
                break;

            // Eliminar
            case 'deleteRow':
                if (
                    !$entrenamientos->setIdEntrenamiento($_POST['idEntrenamiento'])
                ) {
                    $result['error'] = $entrenamientos->getDataError();
                } elseif ($entrenamientos->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Entrenamiento eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el entrenamiento. Por seguridad no puedes eliminarlo porque se esta ocupando en otros registros';
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
