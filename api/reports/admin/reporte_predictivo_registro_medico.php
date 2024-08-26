<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/registros_medicos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reporte predictivo');

// Se instancia el módelo CategoriasData para obtener los datos.
$registro_medico = new RegistrosData();

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataRegistro = $registro_medico->globalMedicalPrediction()) {

    // Información general
    $pdf->setFont('Arial', '', 11);
    $pdf->MultiCell(190, 7, $pdf->encodeString('Este informe muestra la predicción del riesgo de lesiones basado en los datos médicos históricos de los jugadores.'), 0, 1);
    $pdf->ln(5);

    // Mostrar la predicción de riesgo global
    $pdf->setFont('Arial', 'B', 12);
    $pdf->cell(255, 8, $pdf->encodeString('Predicción Global del Riesgo de Lesiones:'), 0, 1);

    // Mostrar el resultado de la predicción
    $pdf->setFont('Arial', '', 11);
    $pdf->cell(255, 8, $pdf->encodeString('El nivel de riesgo predicho para el grupo de jugadores es: ' . $dataRegistro), 0, 1);
    $pdf->ln(5);

    // Añadir recomendaciones basadas en la predicción
    if ($dataRegistro == 'Alto') {
        $recomendaciones = "Se recomienda incrementar las sesiones de recuperación y evitar esfuerzos físicos prolongados en los jugadores de alto riesgo.";
    } elseif ($dataRegistro == 'Medio') {
        $recomendaciones = "Los jugadores deben seguir un régimen regular de entrenamientos preventivos para evitar lesiones mayores.";
    } else {
        $recomendaciones = "El riesgo de lesiones es bajo. Continuar con el plan de entrenamiento habitual.";
    }

    // Mostrar las recomendaciones
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->Cell(0, 10, 'Recomendaciones:', 0, 1);

    $pdf->SetFont('Arial', '', 11);
    $pdf->MultiCell(0, 7, $pdf->encodeString($recomendaciones));
} else {
    $pdf->cell(255, 15, $pdf->encodeString('No hay suficientes registros para mostrar la predicción'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'categorías.pdf');
