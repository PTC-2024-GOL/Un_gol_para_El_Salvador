<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report();

// Se verifica si existe un valor para el partido, de lo contrario se muestra un mensaje.
if (isset($_GET['idJugador'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/estado_fisico_jugador_data.php');

    // Se instancian las entidades correspondientes.
    $estado_fisico = new EstadoFisicoJugadorData();

    // Se establece el valor del partido, de lo contrario se muestra un mensaje.
    if ($estado_fisico->setIdJugador($_GET['idJugador'])) {

        //Iniciamos el reporte, asi mismo mandamos el titulo del reporte
        $pdf->startReport('Estado físico - Historial');

        //Obtenemos la data del partido.
        if ($rowEstadoFisico = $estado_fisico->readAll()) {
            $nombre_jugador = $rowEstadoFisico[0]['nombre_jugador']; // Obtenemos el nombre del jugador del primer registro

            // Imprimir el nombre del jugador en el reporte antes de la tabla
            $pdf->setFont('Arial', 'B', 11); // Fuente para el nombre
            $pdf->cell(50, 10, 'Nombre del jugador: ', 0, 0, 'L');
            $pdf->setFont('Arial', '', 11);
            $pdf->cell(18, 10, $pdf->encodeString($nombre_jugador), 0, 1, 'R'); // Celda para el nombre del jugador
            $pdf->ln(2); // Salto de línea para separar el nombre de la tabla

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
            $pdf->cell(60, 10, 'Fecha de registro', 1, 0, 'C', 1); // Nueva columna para imagen
            $pdf->cell(65, 10, 'Altura (centimetros)', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Peso (lbs)', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'IMC', 1, 1, 'C', 1);

            // Se recorren los registros fila por fila.
            foreach ($rowEstadoFisico as $item) {
                $nombre = $item['nombre_jugador'];
                $pdf->setFont('Arial', '', 11);
                // Establecer color de texto a negro
                $pdf->setTextColor(0, 0, 0);
                //Asignamos la data traida de participaciones partido a las filas.
                $pdf->cell(60, 10, $pdf->encodeString($item['fecha_creacion_format']), 1, 0, 'C');
                $pdf->cell(65, 10, $pdf->encodeString($item['altura_jugador']. ' cm'), 1, 0, 'C');
                $pdf->cell(30, 10, $pdf->encodeString($item['peso_jugador']. ' lbs'), 1, 0, 'C');
                $pdf->cell(30, 10, $pdf->encodeString($item['indice_masa_corporal']), 1, 1, 'C');
            }
        } else {
            //Asignamos la fuente normal
            $pdf->setFont('Arial', '', 13);
            $pdf->cell(0, 80, $pdf->encodeString('Aún no hay registro físico para el jugador'), 0, 1, 'C');
        }
    } else {
        print('Jugador inexistente');
    }
}else{
    print('No se proporcionó un ID del jugador.');
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'Registro físico.pdf');
