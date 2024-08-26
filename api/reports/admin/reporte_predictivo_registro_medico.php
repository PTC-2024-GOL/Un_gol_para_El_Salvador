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

try {
    // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
    if ($dataRegistro = $registro_medico->globalMedicalPrediction()) {

        $pdf->setFont('Arial', 'B', 12);
        $pdf->cell(0, 5, $pdf->encodeString('Predicción de riesgo de lesiones:'), 0, 1 );
        $pdf->ln(2);

        // Información general
        $pdf->setFont('Arial', '', 11);
        $pdf->MultiCell(190, 7, $pdf->encodeString('Este informe muestra la predicción del riesgo de lesiones basado en los datos médicos históricos de los jugadores.'), 0, 1);
        $pdf->ln(10);

        $pdf->SetDrawColor(180,177,187);
        $pdf->Line(15, 85, 200, 85);

        // Mostrar la predicción de riesgo global
        $pdf->setFont('Arial', 'B', 12);
        $pdf->cell(0, 5, 'Basado en los siguientes datos:', 0, 1 );

        $pdf->ln(3);

        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(71, 8, $pdf->encodeString('1. Rango de días lesionados: '), 0, 0);
        $pdf->setFont('Arial', '', 11);
        $pdf->cell(25, 8, $pdf->encodeString($dataRegistro['dias_lesionados_rango']), 0, 1, 'R');
        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(55, 8, $pdf->encodeString('2. Lesiones registradas: '), 0, 0);
        $pdf->setFont('Arial', '', 11);
        $pdf->multicell(144, 8, $pdf->encodeString(implode(', ', $dataRegistro['tipos_lesiones'])), 0, 'L',0);

        $pdf->ln(5);
        // Mostrar la predicción de riesgo global
        $pdf->setFont('Arial', 'B', 12);
        $pdf->cell(255, 8, $pdf->encodeString('Predicción de riesgo de lesiones:'), 0, 1);
        // Mostrar el resultado de la predicción
        $pdf->setFont('Arial', '', 11);
        $pdf->multicell(193, 8, $pdf->encodeString('El nivel de riesgo predicho para el grupo de jugadores es ' . $dataRegistro['prediccion']), 0, 1);
        $pdf->ln(2);

        $pdf->cell(50, 8, $pdf->encodeString('La lesión más frecuente entre los jugadores es:'), 0, 0);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(70, 8, $pdf->encodeString($dataRegistro['tipo_lesion_mas_frecuente']), 0, 1, 'R');

        // Añadir recomendaciones basadas en la predicción
        if ($dataRegistro['tipo'] == 1) {
            $recomendaciones = "Se recomienda incrementar las sesiones de recuperación y evitar esfuerzos físicos prolongados.";
        } elseif ($dataRegistro['tipo'] == 2) {
            $recomendaciones = "Los jugadores deben seguir un régimen regular de entrenamientos preventivos para evitar lesiones mayores.";
        } else {
            $recomendaciones = "El riesgo de lesiones es bajo. Continuar con el plan de entrenamiento habitual.";
        }

        $pdf->ln(3);
        // Mostrar las recomendaciones
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, 'Recomendaciones:', 0, 1);

        $pdf->SetFont('Arial', '', 11);
        $pdf->MultiCell(0, 7, $pdf->encodeString($recomendaciones));

    } else { //Cae en el else cuando no vengan datos
        $pdf->cell(255, 15, $pdf->encodeString('No hay datos registrados'), 1, 1);
    }
//Si en dado caso falla el metodo predictivo, entonces se muestra el siguiente mensaje
} catch (Exception $e){
    $pdf->cell(0, 10, $pdf->encodeString('No hay datos suficientes para realizar la predicción'), 1, 1, 'C');
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'categorías.pdf');