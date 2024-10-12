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
    if (isset($_SESSION['idJugador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);

                // Decodificar el arreglo de preguntas y respuestas
                $arregloPreguntas = json_decode($_POST['preguntasYRespuestas'], true);

                if (is_array($arregloPreguntas)) {
                    $success = true; // Variable para manejar el éxito de las operaciones
                    foreach ($arregloPreguntas as $preguntaRespuesta) {
                        // Asegúrate de que la estructura tenga los campos esperados
                        if (
                            !$testFisico->setPregunta($preguntaRespuesta['pregunta']) or
                            !$testFisico->setRespuesta($preguntaRespuesta['respuesta']) or
                            !$testFisico->setIdTest($_POST['idTest']) // Asegúrate de que 'idTest' sea enviado
                        ) {
                            $result['error'] = $testFisico->getDataError();
                            $success = false; // Cambiar a false si hay un error
                            break; // Salir del bucle si hay un error
                        } elseif (!$testFisico->createRow()) {
                            $result['error'] = 'Ocurrió un problema al crear la pregunta y su respuesta';
                            $success = false; // Cambiar a false si hay un error
                            break; // Salir del bucle si hay un error
                        }
                    }

                    if ($success) {
                        if (!$testFisico->updateRow()) {
                            $result['error'] = 'Ocurrió un error al actualizar el test físico.';
                        } else {
                            $result['status'] = 1;
                            $result['message'] = '!Preguntas y respuestas guardadas con éxito!';
                        }
                    }
                } else {
                    $result['error'] = 'Formato de arreglo Preguntas no es válido.';
                }
                break;
            // Leer todos
            case 'readAll':
                if (!$testFisico->setIdJugador($_SESSION['idJugador'])) {
                    $result['error'] = $testFisico->getDataError();
                } elseif ($result['dataset'] = $testFisico->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 0;
                    $result['error'] = 'Este jugador no tiene registros de test fisico';
                }
                break;
            //Función para saber si el jugador tiene test sin contestar. 
            case 'testSinContestar':
                if ($result['dataset'] = $testFisico->testSinContestarMovil()) {
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
