<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para la , de lo contrario se muestra un mensaje.
if (isset($_GET['id'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/caracteristicas_analisis_data.php');
    // Se instancian las entidades correspondientes.
    $caracteristica = new CaracteristicasAnalisisData;

    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Predicción de notas');

    // Información general
    $pdf->setFont('Arial', '', 11);
    $pdf->MultiCell(190, 7, $pdf->encodeString('Este informe muestra la predicción de las proximas notas posibles del jugador, durante los siguientes entrenamientos, basados en las notas que este recibio en las ultimas dos semanas de entrenamientos.'), 0, 1);
    $pdf->ln(5);
    $pdf->setFont('Arial', 'B', 14);
    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($caracteristica->setJugador($_GET['id'])) {
        // Establecer color de texto a blanco
        $pdf->setTextColor(255, 255, 255);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(2, 8, 135);
        // Se establece el color del borde.
        $pdf->setDrawColor(2, 8, 135);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Arial', 'B', 11);
        // Se imprimen las celdas con los encabezados.
        // Explicación de funcionamiento de los valores de las celdas: 
        // (Ancho, Alto, Texto, Borde, Salto de linea, Alineación (Centrado = C, Izquierda = L, Derecha = R), Fondo, Link)
        $pdf->cell(106, 10, 'Caracteristica', 1, 0, 'C', 1);
        $pdf->cell(80, 10, 'Nota', 1, 1, 'C', 1);

        // Se establece la fuente para los datos de los datos.
        $pdf->setFillColor(110, 151, 214);
        $pdf->setDrawColor(0, 0, 0);
        $pdf->setFont('Arial', '', 11);

        // Establecer color de texto a blanco
        $pdf->setTextColor(0, 0, 0);
        try {
            // Se verifica si existen datos, de lo contrario se muestra un mensaje.
            if ($dataFavorito = $caracteristica->predictNextSessionScores()) {
                // Establecer color de texto a blanco
                $pdf->setTextColor(0, 0, 0);
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(110, 151, 214);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Arial', 'B', 11);
                $pdf->cell(0, 10, $pdf->encodeString('Jugador elegido para la predicción: ' . $dataFavorito[0]['jugador']), 1, 1, 'C', 1);
                $groupedByDate = [];
                // Agrupar los datos por fecha
                foreach ($dataFavorito as $rowFavorito) {
                    $groupedByDate[$rowFavorito['fecha']][] = $rowFavorito;
                }
                // Iterar sobre las fechas agrupadas
                foreach ($groupedByDate as $date => $rows) {
                    $pdf->setFont('Arial', 'B', 11);
                    $pdf->setFillColor(110, 151, 214);
                    $pdf->cell(0, 10, $pdf->encodeString($date), 1, 1, 'C', 1);

                    foreach ($rows as $row) {
                        // Verifica si se ha creado una nueva página
                        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
                            // Establecer color de texto a blanco
                            $pdf->setTextColor(255, 255, 255);
                            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
                            $pdf->setTextColor(255, 255, 255);
                            $pdf->setFillColor(2, 8, 135);
                            $pdf->setDrawColor(2, 8, 135);
                            $pdf->setFont('Arial', 'B', 11);
                            // Vuelve a imprimir los encabezados en la nueva página
                            $pdf->cell(106, 10, 'Caracteristica', 1, 0, 'C', 1);
                            $pdf->cell(80, 10, 'Nota', 1, 1, 'C', 1);
                            // Establecer color de texto a blanco
                            $pdf->setTextColor(0, 0, 0);
                        }
                        // Establecer color de texto a blanco
                        $pdf->setTextColor(0, 0, 0);
                        // Se establacen los colores de las celdas
                        $pdf->setDrawColor(0, 0, 0);
                        $pdf->setFont('Arial', 'B', 11);
                        $pdf->cell(106, 10, $pdf->encodeString($row['caracteristica']), 1, 0, 'C');
                        $pdf->cell(80, 10, round($pdf->encodeString($row['nota']), 2), 1, 1, 'C');
                    }
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay predicción disponible para este jugador'), 1, 1, 'C');
            }
        } catch (Exception $e) {
            // Mostrar un mensaje específico si ocurre una excepción
            $pdf->cell(0, 10, $pdf->encodeString('No hay datos suficientes para realizar la predicción'), 1, 1, 'C');
        }
        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'prediccion_jugador.pdf');
    } else {
        print('Jugador incorrecto');
    }
} else {
    print('Debe seleccionar un jugador');
}
