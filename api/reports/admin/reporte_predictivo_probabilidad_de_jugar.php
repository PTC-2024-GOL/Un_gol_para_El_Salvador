<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para la , de lo contrario se muestra un mensaje.
if (isset($_GET['id']) && isset($_GET['jugador'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/caracteristicas_analisis_data.php'); // Asegúrate de que esta ruta sea correcta
    // Se instancia el modelo para obtener los datos de predicción.
    $analisisHandler = new CaracteristicasAnalisisData();
    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($analisisHandler->setJugador($_GET['id'])) {
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Reporte probabilidad de jugar el proximo partido');

        try {
            // Obtener los datos para la predicción
            $nuevosDatos = [
                // Aquí debes colocar los datos que quieres predecir, si tienes algún conjunto de datos específicos
                // Por ejemplo:
                [5, 80, 8] // Ejemplo de datos de entrada
            ];

            // Realizar la predicción
            $prediccion = $analisisHandler->predecir($nuevosDatos);

            // Información general
            $pdf->setFont('Arial', '', 11);
            $pdf->MultiCell(190, 7, $pdf->encodeString('Este informe muestra la predicción de si el jugador participará en el próximo partido basado en los datos de rendimiento y asistencia.'), 0, 1);
            $pdf->ln(10);
            // Establecer color de texto a blanco
            $pdf->setTextColor(0, 0, 0);
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 255, 255);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Arial', 'B', 11);
            $pdf->cell(100, 10, $pdf->encodeString('Jugador elegido para la predicción: ' . $_GET['jugador']), 0, 1, 'L', 1);

            $pdf->SetDrawColor(180, 177, 187);
            $pdf->Line(15, 85, 200, 85);

            // Mostrar la predicción
            $pdf->setFont('Arial', 'B', 12);
            $pdf->cell(0, 5, $pdf->encodeString('Predicción de participación en el próximo partido:'), 0, 1);

            $pdf->ln(3);

            $pdf->setFont('Arial', 'B', 11);
            $pdf->cell(71, 8, $pdf->encodeString('Probabilidad de participación: '), 0, 0);
            $pdf->setFont('Arial', '', 11);
            $pdf->cell(25, 8, $pdf->encodeString($prediccion[0] == 1 ? 'Sí' : 'No'), 0, 1, 'R');

            // Aquí puedes añadir más detalles si lo deseas
            // Por ejemplo, podrías mostrar las estadísticas detalladas usadas para la predicción

            // Añadir recomendaciones basadas en la predicción
            if ($prediccion[0] == 1) {
                $recomendaciones = "El jugador tiene una alta probabilidad de jugar en el próximo partido. Asegúrate de que esté bien preparado y en forma.";
            } else {
                $recomendaciones = "El jugador tiene una baja probabilidad de jugar en el próximo partido. Considera ajustar el plan de entrenamiento o revisión médica.";
            }

            $pdf->ln(5);
            // Mostrar las recomendaciones
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Cell(0, 10, 'Recomendaciones:', 0, 1);

            $pdf->SetFont('Arial', '', 11);
            $pdf->MultiCell(0, 7, $pdf->encodeString($recomendaciones));
        } catch (Exception $e) {
            $pdf->cell(0, 10, $pdf->encodeString('No hay datos suficientes para realizar la predicción'), 1, 1, 'C');
        }
    } else {
        print('Jugador incorrecto');
    }
} else {
    print('Debe seleccionar un jugador');
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'prediccion_participacion.pdf');
