<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/registros_medicos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reporte de registro médico');

// Se instancia el modelo Producto para procesar los datos.
$registro = new RegistrosData;
// Se establece la plantilla para obtener sus productos, de lo contrario se imprime un mensaje de error.
if ($registro->setIdRegistroMedico($_GET['idMedico'])) {
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
    $pdf->cell(60, 10, $pdf->encodeString('Jugador'), 1, 0, 'C', 1);
    $pdf->cell(25, 10, $pdf->encodeString('Fecha'), 1, 0, 'C', 1);
    $pdf->cell(30, 10, $pdf->encodeString('Días lesionado'), 1, 0, 'C', 1);
    $pdf->cell(39, 10, $pdf->encodeString('Lesión'), 1, 0, 'C', 1);
    $pdf->cell(31, 10, $pdf->encodeString('Retorno entreno'), 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);
    // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
    if ($dataRegistro = $registro->readOne1()) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            // Establecer color de texto a blanco
            $pdf->setTextColor(255, 255, 255);
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setFillColor(2, 8, 135);
            $pdf->setDrawColor(2, 8, 135);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(60, 10, $pdf->encodeString('Jugador'), 1, 0, 'C', 1);
            $pdf->cell(25, 10, $pdf->encodeString('Fecha'), 1, 0, 'C', 1);
            $pdf->cell(30, 10, $pdf->encodeString('Días lesionado'), 1, 0, 'C', 1);
            $pdf->cell(39, 10, $pdf->encodeString('Lesión'), 1, 0, 'C', 1);
            $pdf->cell(31, 10, $pdf->encodeString('Retorno entreno'), 1, 1, 'C', 1);
        }
        $currentY = $pdf->getY(); // Obtén la coordenada Y actual
        // Establecer color de texto a negro
        $pdf->setTextColor(0, 0, 0);
        // Se establacen los colores de las celdas
        $pdf->setDrawColor(0, 119, 182);
        $pdf->setFont('Arial', '', 11);
        $pdf->setFillColor(255, 255, 255);
        // Imprime la fila con los datos del registro
        $pdf->cell(60, 15, $pdf->encodeString($dataRegistro['NOMBRE']), 1, 0, 'C');
        $pdf->cell(25, 15, $pdf->encodeString($dataRegistro['FECHALESION']), 1, 0, 'C');
        $pdf->cell(30, 15, $pdf->encodeString($dataRegistro['DIAS']), 1, 0, 'C');
        $pdf->cell(39, 15, $pdf->encodeString($dataRegistro['LESION']), 1, 0, 'C');
        $pdf->cell(31, 15, $pdf->encodeString($dataRegistro['RETORNO']), 1, 1, 'C');

    } else {
        $pdf->cell(0, 10, $pdf->encodeString('No hay registro médico de este jugador'), 1, 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('registro incorrecta o inexistente'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'registro_medico.pdf');