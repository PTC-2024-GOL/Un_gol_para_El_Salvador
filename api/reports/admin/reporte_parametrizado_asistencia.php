<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/asistencias_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Asistencia de jugadores');

// Se instancia el modelo Producto para procesar los datos.
$registro = new AsistenciasData;

// Mapeo de asistencias a sus respectivos acrónimos.
$asistenciaAcronimos = [
    'Asistencia' => 'A',
    'Ausencia injustificada' => 'AI',
    'Enfermedad' => 'E',
    'Estudio' => 'ES',
    'Trabajo' => 'T',
    'Viaje' => 'V',
    'Permiso' => 'P',
    'Falta' => 'F',
    'Lesion' => 'L',
    'Otro' => 'O'
];

// Se establece la plantilla para obtener sus productos, de lo contrario se imprime un mensaje de error.
if (!($registro->setIdEntrenamiento($_GET['idEntrenamiento'])) or !($registro->setIdAsistenciaBool($_GET['asistencia']))) {
    $pdf->cell(0, 10, $pdf->encodeString('Parametros incorrectos o alterados'), 1, 1);
} else {
    try {
    // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
    if ($_GET['asistencia'] == 0) {
        if ($dataRegistro = $registro->readAlldefault()) {
            $dataHorario = $registro->readOne();
            $pdf->cell(0, 10, $pdf->encodeString("Esta es la asistencia del {$dataHorario['fecha_transformada']}, {$dataHorario['sesion']}"), 0, 1, 'C');

            $pdf->cell(100, 15, $pdf->encodeString('Jugador'), 1, 0, 'C');
            $pdf->cell(30, 15, $pdf->encodeString('Asistencia'), 1, 0, 'C');
            $pdf->cell(60, 15, $pdf->encodeString('Observación'), 1, 1, 'C');

            foreach ($dataRegistro as $asistencias) {
                // Comprobamos si hay que añadir una nueva página
                if ($pdf->getY() + 15 > 279 - 30) {
                    $pdf->addPage();
                    $pdf->cell(100, 15, $pdf->encodeString('Jugador'), 1, 0, 'C');
                    $pdf->cell(30, 15, $pdf->encodeString('Asistencia'), 1, 0, 'C');
                    $pdf->cell(60, 15, $pdf->encodeString('Observación'), 1, 1, 'C');
                }

                // Obtener el acrónimo de asistencia.
                $acronimo = $asistenciaAcronimos[$asistencias['asistencia']] ?? $asistencias['asistencia'];

                // Imprime la fila con los datos del registro utilizando los acrónimos.
                $pdf->cell(100, 15, $pdf->encodeString($asistencias['jugador']), 1, 0, 'C');
                $pdf->cell(30, 15, $pdf->encodeString(''), 1, 0, 'C');
                $pdf->cell(60, 15, $pdf->encodeString(''), 1, 1, 'C');
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('No hay jugadores que mostrar'), 0, 1);
        }
    } else {
        if ($dataRegistro = $registro->readAll()) {

            $pdf->cell(0, 10, $pdf->encodeString('Esta es la asistencia de un jugador'), 0, 1, 'C');

            $pdf->cell(100, 15, $pdf->encodeString('Jugador'), 1, 0, 'C');
            $pdf->cell(30, 15, $pdf->encodeString('Asistencia'), 1, 0, 'C');
            $pdf->cell(60, 15, $pdf->encodeString('Observación'), 1, 1, 'C');

            foreach ($dataRegistro as $asistencias) {
                // Comprobamos si hay que añadir una nueva página
                if ($pdf->getY() + 15 > 279 - 30) {
                    $pdf->addPage();
                    $pdf->cell(100, 15, $pdf->encodeString('Jugador'), 1, 0, 'C');
                    $pdf->cell(30, 15, $pdf->encodeString('Asistencia'), 1, 0, 'C');
                    $pdf->cell(60, 15, $pdf->encodeString('Observación'), 1, 1, 'C');
                }

                // Obtener el acrónimo de asistencia.
                $acronimo = $asistenciaAcronimos[$asistencias['asistencia']] ?? $asistencias['asistencia'];

                // Imprime la fila con los datos del registro utilizando los acrónimos.
                $pdf->cell(100, 15, $pdf->encodeString($asistencias['jugador']), 1, 0, 'C');
                $pdf->cell(30, 15, $pdf->encodeString($acronimo), 1, 0, 'C');
                $pdf->cell(60, 15, $pdf->encodeString($asistencias['observacion']), 1, 1, 'C');
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('No hay jugadores que mostrar'), 0, 1);
        }
    }

    // Sección de acrónimos
    $pdf->ln(5); // Agregar un pequeño espacio antes de los acrónimos
    $pdf->setFont('Arial', 'B', 12); // Cambiar el tamaño de la fuente del título
    $pdf->cell(0, 10, $pdf->encodeString('Estructura de los acrónimos utilizados en la asistencia'), 0, 1, 'L');

    // Cambiar a una fuente más pequeña para los acrónimos
    $pdf->setFont('Arial', '', 9);

    // Crear una cadena que contenga todos los acrónimos separados por comas
    $acronimosTexto = implode(', ', array_map(
        function ($descripcion, $acronimo) {
            return "$descripcion = $acronimo";
        },
        array_keys($asistenciaAcronimos),
        $asistenciaAcronimos
    ));

    // Verificar si hay espacio suficiente para los acrónimos, si no, agregar nueva página
    if ($pdf->getY() + 10 > 279 - 30) {
        $pdf->addPage();
    }

    // Imprimir todos los acrónimos en una sola línea
    $pdf->multiCell(0, 5, $pdf->encodeString($acronimosTexto . '.'), 0, 'L');

    }
    catch (Exception $e) {
        $pdf->cell(0, 10, $pdf->encodeString('Datos corruptos o incompletos, recargar'), 1, 1);
    }
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'Asistencia.pdf');