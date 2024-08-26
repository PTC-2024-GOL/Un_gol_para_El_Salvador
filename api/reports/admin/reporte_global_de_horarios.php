<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/categorias_data.php');
require_once('../../models/data/horarios_categoria_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reporte de horarios por categoría');

// Se instancia el modelo Categoría para obtener los datos.
$Categoria = new CategoriasData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataCategorias = $Categoria->readAll()) {

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
    $pdf->cell(90, 10, 'Nombre', 1, 0, 'C', 1); // Nueva columna para imagen
    $pdf->cell(30, 10, $pdf->encodeString('Día'), 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Hora de inicio', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Hora final', 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataCategorias as $dataCategoria) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setFillColor(2, 8, 135);
            $pdf->setDrawColor(2, 8, 135);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(90, 10, 'Nombre', 1, 0, 'C', 1); // Nueva columna para imagen
            $pdf->cell(30, 10, $pdf->encodeString('Día'), 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Hora de inicio', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Hora final', 1, 1, 'C', 1);
        }

        $pdf->setFillColor(110, 151, 214);
        $pdf->setDrawColor(0, 0, 0);
        $pdf->setFont('Arial', 'B', 11);

        // Establecer color de texto a blanco
        $pdf->setTextColor(0, 0, 0);
        // Imprime una celda con el nombre de la plantilla.
        $pdf->cell(180, 10, $pdf->encodeString('Categoría: ' . $dataCategoria['nombre_categoria']), 1, 1, 'C', 1);

        // Se instancia el modelo Producto para procesar los datos.
        $Categorias = new HorariosCateData;
        // Se establece la plantilla para obtener sus productos, de lo contrario se imprime un mensaje de error.
        if ($Categorias->setCategoria($dataCategoria['id_categoria'])) {
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataCategoriasHorarios = $Categorias->onlyDetail()) {
                foreach ($dataCategoriasHorarios as $dataCategorias) {
                    // Verifica si se ha creado una nueva página
                    if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página

                        // Establecer color de texto a blanco
                        $pdf->setTextColor(0, 0, 0);
                        $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
                        $pdf->setTextColor(255, 255, 255);
                        $pdf->setFillColor(2, 8, 135);
                        $pdf->setDrawColor(2, 8, 135);
                        $pdf->setFont('Arial', 'B', 11);
                        // Vuelve a imprimir los encabezados en la nueva página
                        $pdf->cell(90, 10, 'Nombre', 1, 0, 'C', 1); // Nueva columna para imagen
                        $pdf->cell(30, 10, $pdf->encodeString('Día'), 1, 0, 'C', 1);
                        $pdf->cell(30, 10, 'Hora de inicio', 1, 0, 'C', 1);
                        $pdf->cell(30, 10, 'Hora final', 1, 1, 'C', 1);
                    }
                    $currentY = $pdf->getY(); // Obtén la coordenada Y actual
                    // Establecer color de texto a blanco
                    $pdf->setTextColor(0, 0, 0);
                    // Se establacen los colores de las celdas
                    $pdf->setDrawColor(0, 0, 0);
                    $pdf->setFont('Arial', 'B', 11);
                    $pdf->setFillColor(255, 255, 255);
                    $pdf->cell(90, 15, $pdf->encodeString($dataCategorias['nombre_horario']), 1, 0, 'C', false);
                    $pdf->cell(30, 15, $pdf->encodeString($dataCategorias['dia']), 1, 0, 'C', false);
                    $pdf->cell(30, 15, $pdf->encodeString($dataCategorias['hora_inicial']), 1, 0, 'C', false);
                    $pdf->cell(30, 15, $pdf->encodeString($dataCategorias['hora_final']), 1, 1, 'C');
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay horarios para la categoría'), 1, 1);
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('Categoría incorrecta o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay horarios para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
