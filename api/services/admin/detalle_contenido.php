<?php
// Se incluye la clase del modelo.
require_once ('../../models/data/detalle_contenido_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $detalle = new DetalleContenidoData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if ((isset($_SESSION['idAdministrador']) or true) /*and Validator::validateSessionTime()*/) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Buscar detalles
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $detalle->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // Buscar horarios
            case 'searchRowsHorario':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $detalle->searchRowsHorario()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // Crear detalle contenido
            case 'createRow':
                $_POST = Validator::validateForm($_POST);

                // Decodificar el arreglo de jugadores
                $arregloJugadores = json_decode($_POST['arregloJugadores'], true);

                if (is_array($arregloJugadores)) {
                    foreach ($arregloJugadores as $idJugador) {
                        // Convertir el ID del jugador a un entero
                        $idJugador = intval($idJugador);

                        if (
                            !$detalle->setIdSubContenido($_POST['idSubContenido']) or
                            !$detalle->setCantidadSubContenido($_POST['CantidadSubContenido']) or
                            !$detalle->setIdTarea($_POST['IdTarea']) or
                            !$detalle->setCantidadTarea($_POST['CantidadTarea']) or
                            !$detalle->setIdJugador($idJugador) or
                            !$detalle->setIdEntrenamiento($_POST['idEntrenamiento'])
                        ) {
                            $result['error'] = $detalle->getDataError();
                            break;
                        } elseif (!$detalle->createRow()) {
                            $result['error'] = 'Ocurrió un problema al crear el detalle del contenido para el jugador con ID ' . $idJugador;
                            break;
                        }
                    }

                    if (!isset($result['error'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Detalle contenido creado correctamente para todos los jugadores.';
                    }
                } else {
                    $result['error'] = 'Formato de arregloJugadores no es válido.';
                }
                break;


            // Leer todos los horarios
            case 'readAllHorario':
                if ($result['dataset'] = $detalle->readAllHorario()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
            // Leer todos los contenidos
            case 'readAllDContenido':
                if (!$detalle->setIdEntrenamiento($_POST['idEntrenamiento'])) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->readAllDContenido()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Contenidos inexistente';
                }
                break;
            // Leer todos los jugadores
            case 'readAllJugadores':
                if (!$detalle->setIdEquipo($_POST['idEquipo'])) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->readAllJugadores()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Jugadores inexistente';
                }
                break;
            // Leer horarios en base al idequipo
            case 'readOneHorario':
                if (!$detalle->setIdEquipo($_POST['idEquipo'])) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->readOneHorario()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Horario inexistente';
                }
                break;
            // Leer todos los subcontenidos
            case 'readAllSubContenidos':
                if ($result['dataset'] = $detalle->readAllSubContenidos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
            // Leer todas las tareas    
            case 'readAllTareas':
                if ($result['dataset'] = $detalle->readAllTareas()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
            // Leer información de un detalle contenido UPDATE
            case 'readOneDetalleContenido':
                if (!$detalle->setIdDetalleContenido($_POST['idDetalle'])) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->readOneDetalleContenido()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Detalle inexistente';
                }
                break;
            // Actualizar un detalle contenido
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$detalle->setIdSubContenido($_POST['idSubContenido']) or
                    !$detalle->setCantidadSubContenido($_POST['CantidadSubContenido']) or
                    !$detalle->setIdTarea($_POST['IdTarea']) or
                    !$detalle->setCantidadTarea($_POST['CantidadTarea']) or
                    !$detalle->setIdDetalleContenido($_POST['idDetalle'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($detalle->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Detalle modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el detalle';
                }
                break;
            // Eliminar un detalle contenido
            case 'deleteRow':
                if (
                    !$detalle->setIdDetalleContenido($_POST['IdDetalle'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($detalle->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Detalle eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el detalle';
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
