<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
use Phpml\Classification\KNearestNeighbors;

require('C:/xampp/htdocs/sitio_gol_sv/vendor/autoload.php');

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
            // Obtener los datos históricos para entrenar el modelo
            $datosHistoricos = [];
            $notas = $analisisHandler->PromedioNotasDelJugador();
            $asistencias = $analisisHandler->PorcentajeAsistenciasDelJugador();
            $puntajes = $analisisHandler->PromedioPuntajeDeJugador();
            $convocatorias = $analisisHandler->PorcentajePartidosConvocadosJugador();

            // Suponiendo que cada consulta devuelve un único registro con el promedio/puntaje/porcentaje necesario
            $promedioNota = $notas[0]['PROMEDIO'] ?? 0;
            $porcentajeAsistencia = $asistencias[0]['porcentaje_asistencia'] ?? 0;
            $promedioPuntaje = $puntajes[0]['PUNTUACION'] ?? 0;
            $porcentajeConvocatoria = $convocatorias[0]['porcentaje_convocado'] ?? 0;

            // Agregar los datos a la matriz para entrenamiento
            $datosHistoricos[] = [$promedioNota, $porcentajeAsistencia, $promedioPuntaje, $porcentajeConvocatoria];

            // Entrenar el modelo con los datos históricos
            $model = new KNearestNeighbors();
            $model->train($datosHistoricos, [1]); // Aquí debes usar etiquetas adecuadas para el entrenamiento

            // Realizar la predicción utilizando los datos del jugador
            $nuevosDatos = [
                [$promedioNota, $porcentajeAsistencia, $promedioPuntaje, $porcentajeConvocatoria] // Datos del jugador
            ];
            $probabilidad = $model->predict($nuevosDatos)[0]; // Devuelve una etiqueta o número, ajusta según tu modelo

            // Convertir la probabilidad a porcentaje y asegurarte de que esté entre 0 y 100
            $porcentajeProbabilidad = max(0, min(100, $probabilidad * 100)); // Asegura que esté en el rango

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

            // Añadir recomendaciones basadas en la predicción
            if ($porcentajeProbabilidad > 50) {
                $recomendaciones = "El jugador tiene una alta probabilidad de jugar en el próximo partido. Asegúrate de que esté bien preparado y en forma.";
            } else {
                $recomendaciones = "El jugador tiene una baja probabilidad de jugar en el próximo partido. Considera ajustar el plan de entrenamiento o realizar una revisión médica.";
            }

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
