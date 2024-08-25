<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report();

// Se verifica si existe un valor para la marca, de lo contrario se muestra un mensaje.
if (isset($_GET['idPartido'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/participaciones_partidos_data.php');

    // Se instancian las entidades correspondientes.
    $participacion = new ParticipacionesPartidosData();
    // Se establece el valor de la marca, de lo contrario se muestra un mensaje.
    if ($participacion->setIdPartido($_GET['idPartido'])) {
        // Se verifica si la marca existe, de lo contrario se muestra un mensaje.
        if ($rowParticipacion = $participacion->participationReports()) {

                $pdf->startReport('Participaciones en el partido');

                // Se recorren los registros fila por fila.
                foreach ($rowParticipacion as $item) {
                    $pdf->setFont('Arial', '', 11);
                    $pdf->cell(0, 10, $pdf->encodeString($item['nombre_jugador']), 1, 1, 'C');
                }

            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay productos para la marca'), 0, 1, 'C');
            }
            // Se llama implícitamente al método footer() y se envía el documento al navegador web.
            $pdf->output('I', 'Productos por marca.pdf');
        } else {
            print('Marca inexistente');
        }
} else {
    print('No se proporcionó un ID de marca.');
}

