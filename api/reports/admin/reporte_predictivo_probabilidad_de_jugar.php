<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para el parámetro 'id', de lo contrario se muestra un mensaje.
if (isset($_GET['id'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/caracteristicas_analisis_data.php'); // Asegúrate de que esta ruta sea correcta
    // Se instancia el modelo para obtener los datos de predicción.
    $analisisHandler = new CaracteristicasAnalisisData();

    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($analisisHandler->setJugador($_GET['id'])) {
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Reporte predictivo');

        try {
            // Obtener los datos para la predicción
            $nuevosDatos = [
                // Aquí debes colocar los datos que quieres predecir, si tienes algún conjunto de datos específicos
                // Por ejemplo:
                [5, 80, 8] // Ejemplo de datos de entrada
            ];

            // Realizar la predicción (suponiendo que devuelva un valor entre 0 y 1)
            $probabilidad = $analisisHandler->predecir($nuevosDatos)[0]; // Asumiendo que la predicción devuelve un array y tomas el primer valor

            // Convertir la probabilidad a porcentaje
            $porcentajeProbabilidad = $probabilidad * 100;

            // Información general
            $pdf->setFont('Arial', 'B', 16);
            $pdf->MultiCell(190, 7, $pdf->encodeString('Reporte de probabilidad de jugar el próximo partido'), 0, 1);
            $pdf->ln(10);
            $pdf->setFont('Arial', '', 11);
            $pdf->MultiCell(190, 7, $pdf->encodeString('Este informe muestra la predicción de la probabilidad de participación del jugador en el próximo partido basado en los datos de rendimiento y asistencia.'), 0, 1);
            $pdf->ln(10);

            // Establecer color de texto a negro
            $pdf->setTextColor(0, 0, 0);
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 255, 255);
            $pdf->SetDrawColor(180, 177, 187);
            $pdf->Line(15, 85, 200, 85);

            // Mostrar la predicción
            $pdf->setFont('Arial', 'B', 12);
            $pdf->cell(0, 5, $pdf->encodeString('Predicción de participación en el próximo partido:'), 0, 1);

            $pdf->ln(3);

            $pdf->setFont('Arial', 'B', 11);
            $pdf->cell(71, 8, $pdf->encodeString('Probabilidad de participación: '), 0, 0);
            $pdf->setFont('Arial', '', 11);
            $pdf->cell(25, 8, $pdf->encodeString(number_format($porcentajeProbabilidad, 2) . '%'), 0, 1, 'R');

            // Añadir recomendaciones basadas en la predicción
            if ($porcentajeProbabilidad > 50) {
                $recomendaciones = "El jugador tiene una alta probabilidad de jugar en el próximo partido. Asegúrate de que esté bien preparado y en forma.";
            } else {
                $recomendaciones = "El jugador tiene una baja probabilidad de jugar en el próximo partido. Considera ajustar el plan de entrenamiento o realizar una revisión médica.";
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
        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'prediccion_participacion.pdf');
    } else {
        print('Jugador incorrecto');
    }
} else {
    print('Debe seleccionar un jugador');
}
