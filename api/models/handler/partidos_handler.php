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
    protected $notasWellnesUltimos2Meses = null;
    protected $notasPosicionUltimos2Meses = null;
    protected $notasWellnesOfensivaUltimos2Meses = null;

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
        $sql = "SELECT * FROM vista_detalle_partidos ORDER BY fecha_partido DESC LIMIT 6;";
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

    //Función para leer un equipo sin partidos.
    public function readPartidoSinEquipo()
    {
        $sql = "SELECT p.nombre_equipo, p.logo_equipo, c.nombre_categoria 
        FROM equipos p 
        INNER JOIN categorias c ON p.id_categoria = c.id_categoria 
        WHERE p.id_equipo = ?;";
        $params = array($this->idEquipo);
        return Database::getRow($sql, $params);
    }
    //Función para leer los partidos por el idEquipo

    public function readAllByIdEquipoLimit20()
    {
        $sql = "SELECT * FROM vista_detalle_partidos WHERE id_equipo = ? ORDER BY fecha_partido DESC LIMIT 20;";
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
        return Database::getRow($sql, $params);
        ;
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

    // 10. Nota de los últimos resultados en test de los delanteros 
    public function NotasTestWellnesOfensivaUltimos2Meses()
    {
        $sql = "SELECT id_jugador, nombre_jugador, promedio FROM delantero_test_wellnes WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        $this->notasWellnesOfensivaUltimos2Meses = Database::getRows($sql, $params);
        return $this->notasWellnesOfensivaUltimos2Meses;
    }

    // 11. Nota de la última evaluación de todos los jugadores y cantidad de asistencias en los últimos 2 meses
    public function NotasPosicionUltimos2Meses()
    {
        $sql = "SELECT DISTINCT frecuencia, id_jugador, promedio, nombre_jugador FROM asistencias_evaluaciones WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        $this->notasPosicionUltimos2Meses = Database::getRows($sql, $params);
        return $this->notasPosicionUltimos2Meses;
    }

    // 12. Nota del test de wellness de todos los jugaores del equipo en los últimos 2 meses
    public function NotasTestWellnesUltimos2Meses()
    {
        $sql = "SELECT id_jugador, nombre_jugador, promedio FROM test_wellnes WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        $this->notasWellnesUltimos2Meses = Database::getRows($sql, $params);
        return $this->notasWellnesUltimos2Meses;
    }
    // Aquí se incluye la lógica de la predicción de partidos
    public function calcularProbabilidadVictoriaRival()
    {
        $samples = [];
        $labels = [];
        $this->MarcadorRival();  // Obtenemos los resultados con goles
        $this->MarcadorRivalVictoriaOderrota();  // Obtenemos la información de victoria/derrota

        // Recorre los resultados de los partidos del rival
        foreach ($this->marcadorRival as $partido) {
            $resultado = explode('-', $partido['resultado_partido']);

            // Validar que el resultado tiene el formato esperado (al menos 2 partes)
            if (count($resultado) < 2) {
                continue; // Si no tiene el formato correcto, saltar este partido
            }

            $goles_rival = (int) $resultado[1];
            $goles_equipo = (int) $resultado[0];

            // Agrega la muestra (goles del rival y del equipo) al arreglo de samples
            $samples[] = [$goles_rival, $goles_equipo];
            $labels[] = $goles_rival; // Guardar los goles del rival como etiquetas
        }

        // Entrena el clasificador KNN con los datos de muestras y etiquetas
        $classifier = new KNearestNeighbors();
        $classifier->train($samples, $labels);

        // Ahora recorremos el marcador de victoria/derrota y realizamos la predicción
        foreach ($this->marcadorRivalVictoriaDerrota as $partido) {
            $resultadoPartido = explode(', ', $partido['resultado']);

            // Verificamos si el partido es Victoria, Derrota o Pendiente
            if (count($resultadoPartido) < 2 || $resultadoPartido[1] === 'Pendiente') {
                continue; // Saltar si no hay información suficiente o el partido está pendiente
            }

            // Obtenemos los goles exactos del partido anterior para predecir el próximo resultado
            // Asumimos que la predicción será similar a partidos pasados
            if ($resultadoPartido[1] === 'Victoria') {
                // Se predice como una victoria del rival
                $goles_rival = 2;  // Puedes ajustar este valor según los datos históricos de victorias
                $goles_equipo = 1;
            } elseif ($resultadoPartido[1] === 'Derrota') {
                // Se predice como una derrota del rival
                $goles_rival = 1;
                $goles_equipo = 2;  // Ajustar según los datos históricos
            } else {
                // Caso empate
                $goles_rival = 1;
                $goles_equipo = 1;
            }

            // Realiza la predicción de los goles del rival en base a los datos históricos
            return $classifier->predict([$goles_rival, $goles_equipo]);
        }
    }



    public function calcularProbabilidadVictoriaEquipo()
    {
        $samples = [];
        $labels = [];

        // Recolecta los datos de los partidos del equipo
        $this->MarcadorEquipo();  // Obtiene los resultados con goles
        $this->MarcadorEquipoVictoriaOderrota();  // Obtiene la información de victoria/derrota

        // Recorre los resultados de los partidos del equipo
        foreach ($this->marcadorEquipo as $partido) {
            $resultado = explode('-', $partido['resultado_partido']);

            // Validar que el resultado tiene el formato esperado (al menos 2 partes)
            if (count($resultado) < 2) {
                continue; // Si no tiene el formato correcto, saltar este partido
            }

            $goles_equipo = (int) $resultado[0];
            $goles_rival = (int) $resultado[1];

            // Almacena los goles exactos del equipo y del rival
            $samples[] = [$goles_equipo, $goles_rival];
            $labels[] = $goles_equipo; // Goles del equipo como etiquetas para entrenar
        }

        // Entrena el clasificador KNN con las muestras (goles del equipo y del rival)
        $classifier = new KNearestNeighbors();
        $classifier->train($samples, $labels);

        // Recorre los resultados obtenidos en MarcadorEquipoVictoriaOderrota
        foreach ($this->marcadorEquipoVictoriaDerrota as $partido) {
            $resultadoPartido = explode(', ', $partido['resultado']);  // Usamos coma para separar localidad y resultado

            // Verificamos que tengamos suficientes datos
            if (count($resultadoPartido) < 2) {
                continue; // Saltar si no hay información suficiente
            }

            // Asumimos que el primer valor es la localidad, y el segundo es el resultado (Victoria o Derrota)
            $tipoResultado = $resultadoPartido[1];  // 'Victoria', 'Derrota' o 'Pendiente'

            // Se asignan goles para la predicción en base a la historia de partidos
            if ($tipoResultado === 'Victoria') {
                // Supongamos que el equipo suele marcar más goles en victorias
                $goles_equipo = 2; // Ajusta este valor según datos históricos
                $goles_rival = 1;  // Ajusta este valor según datos históricos
            } elseif ($tipoResultado === 'Derrota') {
                // En derrotas, se puede predecir que el equipo marca menos
                $goles_equipo = 1;
                $goles_rival = 2;  // Ajusta según datos históricos
            } else {
                // Para empates o pendientes
                $goles_equipo = 1;
                $goles_rival = 1;  // Ajusta según datos históricos
            }

            // Realiza la predicción de los goles del equipo
            return $classifier->predict([$goles_equipo, $goles_rival]);
        }
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

        // Convertir el subtema más frecuente a minúsculas antes de retornarlo
        return strtolower($subtema_frecuente);
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

        return strtolower($subtema_menos_frecuente);
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
        $mejores_test = [];
        $frecuencia_entrenamientos = [];
        $jugadores_repetidos = [];

        // Obtener las notas de los últimos 2 meses de las posiciones ofensivas
        $this->NotasPosicionOfensivaUltimos2Meses();
        $this->NotasTestWellnesOfensivaUltimos2Meses();

        // Crear arrays con los nombres de los jugadores y sus respectivas notas y frecuencias
        foreach ($this->notasPosicionOfensivaUltimos2Meses as $nota) {
            $mejores_notas[$nota['nombre_jugador']] = (float) $nota['promedio'];
            $frecuencia_entrenamientos[$nota['nombre_jugador']] = (float) $nota['frecuencia'];
        }

        foreach ($this->notasWellnesOfensivaUltimos2Meses as $nota) {
            $mejores_test[$nota['nombre_jugador']] = (float) $nota['promedio'];
        }

        // Ordenar ambos arrays de mayor a menor según las notas
        arsort($mejores_notas);
        arsort($mejores_test);

        // Tomar los 6 mejores jugadores de cada arreglo
        $top_mejores_notas = array_slice($mejores_notas, 0, 6, true);
        $top_mejores_test = array_slice($mejores_test, 0, 6, true);

        // Buscar los jugadores que están en ambos arreglos
        $jugadores_repetidos = array_intersect_key($top_mejores_notas, $top_mejores_test);

        // Calcular el puntaje ponderado para cada jugador repetido
        foreach ($jugadores_repetidos as $nombre_jugador => $nota) {
            $nota_ofensiva = $top_mejores_notas[$nombre_jugador] ?? 0;
            $nota_test = $top_mejores_test[$nombre_jugador] ?? 0;
            $frecuencia = $frecuencia_entrenamientos[$nombre_jugador] ?? 0;

            // Calcular el puntaje final ponderado: 40% nota ofensiva, 30% frecuencia, 30% nota test
            $jugadores_repetidos[$nombre_jugador] = (
                ($nota_ofensiva * 0.40) +
                ($frecuencia * 0.30) +
                ($nota_test * 0.30)
            );
        }

        // Ordenar a los jugadores repetidos por su puntaje ponderado (de mayor a menor)
        arsort($jugadores_repetidos);

        // Devolver los 3 mejores jugadores
        return array_slice($jugadores_repetidos, 0, 4, true);
    }

    public function mejoresPropuestas()
    {
        $notas_posicion = []; // Jugadores con sus notas en posiciones
        $notas_wellness = []; // Jugadores con sus notas de bienestar (motivación)
        $frecuencia_entrenamientos = []; // Jugadores con su frecuencia de asistencias
        $jugadores_desmotivados = []; // Jugadores que aparecerán en ambas listas (repetidos)

        // Obtener las notas de los últimos 2 meses de las posiciones (no necesariamente ofensivas)
        $this->NotasPosicionUltimos2Meses();
        $this->NotasTestWellnesUltimos2Meses(); // Obtener las notas de bienestar (motivación)

        // Crear arrays con los nombres de los jugadores y sus respectivas notas y frecuencias
        foreach ($this->notasPosicionUltimos2Meses as $nota) {
            $notas_posicion[$nota['nombre_jugador']] = (float) $nota['promedio'];
            $frecuencia_entrenamientos[$nota['nombre_jugador']] = (float) $nota['frecuencia'];
        }

        foreach ($this->notasWellnesUltimos2Meses as $nota) {
            $notas_wellness[$nota['nombre_jugador']] = (float) $nota['promedio'];
        }

        // Ordenar las notas de posiciones de mayor a menor
        arsort($notas_posicion);

        // Las notas de bienestar ya están de menor a mayor, así que no es necesario ordenar

        // Tomar los 6 mejores jugadores en posiciones y los 6 con menor motivación
        $top_jugadores_posicion = array_slice($notas_posicion, 0, 6, true);
        $jugadores_desmotivados = array_slice($notas_wellness, 0, 6, true); // Tomar los 6 con menor nota

        // Inversión de las notas de bienestar (mientras más baja la nota, mayor será el peso)
        $nota_maxima_wellness = max($jugadores_desmotivados);
        foreach ($jugadores_desmotivados as $nombre_jugador => $nota_wellness) {
            $jugadores_desmotivados[$nombre_jugador] = $nota_maxima_wellness - $nota_wellness;
        }

        // Buscar los jugadores que están en ambos arreglos (jugadores que no son ofensivos y están desmotivados)
        $jugadores_recomendados = array_intersect_key($top_jugadores_posicion, $jugadores_desmotivados);

        // Calcular el puntaje ponderado para cada jugador desmotivado
        foreach ($jugadores_recomendados as $nombre_jugador => $nota) {
            $nota_posicion = $top_jugadores_posicion[$nombre_jugador] ?? 0;
            $nota_invertida_wellness = $jugadores_desmotivados[$nombre_jugador] ?? 0;
            $frecuencia = $frecuencia_entrenamientos[$nombre_jugador] ?? 0;

            // Calcular el puntaje final ponderado: 30% nota de posición, 30% frecuencia, 40% bienestar invertido
            $jugadores_recomendados[$nombre_jugador] = (
                ($nota_posicion * 0.30) +
                ($frecuencia * 0.30) +
                ($nota_invertida_wellness * 0.40)
            );
        }

        // Ordenar a los jugadores recomendados por su puntaje ponderado (de mayor a menor)
        arsort($jugadores_recomendados);

        // Devolver los 3 mejores jugadores recomendados
        return array_slice($jugadores_recomendados, 0, 3, true);
    }


    //Función para leer los partidos por el idEquipo


    public function searchRowsByIdJugador()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = "SELECT * FROM vista_detalle_partidos_jugadores WHERE id_jugador = ? AND (nombre_equipo LIKE ? OR nombre_rival LIKE ? OR fecha LIKE ?) ORDER BY fecha DESC ;";
        $params = array($_SESSION['idJugador'], $value, $value, $value);
        return Database::getRows($sql, $params);
    }

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
        $mejoresPropuesta = $this->mejoresPropuestas();
        $nombresDelanteros = implode(', ', array_keys($mejoresDelanteros));
        // Filtrar nombres de propuestas que no están en delanteros
        $nombresNoEnDelanteros = implode(', ', array_keys(array_diff_key($mejoresPropuesta, $mejoresDelanteros)));

        $mensaje1 = "Bajo la frecuencia de entrenamientos de este mes y las áreas reforzadas, los resultados en enfrentamientos de tu equipo y del rival, se predice el resultado de este partido:\n";
        $mensaje2 = "[Logo equipo 1] {$prediccionEquipo} - {$prediccionRival} [logo rival]\n";
        $mensaje3 = "Reforzar el área de {$subtemaMenor} y hacer un partido estratégico; Toma en cuenta que en este partido tu area más fuerte será {$subtemaMayor}, ¡Así que potencialo!.\n \nSe espera que en la ofensiva los titulares de este partido sean: {$nombresDelanteros}. Se considera que a estos jugadores les vendría bien que los tomen en cuenta para el partido {$nombresNoEnDelanteros}.";

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
