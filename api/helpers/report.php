<?php
// Se incluye la clase para generar archivos PDF.
require_once('../../libraries/fpdf185/fpdf.php');

/*
*   Clase para definir las plantillas de los reportes del sitio privado.
*   Para más información http://www.fpdf.org/
*/
class Report extends FPDF
{
    // Constante para definir la ruta de las vistas del sitio privado.
    const CLIENT_URL = 'https://huellitaspets.shop/sitio_gol_sv/views/admin/pages/';
    // Propiedad para guardar el título del reporte.
    private $title = null;

    /*
    *   Método para iniciar el reporte con el encabezado del documento.
    *   Parámetros: $title (título del reporte).
    *   Retorno: ninguno.
    */
    public function startReport($title)
    {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en los reportes.
        session_start();
        // Se verifica si un administrador ha iniciado sesión para generar el documento, de lo contrario se direcciona a la página web principal.
        if (isset($_SESSION['idAdministrador'])) {
            // Se asigna el título del documento a la propiedad de la clase.
            $this->title = $title;
            // Se establece el título del documento (true = utf-8).
            $this->setTitle('OneGoal - Reporte', true);
            // Aquí se establece el margen Izquierdo, Derecho y de Arriba, en el FOOTER SE PONE EL DE ABAJO.
            // Se establecen los márgenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se añade una nueva página al documento con orientación vertical y formato carta, llamando implícitamente al método header()
            $this->addPage('P', 'Letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        } else {
            header('location:' . self::CLIENT_URL);
        }
    }

    /*
    *   Método para codificar una cadena de alfabeto español a UTF-8.
    *   Parámetros: $string (cadena).
    *   Retorno: cadena convertida.
    */
    public function encodeString($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'utf-8');
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del encabezado de los reportes.
    *   Se llama automáticamente en el método addPage()
    */
    public function header()
    {
        // Fondo superior derecho
        $this->image('../../images/fondo_superior_izquierdo.png', 98, 0, 128);

        // Logo
        $this->image('../../images/fondo_superior_derecho.png', 0, 0, 108);
        
        // Título
        $this->setFont('Arial', 'B', 20);
        $this->Ln(6);
        $this->cell(0, 25, $this->encodeString($this->title), 0, 1, 'R');
        
        // Fecha y hora
        $this->setFont('Arial', '', 12);
        $this->cell(0, 0, 'Fecha/Hora: ' . date('d-m-Y H:i:s'), 0, 1, 'R');
        // Se define la imagen del fondo en el centro del reporte
        // $this->image('../../images/logo_semi_transparente.png', 45, 95, 128, 128);
        // Salto de línea
        $this->ln(15);
        // Fondo inferior derecho
        $this->image('../../images/footer.png', 0, 240, 216, 40);
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del pie de los reportes.
    *   Se llama automáticamente en el método output()
    */
    public function footer()
    {
        // Establecer color de texto a blanco
        $this->setTextColor(0, 0, 0);
        // ESTE ES EL MARGEN INFERIOR.
        $this->setY(-20);
        $this->setFont('Arial', 'I', 10);
        // Número de página y usuario
        $this->cell(0, 10, $this->encodeString('Generado por: ' . $_SESSION['nombreAdministrador']), 0, 1, 'R');
        $this->cell(0, 10, $this->encodeString('Página ') . $this->pageNo() . '/{nb}', 0, 0, 'C');
    }
}