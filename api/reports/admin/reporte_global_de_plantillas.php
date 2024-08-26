<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/plantillas_equipos_data.php');
require_once('../../models/data/plantillas_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reporte global de plantillas');

// Se instancia el modelo Categoría para obtener los datos.
$Plantilla = new PlantillasData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataPlantillas = $Plantilla->readAll()) {
    
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
    $pdf->cell(30, 10, 'Foto', 1, 0, 'C', 1); // Nueva columna para imagen
    $pdf->cell(90, 10, 'Jugador', 1, 0, 'C', 1);
    $pdf->cell(30, 10, $pdf->encodeString('Logo'), 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Equipo', 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataPlantillas as $rowPlantilla) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setFillColor(2, 8, 135);
            $pdf->setDrawColor(2, 8, 135);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(30, 10, 'Foto', 1, 0, 'C', 1); // Nueva columna para imagen
            $pdf->cell(90, 10, 'Jugador', 1, 0, 'C', 1);
            $pdf->cell(30, 10, $pdf->encodeString('Logo'), 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Equipo', 1, 1, 'C', 1);
        }

        $pdf->setFillColor(110, 151, 214);
        $pdf->setDrawColor(0, 0, 0);
        $pdf->setFont('Arial', 'B', 11);
        
        // Establecer color de texto a blanco
        $pdf->setTextColor(0, 0, 0);
        // Imprime una celda con el nombre de la plantilla.
        $pdf->cell(180, 10, $pdf->encodeString('Plantilla: ' . $rowPlantilla['NOMBRE']), 1, 1, 'C', 1);

        // Se instancia el modelo Producto para procesar los datos.
        $plantillas = new PlantillasEquiposData;
        // Se establece la plantilla para obtener sus productos, de lo contrario se imprime un mensaje de error.
        if ($plantillas->setIdPlantilla($rowPlantilla['ID'])) {
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataPlantillasEquipos = $plantillas->readOneTemplate()) {
                foreach ($dataPlantillasEquipos as $rowPlantillas) {
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
                        $pdf->cell(30, 10, 'Foto', 1, 0, 'C', 1); // Nueva columna para imagen
                        $pdf->cell(90, 10, 'Jugador', 1, 0, 'C', 1);
                        $pdf->cell(30, 10, $pdf->encodeString('Logo'), 1, 0, 'C', 1);
                        $pdf->cell(30, 10, 'Equipo', 1, 1, 'C', 1);
                    }
                    $currentY = $pdf->getY(); // Obtén la coordenada Y actual
                    // Establecer color de texto a blanco
                    $pdf->setTextColor(0, 0, 0);
                    // Se establacen los colores de las celdas
                    $pdf->setDrawColor(0, 0, 0);
                    $pdf->setFont('Arial', 'B', 11);
                    $pdf->setFillColor(255, 255, 255);
                    //Verificación de que el archivo existe
                    $imagePath = '../../images/jugadores/' . $rowPlantillas['IMAGEN'];
                    // Verifica si el archivo existe y si es un PNG válido
                    if (!file_exists($imagePath) || exif_imagetype($imagePath) != IMAGETYPE_PNG) {
                        // Usa una imagen por defecto o maneja el error
                        $imagePath = '../../images/jugadores/default1.png';
                    }
                    $pdf->cell(30, 15, $pdf->image($imagePath, $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
                    // Imprime las celdas con los datos del producto.
                    $pdf->cell(90, 15, $pdf->encodeString($rowPlantillas['NOMBRE']), 1, 0, 'C', false);
                    //Verificación de que el archivo existe
                    $logoPath = '../../images/equipos/' . $rowPlantillas['IMAGEN'];
                    // Verifica si el archivo existe y si es un PNG válido
                    if (!file_exists($logoPath) || exif_imagetype($logoPath) != IMAGETYPE_PNG) {
                        // Usa una imagen por defecto o maneja el error
                        $logoPath = '../../images/equipos/default.png';
                    }
                    $pdf->cell(30, 15, $pdf->image($logoPath, $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
                    $pdf->cell(30, 15, $pdf->encodeString($rowPlantillas['NOMBRE_EQUIPO']), 1, 1, 'C');
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay jugadores para la plantilla'), 1, 1);
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('Plantilla incorrecta o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay plantillas para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
