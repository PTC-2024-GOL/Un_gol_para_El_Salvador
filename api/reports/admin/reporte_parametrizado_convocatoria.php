<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para la , de lo contrario se muestra un mensaje.
if (isset($_GET['idPartido'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/convocatorias_data.php');
    // Se instancian las entidades correspondientes.
    $convocatoria = new ConvocatoriasData;

    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Convocatoria del partido');

    // Información general
    $pdf->setFont('Arial', '', 11);
    $pdf->MultiCell(190, 7, $pdf->encodeString('Este informe muestra todos los jugadores que han sido convocados por de director técnico, para el proximo partido.'), 0, 1);
    $pdf->ln(5);
    $pdf->setFont('Arial', 'B', 14);
    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($convocatoria->setPartido($_GET['idPartido'])) {
        try {
            // Se verifica si existen datos, de lo contrario se muestra un mensaje.
            if ($dataFavorito = $convocatoria->readAllReport()) {
                // Establecer color de texto a blanco
                $pdf->setTextColor(0, 0, 0);
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(255, 255, 255);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Arial', 'B', 11);
                $pdf->cell(0, 15, $pdf->encodeString('Información del partido'), 0, 1, 'C', 1);
                // Determinar la localidad del equipo
                $localidad = $dataFavorito[0]['LOCALIDAD'] == 'Local' ? 'Local' : 'Visitante';
                $currentY = $pdf->getY(); // Obtén la coordenada Y actual

                // Obtener los logos y nombres de los equipos
                $logoEquipoPath = '../../images/equipos/' . $dataFavorito[0]['LOGO_EQUIPO'];
                if (!file_exists($logoEquipoPath) || exif_imagetype($logoEquipoPath) != IMAGETYPE_PNG) {
                    $logoEquipoPath = '../../images/equipos/default.png';
                }

                $logoRivalPath = '../../images/rivales/' . $dataFavorito[0]['LOGO_RIVAL'];
                if (!file_exists($logoRivalPath) || exif_imagetype($logoRivalPath) != IMAGETYPE_PNG) {
                    $logoRivalPath = '../../images/jugadores/default1.png';
                }

                $equipo = $dataFavorito[0]['EQUIPO'];
                $rival = $dataFavorito[0]['RIVAL'];

                // Mostrar el nombre y logo en función de la localidad
                if ($localidad == 'Local') {
                    $pdf->cell(60, 15, $pdf->image($logoEquipoPath, $pdf->getX() + 25, $pdf->getY(), 10), 0, 0, 'C', 0);
                    $pdf->cell(70, 15, $pdf->encodeString($equipo . ' vs ' . $rival), 0, 0, 'C', 0);
                    $pdf->cell(60, 15, $pdf->image($logoRivalPath, $pdf->getX() + 15, $pdf->getY(), 10), 0, 1, 'C', 0);
                } else {
                    $pdf->cell(60, 15, $pdf->image($logoRivalPath, $pdf->getX() + 25, $pdf->getY(), 10), 0, 0, 'C', 0);
                    $pdf->cell(70, 15, $pdf->encodeString($rival . ' vs ' . $equipo), 0, 0, 'C', 0);
                    $pdf->cell(60, 15, $pdf->image($logoEquipoPath, $pdf->getX() + 15, $pdf->getY(), 10), 0, 1, 'C', 0);
                }

                $pdf->cell(0, 15, $pdf->encodeString('Campo de juego: ' . $dataFavorito[0]['CANCHA']), 0, 1, 'C', 1);
                $pdf->cell(0, 15, $pdf->encodeString('Fecha del partido: ' . $dataFavorito[0]['FECHA']), 0, 1, 'C', 1);

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
                $pdf->cell(10, 10, '#', 1, 0, 'C', 1);
                $pdf->cell(30, 10, 'Foto', 1, 0, 'C', 1);
                $pdf->cell(106, 10, 'Jugador', 1, 0, 'C', 1);
                $pdf->cell(40, 10, 'Estado', 1, 1, 'C', 1);

                // Se establece la fuente para los datos de los datos.
                $pdf->setFillColor(110, 151, 214);
                $pdf->setDrawColor(0, 0, 0);
                $pdf->setFont('Arial', '', 11);

                // Establecer color de texto a blanco
                $pdf->setTextColor(0, 0, 0);
                $groupedByDate = [];
                // Agrupar los datos por posición principal
                foreach ($dataFavorito as $rowFavorito) {
                    $groupedByDate[$rowFavorito['POSICION_PRINCIPAL']][] = $rowFavorito;
                }
                // Iterar sobre las posiciones agrupadas
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
                            $pdf->cell(10, 10, '#', 1, 0, 'C', 1);
                            $pdf->cell(30, 10, 'Foto', 1, 0, 'C', 1);
                            $pdf->cell(106, 10, 'Jugador', 1, 0, 'C', 1);
                            $pdf->cell(40, 10, 'Estado', 1, 1, 'C', 1);
                            // Establecer color de texto a blanco
                            $pdf->setTextColor(0, 0, 0);
                        }
                        $currentY = $pdf->getY(); // Obtén la coordenada Y actual
                        // Establecer color de texto a blanco
                        $pdf->setTextColor(0, 0, 0);
                        // Se establacen los colores de las celdas
                        $pdf->setDrawColor(0, 0, 0);
                        $pdf->setFont('Arial', '', 11);
                        $pdf->cell(10, 15, $pdf->encodeString($row['DORSAL']), 1, 0, 'C');
                        //Verificación de que el archivo existe
                        $imagePath = '../../images/jugadores/' . $row['FOTO'];
                        // Verifica si el archivo existe y si es un PNG válido
                        if (!file_exists($imagePath) || exif_imagetype($imagePath) != IMAGETYPE_PNG) {
                            // Usa una imagen por defecto o maneja el error
                            $imagePath = '../../images/jugadores/default1.png';
                        }
                        $pdf->cell(30, 15, $pdf->image($imagePath, $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
                        $pdf->cell(106, 15, $pdf->encodeString($row['JUGADOR']), 1, 0, 'C');
                        $pdf->cell(40, 15, $pdf->encodeString($row['CONVOCADO']), 1, 1, 'C');
                    }
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay convocatoria disponible para este partido'), 1, 1, 'C');
            }
        } catch (Exception $e) {
            // Mostrar un mensaje específico si ocurre una excepción
            $pdf->cell(0, 10, $pdf->encodeString('No se pudieron encontrar datos para el reporte'), 1, 1, 'C');
        }
        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'convocatoria_partido.pdf');
    } else {
        print('Partido incorrecto');
    }
} else {
    print('Debe seleccionar un partido');
}
