<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/categorias_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reporte de categorías');

// Se instancia el módelo CategoriasData para obtener los datos.
$categorias = new CategoriasData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataCategorias = $categorias->readAll()) {

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
    $pdf->cell(110, 10, $pdf->encodeString('Nombre de la categoría'), 1, 0, 'C', 1); 
    $pdf->cell(35, 10, $pdf->encodeString('Edad mínima'), 1, 0, 'C', 1);
    $pdf->cell(35, 10, $pdf->encodeString('Edad máxima'), 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se verifica si existen categoriasistradores y se recorren los registros por fila, de lo contrario se muestra un mensaje.
    foreach ($dataCategorias as $rowCategorias) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setTextColor(255, 255, 255);
            $pdf->setFillColor(2, 8, 135);
            $pdf->setDrawColor(2, 8, 135);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(110, 10, $pdf->encodeString('Nombre de la categoría'), 1, 0, 'C', 1); 
            $pdf->cell(35, 10, $pdf->encodeString('Edad mínima'), 1, 0, 'C', 1);
            $pdf->cell(35, 10, $pdf->encodeString('Edad máxima'), 1, 1, 'C', 1);
        }

        $currentY = $pdf->getY(); // Obtén la coordenada Y actual
        // Establecer color de texto a blanco
        $pdf->setTextColor(0, 0, 0);
        // Se establacen los colores de las celdas
        $pdf->setDrawColor(0, 0, 0);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->setFillColor(255, 255, 255);
        // Imprime las celdas con los datos
        $pdf->cell(110, 15, $pdf->encodeString($rowCategorias['nombre_categoria']), 1, 0, 'C');
        $pdf->cell(35, 15, $pdf->encodeString($rowCategorias['edad_minima_permitida']), 1, 0, 'C');
        $pdf->cell(35, 15, $pdf->encodeString($rowCategorias['edad_maxima_permitida']), 1, 1, 'C');
    }
} else {
    $pdf->cell(0, 15, $pdf->encodeString('No hay categorías registradas para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'categorías.pdf');