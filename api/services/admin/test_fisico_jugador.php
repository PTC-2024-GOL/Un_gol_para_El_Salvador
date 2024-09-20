<?php
// Se incluye la clase del modelo.
require_once('../../models/data/test_fisico_jugador_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $testFisico = new TestData();
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);

                // Decodificar el arreglo de jugadores
                $arregloJugadores = json_decode($_POST['arregloJugadores'], true);

                if (is_array($arregloJugadores)) {
                    foreach ($arregloJugadores as $idJugador) {
                        // Convertir el ID del jugador a un entero
                        $idJugador = intval($idJugador);

                        if (
                            !$testFisico->setIdSubContenido($_POST['idSubContenido']) or
                            !$testFisico->setCantidadSubContenido($_POST['CantidadSubContenido']) or
                            !$testFisico->setIdTarea($_POST['IdTarea']) or
                            !$testFisico->setCantidadTarea($_POST['CantidadTarea']) or
                            !$testFisico->setIdJugador($idJugador) or
                            !$testFisico->setIdEntrenamiento($_POST['idEntrenamiento'])
                        ) {
                            $result['error'] = $testFisico->getDataError();
                            break;
                        } elseif (!$testFisico->createRow()) {
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
            // Leer todos
            case 'readAll':
                if (!$testFisico->setIdJugador($_POST['idJugador'])) {
                    $result['error'] = $testFisico->getDataError();
                } elseif ($result['dataset'] = $testFisico->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 0;
                    $result['error'] = 'Este jugador no tiene registros de test fisico';
                }
                break;
            //Función para saber si el jugador tiene test sin contestar. devuelve id_partido para saber si es el test del partido, si viene null es del entrenamiento.
            case 'testSinContestar':
                if (!$testFisico->setIdJugador($_POST['idJugador'])) {
                    $result['error'] = $testFisico->getDataError();
                } elseif ($result['dataset'] = $testFisico->testSinContestar()) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 0;
                    $result['error'] = 'Este jugador no tiene entrenamientos sin contestar';
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
