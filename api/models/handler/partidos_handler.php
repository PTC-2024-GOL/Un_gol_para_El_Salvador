<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
require('C:/xampp/htdocs/sitio_gol_sv/vendor/autoload.php');

use Phpml\Classification\KNearestNeighbors;
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Subcontenido.
 */

class PartidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $idEquipo = null;
    protected $logoRival = null;
    protected $logoEquipo = null;
    protected $informacion = null;
    protected $nombreEquipo = null;
    protected $nombreRival = null;
    protected $canchaPartido = null;
    protected $resultadoPartido = null;
    protected $localidadPartido = null;
    protected $tipoResultadoPartido = null;
    protected $idJornada = null;
    protected $rivalPartido = null;
    protected $idPartido = null;
    protected $idRival = null;
    protected $fechaPartido = null;
    protected $marcadorRival = null;
    protected $marcadorRivalVictoriaDerrota = null;
    protected $marcadorEquipo = null;
    protected $marcadorEquipoVictoriaDerrota = null;
    protected $contenidosUltimos2Meses = null;
    protected $frecuenciaEntrenamientosUltimos2Meses = null;
    protected $notasPromedioUltimos2Meses = null;
    protected $notasPosicionOfensivaUltimos2Meses = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/partidos/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     * 
     */

    //Función para buscar un partido en base al nombre del rival o del equipo en casa
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = "SELECT * FROM vista_detalle_partidos
                WHERE nombre_rival LIKE ? OR nombre_equipo LIKE ? OR fecha LIKE ?;";
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un partido. 
    public function createRow()
    {
        $sql = 'CALL insertarPartido(?, ?, ?, ?, ?, ?, ?, ?);';
        $params = array(
            $this->idEquipo,
            $this->idRival,
            $this->canchaPartido,
            $this->resultadoPartido,
            $this->localidadPartido,
            $this->tipoResultadoPartido,
            $this->idJornada,
            $this->fechaPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las un partido o varios. 
    public function readAll()
    {
        $sql = "SELECT * FROM vista_detalle_partidos;";
        return Database::getRows($sql);
    }

    public function readAllTheLast5()
    {
        $sql = "SELECT * FROM vista_detalle_partidos ORDER BY id_partido DESC LIMIT 6;";
        return Database::getRows($sql);
    }

    public function readAll2()
    {
        $sql = 'SELECT * FROM vista_detalle_partidos_tecnicos WHERE id_tecnico = ?';
        $params = array($_SESSION['idTecnico']);
        return Database::getRows($sql, $params);
    }

    //Función para leer los partidos por el idEquipo

    public function readAllByIdEquipo()
    {
        $sql = "SELECT * FROM vista_detalle_partidos WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para leer los partidos por el idEquipo

    public function readAllByIdEquipoLimit20()
    {
        $sql = "SELECT * FROM vista_detalle_partidos WHERE id_equipo = ? ORDER BY id_partido DESC LIMIT 20;";
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para leer un partido o varios. 

    public function readOne()
    {
        $sql = "SELECT * FROM vista_partidos_equipos WHERE id_partido = ?;";
        $params = array($this->idPartido);
        return Database::getRow($sql, $params);
    }

    //Función para leer un partido o varios. 

    public function readOnePublic()
    {
        $sql = "SELECT
        p.id_partido,
        DATE_FORMAT(p.fecha_partido, '%e de %M del %Y') AS fecha,
        p.localidad_partido,
        p.resultado_partido,
        i.logo_rival,
        e.logo_equipo,
        e.nombre_equipo,
        i.nombre_rival AS nombre_rival,
        p.tipo_resultado_partido,
        e.id_equipo,
        i.id_rival,
        e.id_categoria,
        c.nombre_categoria, 
        p.cancha_partido,
        t.nombre_temporada
        FROM
        partidos p
        INNER JOIN
        equipos e ON p.id_equipo = e.id_equipo
        INNER JOIN
	    rivales i ON p.id_rival = i.id_rival
        INNER JOIN
        categorias c ON e.id_categoria = c.id_categoria
        INNER JOIN
        plantillas_equipos pe ON pe.id_equipo = e.id_equipo
        INNER JOIN 
        temporadas t ON t.id_temporada = pe.id_temporada
        WHERE id_partido = ?
        ORDER BY p.fecha_partido DESC;";
        $params = array($this->idPartido);
        return Database::getRow($sql, $params);
    }

    //Función para leer una jornada o varios. 

    public function readOneJornada()
    {
        $sql = "SELECT id_jornada,  nombre_jornada FROM jornadas;";
        return Database::getRows($sql);
    }

    //Función para leer un rival  o varios. 

    public function readOneRivales()
    {
        $sql = "SELECT id_rival, nombre_rival, logo_rival FROM rivales;";
        return Database::getRows($sql);
    }

    //Función para leer una equipo o varios. 

    public function readOneEquipos()
    {
        $sql = "SELECT id_equipo,  nombre_equipo, logo_equipo FROM equipos;";
        return Database::getRows($sql);
    }

    //Función para actualizar un partidio o varios. 

    public function updateRow()
    {
        $sql = 'UPDATE partidos SET id_jornada = ?, id_equipo = ?, id_rival = ?, cancha_partido = ?,
        resultado_partido = ?, localidad_partido = ?, tipo_resultado_partido = ?, fecha_partido = ? WHERE id_partido = ?;';
        $params = array(
            $this->idJornada,
            $this->idEquipo,
            $this->idRival,
            $this->canchaPartido,
            $this->resultadoPartido,
            $this->localidadPartido,
            $this->tipoResultadoPartido,
            $this->fechaPartido,
            $this->idPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un partido o varios. 

    public function deleteRow()
    {
        $sql = 'DELETE FROM partidos WHERE id_partido = ?;';
        $params = array($this->idPartido);
        return Database::executeRow($sql, $params);
    }

    // FUNCIONES PARA EL DASHBOARD

    public function lastMatch()
    {
        $sql = 'SELECT * FROM vista_detalle_partidos ORDER BY fecha DESC LIMIT 1';
        return Database::getRow($sql);
    }

    public function lastMatchTecnics()
    {
        $sql = 'SELECT * FROM vista_detalle_partidos_tecnicos WHERE id_tecnico = ? ORDER BY fecha ASC LIMIT 1';
        $params = array($_SESSION['idTecnico']);
        return Database::getRow($sql, $params);
    }


    public function matchesResult()
    {

        $sql = 'CALL resultadosPartido(?);';
        $params = array($this->idEquipo);
        return Database::getRow($sql, $params);
    }

    public function trainingAnylsis()
    {
        $sql = 'CALL analisisEntrenamientos(?);';
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para leer una equipo o varios. 

    public function readOneEquiposTecnico()
    {
        $sql = "SELECT id_equipo,  nombre_equipo, logo_equipo, id_tecnico FROM vista_select_equipos_con_imagen WHERE id_tecnico = ?;";
        $params = array($_SESSION['idTecnico']);
        return Database::getRows($sql, $params);
    }
    /*
        *
        *
        *
        *
        *
        *
        *
        *
        FUNCIONES PARA EL GRÁFICO PREDICTIVO USANDO MACHINE LEARNING
        *
        *
        *
        *
        *
        *
        *
        *
        *
    */
    // 1. Marcador de los últimos partidos del rival
    public function MarcadorRival()
    {
        $sql = "SELECT resultado_partido FROM partidos WHERE id_rival = ? AND tipo_resultado_partido <> 'Pendiente';";
        $params = array($this->idRival);
        $this->marcadorRival = Database::getRows($sql, $params);
        return $this->marcadorRival;
    }

    // 2. Marcador de victorias o derrotas y si eran local o visitante
    public function MarcadorRivalVictoriaOderrota()
    {
        $sql = "SELECT CONCAT(localidad_partido, ', ', tipo_resultado_partido) AS resultado FROM partidos WHERE id_rival = ?;";
        $params = array($this->idRival);
        $this->marcadorRivalVictoriaDerrota = Database::getRows($sql, $params);
        return $this->marcadorRivalVictoriaDerrota;
    }

    // 3. Marcador de los últimos partidos del equipo
    public function MarcadorEquipo()
    {
        $sql = "SELECT resultado_partido FROM partidos WHERE id_equipo = ? AND tipo_resultado_partido <> 'Pendiente';";
        $params = array($this->idEquipo);
        $this->marcadorEquipo = Database::getRows($sql, $params);
        return $this->marcadorEquipo;
    }

    // 4. Marcador de victorias o derrotas del equipo y si eran local o visitante
    public function MarcadorEquipoVictoriaOderrota()
    {
        $sql = "SELECT CONCAT(localidad_partido, ', ', tipo_resultado_partido) AS resultado FROM partidos WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        $this->marcadorEquipoVictoriaDerrota = Database::getRows($sql, $params);
        return $this->marcadorEquipoVictoriaDerrota;
    }

    // 5. Contenidos vistos en los últimos 2 meses, nombre del contenido y frecuencia
    public function ContenidosUltimos2Meses()
    {
        $sql = "SELECT sub_tema_contenido, COUNT(sub_tema_contenido) AS frecuencia FROM vista_entrenamientos_contenidos 
    WHERE id_equipo = ? AND fecha_entrenamiento >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) GROUP BY sub_tema_contenido;";
        $params = array($this->idEquipo);
        $this->contenidosUltimos2Meses = Database::getRows($sql, $params);
        return $this->contenidosUltimos2Meses;
    }

    // 6. Cantidad de entrenamientos en los últimos 2 meses
    public function FrecuenciaEntrenamientosUltimos2Meses()
    {
        $sql = "SELECT COUNT(id_entrenamiento) AS frecuencia_entrenamientos FROM entrenamientos WHERE id_equipo = ? AND fecha_entrenamiento >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH);";
        $params = array($this->idEquipo);
        $this->frecuenciaEntrenamientosUltimos2Meses = Database::getRows($sql, $params);
        return Database::getRow($sql, $params);;
    }

    // 7. Logo, nombre del equipo y lo mismo del rival
    public function InformacionEquipoYRival()
    {
        $sql = "SELECT logo_rival, nombre_rival, logo_equipo, logo_rival, id_rival, id_equipo, localidad_partido, nombre_equipo, fecha  FROM vista_detalle_partidos WHERE id_partido = ?;";
        $params = array($this->idPartido);
        $this->informacion = Database::getRow($sql, $params);
        $this->logoRival = $this->informacion['logo_rival'];
        $this->logoEquipo = $this->informacion['logo_equipo'];
        $this->nombreEquipo = $this->informacion['nombre_equipo'];
        $this->nombreRival = $this->informacion['nombre_rival'];
        $this->idRival = $this->informacion['id_rival'];
        $this->idEquipo = $this->informacion['id_equipo'];
        $this->localidadPartido = $this->informacion['localidad_partido'];
        $this->fechaPartido = $this->informacion['fecha'];
        return $this->informacion;
    }

    // 8. Nota pruebas promedio en cada área en los últimos 2 meses
    public function NotasPromedioUltimos2Meses()
    {
        $sql = "SELECT IDJ, JUGADOR, ROUND(AVG(NOTA), 2) AS promedio FROM vista_caracteristicas_analisis_2
    WHERE fecha_entrenamiento >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND id_equipo = ? GROUP BY IDJ, JUGADOR HAVING promedio > 0;";
        $params = array($this->idEquipo);
        $this->notasPromedioUltimos2Meses = Database::getRows($sql, $params);
        return $this->notasPromedioUltimos2Meses;
    }

    // 9. Nota de la última evaluación de los delanteros y cantidad de asistencias en los últimos 2 meses
    public function NotasPosicionOfensivaUltimos2Meses()
    {
        $sql = "SELECT DISTINCT frecuencia, id_jugador, promedio, nombre_jugador FROM delantero_asistencias_evaluaciones WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        $this->notasPosicionOfensivaUltimos2Meses = Database::getRows($sql, $params);
        return $this->notasPosicionOfensivaUltimos2Meses;
    }

    // Aquí se incluye la lógica de la predicción de partidos
    public function calcularProbabilidadVictoriaRival()
    {
        $samples = [];
        $labels = [];

        $this->MarcadorRival();
        $this->MarcadorRivalVictoriaOderrota();

        // Recorre los resultados de los partidos del rival
        foreach ($this->marcadorRival as $partido) {
            $resultado = explode('-', $partido['resultado_partido']);
            $goles_rival = (int) $resultado[1];
            $goles_equipo = (int) $resultado[0];

            // Agrega la muestra (goles del rival y del equipo) al arreglo de samples
            $samples[] = [$goles_rival, $goles_equipo];
            $labels[] = $goles_rival; // Guardar los goles del rival como etiquetas
        }

        // Entrena el clasificador KNN con los datos de muestras y etiquetas
        $classifier = new KNearestNeighbors();
        $classifier->train($samples, $labels);

        // Obtener la predicción para un resultado específico
        $resultadoPartido = explode(', ', $this->marcadorRivalVictoriaDerrota[0]['resultado']);
        if ($resultadoPartido[1] === 'Victoria') {
            $goles_rival = 1;
            $goles_equipo = 0;
        } elseif ($resultadoPartido[1] === 'Derrota') {
            $goles_rival = 0;
            $goles_equipo = 1;
        } else {
            $goles_rival = 1;
            $goles_equipo = 1;
        }

        // Retorna la predicción de goles del rival
        return $classifier->predict([$goles_rival, $goles_equipo]);
    }

    public function calcularProbabilidadVictoriaEquipo()
    {
        $samples = [];
        $labels = [];

        $this->MarcadorEquipo();
        $this->MarcadorEquipoVictoriaOderrota();

        // Recorre los resultados de los partidos del equipo
        foreach ($this->marcadorEquipo as $partido) {
            $resultado = explode('-', $partido['resultado_partido']);
            $goles_equipo = (int) $resultado[0];
            $goles_rival = (int) $resultado[1];

            // Agrega la muestra (goles del equipo y del rival) al arreglo de samples
            $samples[] = [$goles_equipo, $goles_rival];
            $labels[] = $goles_equipo; // Guardar los goles del equipo como etiquetas
        }

        // Entrena el clasificador KNN con los datos de muestras y etiquetas
        $classifier = new KNearestNeighbors();
        $classifier->train($samples, $labels);

        // Obtener la predicción para un resultado específico
        $resultadoPartido = explode(', ', $this->marcadorEquipoVictoriaDerrota[0]['resultado']);
        if ($resultadoPartido[1] === 'Victoria') {
            $goles_equipo = 1;
            $goles_rival = 0;
        } elseif ($resultadoPartido[1] === 'Derrota') {
            $goles_equipo = 0;
            $goles_rival = 1;
        } else {
            $goles_equipo = 1;
            $goles_rival = 1;
        }

        // Retorna la predicción de goles del equipo
        return $classifier->predict([$goles_equipo, $goles_rival]);
    }


    public function clasificarEquipoPorEntrenamientos()
    {
        // Llama al método que obtiene la frecuencia de entrenamientos
        $this->FrecuenciaEntrenamientosUltimos2Meses();

        // Accede correctamente al valor de frecuencia_entrenamientos y conviértelo a entero
        $entrenamientos = $this->frecuenciaEntrenamientosUltimos2Meses[0];
        $entrenamientos = (int) $entrenamientos['frecuencia_entrenamientos'];

        // Clasifica el equipo en función de la frecuencia de entrenamientos
        if ($entrenamientos >= 25 && $entrenamientos <= 33) {
            return 'Preparado';
        } elseif ($entrenamientos >= 19 && $entrenamientos <= 24) {
            return 'Regular';
        } else {
            return 'Deficiente';
        }
    }



    public function subtemaMasFrecuente()
    {
        $subtema_frecuente = '';
        $max_frecuencia = 0;
        $this->ContenidosUltimos2Meses();

        foreach ($this->contenidosUltimos2Meses as $contenido) {
            $frecuencia = (int) $contenido['frecuencia']; // Convertir la frecuencia a un valor entero

            if ($frecuencia > $max_frecuencia) {
                $max_frecuencia = $frecuencia;
                $subtema_frecuente = $contenido['sub_tema_contenido'];
            }
        }

        return $subtema_frecuente;
    }

    public function subtemaMenosFrecuente()
    {
        $subtema_menos_frecuente = '';
        $min_frecuencia = PHP_INT_MAX; // Inicializar con el valor máximo posible
        $this->ContenidosUltimos2Meses();

        foreach ($this->contenidosUltimos2Meses as $contenido) {
            $frecuencia = (int) $contenido['frecuencia']; // Convertir la frecuencia a un valor entero

            if ($frecuencia < $min_frecuencia) {
                $min_frecuencia = $frecuencia;
                $subtema_menos_frecuente = $contenido['sub_tema_contenido'];
            }
        }

        return $subtema_menos_frecuente;
    }



    public function calcularPromedioNotas()
    {
        $this->NotasPromedioUltimos2Meses();
        $suma_notas = 0;
        $total_jugadores = count($this->notasPromedioUltimos2Meses);

        foreach ($this->notasPromedioUltimos2Meses as $nota) {
            $suma_notas += (float) $nota['promedio']; // Convertir el promedio a un valor flotante
        }

        return $total_jugadores ? round($suma_notas / $total_jugadores, 2) : 0;
    }



    public function evaluarDelanteros()
    {
        $mejores_notas = [];
        $this->NotasPosicionOfensivaUltimos2Meses();

        foreach ($this->notasPosicionOfensivaUltimos2Meses as $nota) {
            $mejores_notas[$nota['nombre_jugador']] = (float) $nota['promedio'];
        }

        arsort($mejores_notas);
        return array_slice($mejores_notas, 0, 3, true);
    }

    //Función para leer los partidos por el idEquipo

    public function readAllByIdJugadorOld()
    {
        $sql = "SELECT * FROM vista_detalle_partidos_jugadores WHERE id_jugador = ? ORDER BY fecha ASC ;";
        $params = array($_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }

    public function readAllByIdJugadorNew()
    {
        $sql = "SELECT * FROM vista_detalle_partidos_jugadores WHERE id_jugador = ? ORDER BY fecha DESC ;";
        $params = array($_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }


    public function generarMensajePrediccion()
    {
        $this->InformacionEquipoYRival();
        $prediccionRival = $this->calcularProbabilidadVictoriaRival();
        $prediccionEquipo = $this->calcularProbabilidadVictoriaEquipo();
        $subtemaMenor = $this->subtemaMenosFrecuente();
        $subtemaMayor = $this->subtemaMasFrecuente();
        $mejoresDelanteros = $this->evaluarDelanteros();
        $nombresDelanteros = implode(', ', array_keys($mejoresDelanteros));

        $mensaje1 = "Bajo la frecuencia de entrenamientos de este mes y las áreas reforzadas, los resultados en enfrentamientos de tu equipo y del rival, se predice el resultado de este partido:\n";
        $mensaje2 = "[Logo equipo 1] {$prediccionEquipo} - {$prediccionRival} [logo rival]\n";
        $mensaje3 = "Reforzar el área de {$subtemaMenor}, jugar limpio. En este partido tu area más fuerte será {$subtemaMayor}, ¡así que potencialo!; Se espera que en la ofensiva los titulares de este partido sean: {$nombresDelanteros}.";

        return [
            'prediccionRival' => $prediccionRival,
            'prediccionEquipo' => $prediccionEquipo,
            'subtemaMenor' => $subtemaMenor,
            'subtemaMayor' => $subtemaMayor,
            'mejoresDelanteros' => $mejoresDelanteros,
            'nombresDelanteros' => $nombresDelanteros,
            'logoRival' => $this->logoRival,
            'logoEquipo' => $this->logoEquipo,
            'nombreEquipo' => $this->nombreEquipo,
            'nombreRival' => $this->nombreRival,
            'idRival' => $this->idRival,
            'idEquipo' => $this->idEquipo,
            'localidadPartido' => $this->localidadPartido,
            'fechaPartido' => $this->fechaPartido,
            'mensaje' => $mensaje1,
            'mensaje2' => $mensaje2,
            'mensaje3' => $mensaje3
        ];
    }
}
