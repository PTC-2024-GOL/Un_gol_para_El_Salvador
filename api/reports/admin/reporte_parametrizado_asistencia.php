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
if (!isset($_GET['asistencia']) or !isset($_GET['idEntrenamiento'])) {
    $pdf->cell(0, 10, $pdf->encodeString('Parametros incorrectos o alterados'), 1, 1);
} else {
    try {
        $registro->setIdAsistenciaBool($_GET['asistencia']);
        $registro->setIdEntrenamiento($_GET['idEntrenamiento']);
        // Establecer color de texto a blanco
        $pdf->setTextColor(0, 0, 0);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(2, 8, 135);
        // Se establece el color del borde.
        $pdf->setDrawColor(2, 8, 135);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Arial', 'B', 11);
        // Se imprimen las celdas con los encabezados.

        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($_GET['asistencia'] == 0) {
            $pdf->setTextColor(0, 0, 0);
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(2, 8, 135);
            if ($dataRegistro = $registro->readAlldefault()) {
                $dataHorario = $registro->readOne();
                $pdf->cell(0, 10, $pdf->encodeString("Esta es la asistencia del {$dataHorario['fecha_transformada']}, {$dataHorario['sesion']}"), 0, 1, 'C');
                $pdf->setTextColor(255, 255, 255);
                $pdf->cell(80, 15, $pdf->encodeString('Jugador'), 1, 0, 'C',1 );
                $pdf->cell(20, 15, $pdf->encodeString('Asistencia'), 1, 0, 'C',1 );
                $pdf->cell(80, 15, $pdf->encodeString('Observación'), 1, 1, 'C', 1);

                foreach ($dataRegistro as $asistencias) {
                    $pdf->SetTextColor(0, 0, 0);
                    $pdf->setFillColor(240);
                    // Comprobamos si hay que añadir una nueva página
                    if ($pdf->getY() + 15 > 279 - 30) {
                        $pdf->addPage();
                        $pdf->cell(80, 20, $pdf->encodeString('Jugador'), 1, 0, 'C', 1);
                        $pdf->cell(20, 20, $pdf->encodeString('Asistencia'), 1, 0, 'C');
                        $pdf->cell(80, 20, $pdf->encodeString('Observación'), 1, 1, 'C', 1);
                    }

                    // Obtener el acrónimo de asistencia.
                    $acronimo = $asistenciaAcronimos[$asistencias['asistencia']] ?? $asistencias['asistencia'];

                    // Imprime la fila con los datos del registro utilizando los acrónimos.
                    $pdf->cell(80, 20, $pdf->encodeString($asistencias['jugador']), 1, 0, 'C', 1);
                    $pdf->cell(20, 20, $pdf->encodeString(''), 1, 0, 'C');
                    $pdf->cell(80, 20, $pdf->encodeString(''), 1, 1, 'C', 1);
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay jugadores que mostrar'), 0, 1);
            }
        } else {
            if ($dataRegistro = $registro->readAll()) {
                $pdf->setTextColor(0, 0, 0);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(2, 8, 135);
                $dataHorario = $registro->readOne();
                $pdf->cell(0, 10, $pdf->encodeString("Esta es la asistencia del {$dataHorario['fecha_transformada']}, {$dataHorario['sesion']}"), 0, 1, 'C');
                $pdf->setTextColor(255, 255, 255);
                $pdf->cell(80, 15, $pdf->encodeString('Jugador'), 1, 0, 'C',1 );
                $pdf->cell(20, 15, $pdf->encodeString('Asistencia'), 1, 0, 'C',1 );
                $pdf->cell(80, 15, $pdf->encodeString('Observación'), 1, 1, 'C', 1);

                foreach ($dataRegistro as $asistencias) {
                    $pdf->setFont('Arial', '', 11);
                    $pdf->setFillColor(240);
                    $pdf->SetTextColor(0, 0, 0);
                    // Comprobamos si hay que añadir una nueva página
                    if ($pdf->getY() + 15 > 279 - 30) {
                        $pdf->addPage();
                        $pdf->cell(80, 15, $pdf->encodeString('Jugador'), 1, 0, 'C');
                        $pdf->cell(20, 15, $pdf->encodeString('Asistencia'), 1, 0, 'C');
                        $pdf->setFont('Arial', '', 9);
                        $pdf->MultiCell(80, 15, $pdf->encodeString('Observación'), 1, 1, 'C');
                        $pdf->SetXY($pdf->GetX(), $pdf->GetY());
                    }

                    // Obtener el acrónimo de asistencia.
                    $acronimo = $asistenciaAcronimos[$asistencias['asistencia']] ?? $asistencias['asistencia'];

                    // Imprime la fila con los datos del registro utilizando los acrónimos.
                    $pdf->cell(80, 15, $pdf->encodeString($asistencias['jugador']), 0, 0, 'C');
                    $pdf->cell(20, 15, $pdf->encodeString($acronimo), 0, 0, 'C');
                    $pdf->setFont('Arial', '', 9);
                    $pdf->MultiCell(80, 15, $pdf->encodeString($asistencias['observacion']), 0, 'C');
                    $pdf->Cell(0, 0, '', 'B', 1);
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

    } catch (Exception $e) {
        $pdf->cell(0, 10, $pdf->encodeString('Datos corruptos o incompletos, cierra esta página e intentalo de nuevo'), 1, 1);
    }
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'Asistencia.pdf');