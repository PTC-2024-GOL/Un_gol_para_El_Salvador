<?php
// Se incluye la clase del modelo.
require_once('../../models/data/caracteristicas_analisis_data.php');
// Se incluye la clase de validación.
require_once('../../helpers/spiderWeb.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $caracteristica = new CaracteristicasAnalisisData;
    // Se instancia la clase de validación.
    $spider = new SpiderWeb();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime() and $spider->validateKey($_GET['key'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (
                    !$caracteristica->setEntrenamiento($_POST['idEntrenamiento']) or
                    !Validator::validateSearch($_POST['search'])
                ) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $caracteristica->searchRows()) {
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
                    !$caracteristica->setJugador($_POST['jugador']) or
                    !$caracteristica->setEntrenamiento($_POST['entrenamiento'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } else {
                    $caracteristicas = json_decode($_POST['caracteristicas'], true);
                    $success = true;
                    foreach ($caracteristicas as $carac) {
                        if (
                            !$caracteristica->setCaracteristica($carac['id_caracteristica_jugador']) or
                            !$caracteristica->setNota($carac['nota_caracteristica_analisis'])
                        ) {
                            $result['error'] = $caracteristica->getDataError();
                            $success = false;
                            break;
                        } elseif (!$caracteristica->createRow()) {
                            $result['error'] = 'Ocurrió un problema al crear las características';
                            $success = false;
                            break;
                        }
                    }
                    if ($success) {
                        $result['status'] = 1;
                        $result['message'] = 'Característica(s) creada(s) correctamente';
                    }
                }
                break;
                // Leer todos
            case 'readAll':
                if (
                    !$caracteristica->setEntrenamiento($_POST['idEntrenamiento'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($result['dataset'] = $caracteristica->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay característica registradas';
                }
                break;
                // Leer uno
            case 'readOne':
                if (
                    !$caracteristica->setEntrenamiento($_POST['idEntrenamiento']) or
                    !$caracteristica->setJugador($_POST['idJugador'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($result['dataset'] = $caracteristica->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'característica inexistente';
                }
                break;
                // Gráfica
            case 'graphic':
                if (
                    !$caracteristica->setEntrenamiento($_POST['idEntrenamiento']) or
                    !$caracteristica->setJugador($_POST['idJugador'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($result['dataset'] = $caracteristica->graphic()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Gráfica inexistente';
                }
                break;
                // Gráfica predictiva
            case 'predictAverageScoresNextWeek':
                if (
                    !$caracteristica->setJugador($_POST['idJugador'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($result['dataset'] = $caracteristica->predictAverageScoresNextWeek()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Gráfica inexistente';
                }
                break;
                // Gráfica de lineas 
            case 'graphicPromedyByJourney':
                if (
                    !$caracteristica->setEntrenamiento($_POST['idEntrenamiento']) or
                    !$caracteristica->setJugador($_POST['idJugador'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($result['dataset'] = $caracteristica->graphicPromedyByJourney()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Gráfica inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$caracteristica->setId($_POST['idCaracteristica']) or
                    !$caracteristica->setNota($_POST['nota']) or
                    !$caracteristica->setCaracteristica($_POST['clasificacionCaracteristica']) or
                    !$caracteristica->setJugador($_POST['jugador'])
                ) {
                    $result['error'] = $caracteristica->getDataError();
                } elseif ($caracteristica->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Característica modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la característica';
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
