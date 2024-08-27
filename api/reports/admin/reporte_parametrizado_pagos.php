<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/pagos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reporte de pagos');

// Se instancia el modelo Producto para procesar los datos.
$pago = new PagoData;
// Se verifica si existe un valor para la , de lo contrario se muestra un mensaje.
if (isset($_GET['idPago'])) {
    // Se establece la plantilla para obtener sus productos, de lo contrario se imprime un mensaje de error.
    if ($pago->setId($_GET['idPago'])) {
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
        $pdf->cell(37, 10, 'Foto', 1, 0, 'C', 1); // Nueva columna para imagen
        $pdf->cell(63, 10, 'Jugador', 1, 0, 'C', 1);
        $pdf->cell(30, 10, 'Precio (US$)', 1, 0, 'C', 1);
        $pdf->cell(25, 10, 'Mora', 1, 0, 'C', 1);
        $pdf->cell(30, 10, 'SubTotal', 1, 1, 'C', 1);

        // Se establece un color de relleno para mostrar el nombre de la categoría.
        $pdf->setFillColor(240);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Arial', '', 11);
        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($dataPago = $pago->readOne()) {
            // Verifica si se ha creado una nueva página
            if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
                // Establecer color de texto a blanco
                $pdf->setTextColor(255, 255, 255);
                $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
                $pdf->setFillColor(2, 8, 135);
                $pdf->setDrawColor(2, 8, 135);
                $pdf->setFont('Arial', 'B', 11);
                // Vuelve a imprimir los encabezados en la nueva página
                $pdf->cell(37, 10, 'Foto', 1, 0, 'C', 1); // Nueva columna para imagen
                $pdf->cell(63, 10, 'Jugador', 1, 0, 'C', 1);
                $pdf->cell(30, 10, 'Precio (US$)', 1, 0, 'C', 1);
                $pdf->cell(25, 10, 'Mora', 1, 0, 'C', 1);
                $pdf->cell(30, 10, 'SubTotal ', 1, 1, 'C', 1);
            }
            $currentY = $pdf->getY(); // Obtén la coordenada Y actual
            // Establecer color de texto a negro
            $pdf->setTextColor(0, 0, 0);
            // Se establacen los colores de las celdas
            $pdf->setDrawColor(0, 0, 0);
            $pdf->setFont('Arial', '', 11);
            $pdf->setFillColor(255, 255, 255);
            //Verificación de que el archivo existe
            $imagePath = '../../images/jugadores/' . $dataPago['FOTO'];
            // Verifica si el archivo existe y si es un PNG válido
            if (!file_exists($imagePath) || exif_imagetype($imagePath) != IMAGETYPE_PNG) {
                // Usa una imagen por defecto o maneja el error
                $imagePath = '../../images/jugadores/default1.png';
            }
            $pdf->cell(37, 15, $pdf->image($imagePath, $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
            // Imprime la fila con los datos del registro
            $pdf->cell(63, 15, $pdf->encodeString($dataPago['NOMBRE']), 1, 0, 'C');
            $pdf->cell(30, 15, $pdf->encodeString($dataPago['CANTIDAD']), 1, 0, 'C');
            $pdf->cell(25, 15, $pdf->encodeString($dataPago['MORA']), 1, 0, 'C');
            $pdf->cell(30, 15, $pdf->encodeString($dataPago['SUBTOTAL']), 1, 1, 'C');
            $pdf->cell(155, 20, $pdf->encodeString('Pago Hecho: ' . $dataPago['FECHAFORMAT']), 1, 0, 'C');
            $pdf->cell(30, 10, $pdf->encodeString('IVA 13%'), 1, 1, 'C');
            $pdf->cell(155, 20, '', 0, 0, 'C');
            $pdf->cell(30, 10, $pdf->encodeString('Total: $' . $dataPago['TOTAL']), 1, 0, 'C');
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('No hay pago de este jugador'), 1, 1);
        }
    } else {
        $pdf->cell(0, 10, $pdf->encodeString('Pago incorrecta o inexistente'), 1, 1);
    }
    // Se llama implícitamente al método footer() y se envía el documento al navegador web.
    $pdf->output('I', 'productos.pdf');
} else {
    print('Debe seleccionar un pago');
}
