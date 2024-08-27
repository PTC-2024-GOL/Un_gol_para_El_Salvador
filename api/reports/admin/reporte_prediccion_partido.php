<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/partidos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Predicción del siguiente partido');

// Se instancia el modelo Producto para procesar los datos.
$registro = new PartidosData();
// Se establece la plantilla para obtener sus productos, de lo contrario se imprime un mensaje de error.
if ($registro->setIdPartido($_GET['idPartido'])) {
    try {
        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($arreglo = $registro->generarMensajePrediccion()) {

            $pdf->setFont('Arial', 'B', 12);
            $pdf->MultiCell(190, 7, $pdf->encodeString("Predicción del partido : {$arreglo['fechaPartido']}, entre {$arreglo['nombreEquipo']} y {$arreglo['nombreRival']}"), 0, 1);
            $pdf->ln(5); // Cambiado para agregar un mayor espacio

            // Información general
            $pdf->setFont('Arial', '', 11);
            $pdf->MultiCell(190, 7, $pdf->encodeString('Este informe predice con 50% de acertividad el resultado de su siguiente partido.'), 0, 1);
            $pdf->ln(10);

            $pdf->SetDrawColor(180, 177, 187);
            $pdf->Line(15, 85, 200, 85);

            // Mostrar la predicción de riesgo global
            $pdf->setFont('Arial', 'B', 12);
            $pdf->MultiCell(190, 7, $pdf->encodeString($arreglo['mensaje']), 0, 1);
            $pdf->ln(5); // Saltar una línea después del mensaje

            // Rutas de los logos
            $logoEquipo1Path = '../../images/equipos/' . $arreglo['logoEquipo'];
            $logoRivalPath = '../../images/rivales/' . $arreglo['logoRival'];

            // Verificación de las imágenes
            if (!file_exists($logoEquipo1Path) || exif_imagetype($logoEquipo1Path) != IMAGETYPE_PNG) {
                $logoEquipo1Path = '../../images/equipos/default.png';
            }
            if (!file_exists($logoRivalPath) || exif_imagetype($logoRivalPath) != IMAGETYPE_PNG) {
                $logoRivalPath = '../../images/rivales/default.png';
            }

            // Posiciones y tamaños
            $logoSize = 40; // Tamaño del logo
            $margin = 20; // Margen del borde de la página
            $xEquipo1 = $margin; // Posición X para el logo del equipo 1
            $xRival = 210 - $logoSize - $margin; // Posición X para el logo del rival (ajustado para el margen derecho)
            $yPos = $pdf->GetY() + 10; // Posición Y para los logos
            $yPos2 = $pdf->GetY() - 10; 
            // Insertar el logo del equipo 1
            $pdf->Image($logoEquipo1Path, $xEquipo1, $yPos, $logoSize);
            $pdf->SetXY($xEquipo1, $yPos + $logoSize + 5); // Ajusta la posición Y para el nombre del equipo 1
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(0, 10, $pdf->encodeString($arreglo['nombreEquipo']), 0, 1, 'L'); // Cambiado 'C' a 'L' para alinearlo a la izquierda

            // Insertar el texto con la predicción
            $pdf->SetXY(($xEquipo1 + $xRival + $logoSize) / 2 - 90, $yPos2 + $logoSize + 10); // Ajusta la posición Y para el texto de la predicción
            $pdf->SetFont('Arial', 'B', 30);
            $pdf->Cell(0, 10, $pdf->encodeString("{$arreglo['prediccionEquipo']} - {$arreglo['prediccionRival']}"), 0, 1, 'C');

            // Insertar el logo del rival
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Image($logoRivalPath, $xRival, $yPos, $logoSize);
            $pdf->SetXY($xRival, $yPos + $logoSize + 5); // Ajusta la posición Y para el nombre del rival
            $pdf->Cell(0, 10, $pdf->encodeString($arreglo['nombreRival']), 0, 1, 'C');


            // Espaciado después del mensaje
            $pdf->ln(10);
            // Mostrar las recomendaciones
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Cell(0, 10, 'Recomendaciones:', 0, 1);

            $pdf->SetFont('Arial', '', 11);
            $pdf->MultiCell(0, 7, $pdf->encodeString($arreglo['mensaje3']), 0, 1);

        } else { //Cae en el else cuando no vengan datos
            $pdf->cell(255, 15, $pdf->encodeString('No hay datos registrados'), 1, 1);
        }
        //Si en dado caso falla el metodo predictivo, entonces se muestra el siguiente mensaje
    } catch (Exception $e) {
        $pdf->cell(0, 10, $pdf->encodeString('No hay datos suficientes para realizar la predicción'), 1, 1, 'C');
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('partido incorrecta o inexistente'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'prediccion_partido.pdf');
