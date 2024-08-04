<?php
// Se incluye la clase del modelo.
require_once('../../models/data/pagos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pago = new PagoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                //crear
                case 'createRow':
                    $_POST = Validator::validateForm($_POST);
                    if (
                        !$pago->setFecha($_POST['fechaPago']) or
                        !$pago->setCantidad($_POST['cantidadPago']) or
                        !$pago->setTardio($_POST['tardioPago']) or
                        !$pago->setMora($_POST['moraPago']) or
                        !$pago->setMes($_POST['mesPago']) or
                        !$pago->setJUgador($_POST['nombreJugador']) 
                    ) {
                        $result['error'] = $pago->getDataError();
                    } elseif ($pago->createRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'El pago fue ingresado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el pago';
                    }
                    break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $pago->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay pagos registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$pago->setId($_POST['idPago'])) {
                    $result['error'] = $pago->getDataError();
                } elseif ($result['dataset'] = $pago->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Pago inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pago->setId($_POST['idPago']) or
                    !$pago->setFecha($_POST['fechaPago']) or
                    !$pago->setCantidad($_POST['cantidadPago']) or
                    !$pago->setTardio($_POST['tardioPago']) or
                    !$pago->setMora($_POST['moraPago']) or
                    !$pago->setMes($_POST['mesPago']) or
                    !$pago->setJUgador($_POST['nombreJugador']) 
                ) {
                    $result['error'] = $pago->getDataError();
                } elseif ($pago->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'El pago fue modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el pago';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$pago->setId($_POST['idPago'])
                ) {
                    $result['error'] = $pago->getDataError();
                } elseif ($pago->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'El pago fue eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el pago. Por seguridad no puedes eliminar este jugador porque esta siendo utilizado en otras tablas.';
                }
                break;
                // INGRESOS
            // Leer todos
            case 'totalMoney':
                if ($result['dataset'] = $pago->totalMoney()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay pagos registrados';
                }
                break;
            // Leer uno
            case 'totalMoneyMora':
                if (!$pago->setMes($_POST['mes'])) {
                    $result['error'] = $pago->getDataError();
                } elseif ($result['dataset'] = $pago->totalMoneyMora()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Pago inexistente';
                }
                break;
            // Leer uno
            case 'totalMoneyMounth':
                if ($result['dataset'] = $pago->totalMoneyMounth()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Pago inexistente';
                }
                break;
            case 'totalPlayers':
                if ($result['dataset'] = $pago->totalPlayers()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay jugadores registrados';
                }
                break;
            case 'noScholarships':
                if ($result['dataset'] = $pago->noScholarships()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay jugadores sin becas';
                }
                break;
            case 'halfScholarships':
                if ($result['dataset'] = $pago->halfScholarships()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay jugadores con medias becas';
                }
                break;
            case 'completeScholarships':
                if ($result['dataset'] = $pago->completeScholarships()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay jugadores con becas completas';
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
    print(json_encode('Recurso no disponible'));
}