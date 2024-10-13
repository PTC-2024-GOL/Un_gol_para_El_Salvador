<?php

use Phpml\Regression\LeastSquares;
use Phpml\Regression\MLPRegressor;
use Phpml\Classification\MLPClassifier;
use Phpml\NeuralNetwork\Network\MultilayerPerceptron;
use Phpml\NeuralNetwork\ActivationFunction\Sigmoid;
use Phpml\Classification\KNearestNeighbors;

require('C:/xampp/htdocs/sitio_gol_sv/vendor/autoload.php');
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla características jugadores.
 */
class CaracteristicasAnalisisHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nota = null;
    protected $caracteristica = null;
    protected $jugador = null;
    protected $entrenamiento = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar una característica o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT IDJ ,JUGADOR, 
        ROUND(AVG(NOTA), 2) AS PROMEDIO 
        FROM vista_caracteristicas_analisis 
        WHERE IDE = ? AND JUGADOR LIKE ?
        GROUP BY IDJ, JUGADOR;';
        $params = array($this->entrenamiento, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una característica.
    public function createRow()
    {
        $sql = 'CALL insertarCaracteristicasYDetallesRemodelado(?,?,?,?);';
        $params = array(
            $this->jugador,
            $this->entrenamiento,
            $this->caracteristica,
            $this->nota
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las característica.
    public function readAll()
    {
        $sql = 'SELECT IDJ ,JUGADOR, 
        ROUND(AVG(NOTA), 2) AS PROMEDIO 
        FROM vista_caracteristicas_analisis
        WHERE IDE = ? GROUP BY IDJ, JUGADOR;';
        $params = array($this->entrenamiento);
        return Database::getRows($sql, $params);
    }

    //Función para leer una característica.
    public function readOne()
    {
        $sql = 'SELECT JUGADOR, CARACTERISTICA, ROUND(NOTA, 1) AS NOTA, IDC FROM vista_caracteristicas_analisis 
                WHERE IDE = ? AND IDJ = ?;';
        $params = array($this->entrenamiento, $this->jugador);
        return Database::getRows($sql, $params);
    }

    //Función para leer una característica.
    public function readOnePlayers()
    {
        $sql = 'SELECT JUGADOR, CARACTERISTICA, ROUND(NOTA, 1) AS NOTA, IDC FROM vista_caracteristicas_analisis 
                WHERE IDE = ? AND IDJ = ?;';
        $params = array($this->entrenamiento, $_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }

    //Función para la gráfica de una característica.
    public function graphic()
    {
        $sql = 'SELECT CARACTERISTICA, NOTA FROM vista_caracteristicas_analisis 
                WHERE IDE = ? AND IDJ = ? AND CARACTERISTICA IS NOT NULL;';
        $params = array($this->entrenamiento, $this->jugador);
        return Database::getRows($sql, $params);
    }


    //Función para la gráfica de una característica.
    public function graphicPromedyByJourney()
    {
        $sql = 'SELECT
        j.id_jugador AS IDJ,
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS JUGADOR,
        cj.id_caracteristica_jugador AS IDC,
        cj.nombre_caracteristica_jugador AS CARACTERISTICA,
        CONCAT(DATE_FORMAT(e.fecha_entrenamiento, "%e de %M del %Y"), " - ", e.sesion) AS FECHA,
        CONCAT(DATE_FORMAT(e.fecha_entrenamiento, "%e de %M del %Y")) AS FECHAS,
        e.sesion AS SESION,
        cj.clasificacion_caracteristica_jugador AS TIPO,
        ROUND(AVG(CASE 
            WHEN ca.nota_caracteristica_analisis IS NULL THEN 0
            ELSE ca.nota_caracteristica_analisis
        END), 2) AS PROMEDIO
        FROM 
        jugadores j
        LEFT JOIN 
        asistencias a ON j.id_jugador = a.id_jugador
        LEFT JOIN 
        caracteristicas_analisis ca ON j.id_jugador = ca.id_jugador AND a.id_entrenamiento = ca.id_entrenamiento
        LEFT JOIN 
        caracteristicas_jugadores cj ON ca.id_caracteristica_jugador = cj.id_caracteristica_jugador
        LEFT JOIN 
        entrenamientos e ON e.id_entrenamiento = ca.id_entrenamiento
        LEFT JOIN 
        jornadas jn ON jn.id_jornada = e.id_jornada
        WHERE 
        a.asistencia = "Asistencia" 
        AND e.fecha_entrenamiento = (SELECT fecha_entrenamiento FROM entrenamientos WHERE id_entrenamiento = ?) 
        AND a.id_jugador = ?
        GROUP BY 
        e.fecha_entrenamiento, e.sesion LIMIT 3;';
        $params = array($this->entrenamiento, $this->jugador);
        return Database::getRows($sql, $params);
    }

    //Función para actualizar una característica.
    public function updateRow()
    {
        $sql = 'CALL actualizar_analisis_caracteristica_jugador(?,?,?);';
        $params = array(
            $this->id,
            $this->nota,
            $this->caracteristica,
            $this->jugador,
        );
        return Database::executeRow($sql, $params);
    }

    // Función para predecir las notas de las siguientes sesiones
    public function predictNextSessionScores()
    {
        // Configurar la localización en español
        setlocale(LC_TIME, 'es_ES.UTF-8');

        // Mapa de traducción de meses
        $monthNames = [
            1 => 'enero',
            2 => 'febrero',
            3 => 'marzo',
            4 => 'abril',
            5 => 'mayo',
            6 => 'junio',
            7 => 'julio',
            8 => 'agosto',
            9 => 'septiembre',
            10 => 'octubre',
            11 => 'noviembre',
            12 => 'diciembre'
        ];
        // Consulta para obtener las notas, fechas de entrenamiento y nombres de características analizadas para el jugador específico
        $sql = 'SELECT ca.nota_caracteristica_analisis AS NOTA, 
                e.fecha_entrenamiento AS FECHA, 
                cj.nombre_caracteristica_jugador AS CARACTERISTICA,
                CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS JUGADOR
                FROM caracteristicas_analisis ca
                INNER JOIN jugadores j ON j.id_jugador = ca.id_jugador
                INNER JOIN entrenamientos e ON ca.id_entrenamiento = e.id_entrenamiento
                INNER JOIN caracteristicas_jugadores cj ON ca.id_caracteristica_jugador = cj.id_caracteristica_jugador
                WHERE ca.id_jugador = ?
                AND e.fecha_entrenamiento >= DATE_SUB(CURDATE(), INTERVAL 2 WEEK)
                ORDER BY e.fecha_entrenamiento ASC;';
        $params = array($this->jugador);
        $rows = Database::getRows($sql, $params);

        if (empty($rows)) {
            return [];
        }

        // Obtener el nombre del jugador (todos los registros tienen el mismo nombre)
        $jugador = $rows[0]['JUGADOR'];

        // Agrupar los datos por características
        $groupedData = [];
        foreach ($rows as $row) {
            $characteristic = $row['CARACTERISTICA'];
            $date = new DateTime($row['FECHA']);
            $timestamp = $date->getTimestamp();

            if (!isset($groupedData[$characteristic])) {
                $groupedData[$characteristic] = ['dates' => [], 'scores' => []];
            }
            $groupedData[$characteristic]['dates'][] = $timestamp;
            $groupedData[$characteristic]['scores'][] = $row['NOTA'];
        }

        $predictions = [];
        // Calcular la regresión para cada característica
        foreach ($groupedData as $characteristic => $data) {
            $dates = $data['dates'];
            $scores = $data['scores'];

            // Calcular la regresión para predecir la notas en los próximos entrenamientos de la semana siguiente
            for ($i = 1; $i <= 7; $i++) {
                $X = array_slice($dates, 0, count($dates));
                $y = array_slice($scores, 0, count($scores));

                if (count($X) <= 1 || count(array_unique($X)) == 1) {
                    throw new Exception("Datos insuficientes o colineales para la regresión.");
                }

                // Crear el modelo de regresión lineal
                $regression = new LeastSquares();
                $regression->train(array_map(function ($timestamp) {
                    return [$timestamp];
                }, $X), $y);

                // Predecir la nota para la próxima sesión
                $timestamp = end($dates) + $i * 24 * 60 * 60;
                $predictedScore = $regression->predict([$timestamp]);

                // Asegurarse de que la nota no supere 10
                $predictedScore = max(0, min($predictedScore, 10));

                // Convertir timestamp a fecha en español
                $dateTime = new DateTime();
                $dateTime->setTimestamp($timestamp);
                $day = $dateTime->format('d');
                $month = (int) $dateTime->format('m');
                $year = $dateTime->format('Y');
                $monthName = $monthNames[$month];

                $date = "$day de $monthName de $year";

                $predictions[] = [
                    'fecha' => $date,
                    'caracteristica' => $characteristic,
                    'nota' => $predictedScore,
                    'jugador' => $jugador
                ];
            }
        }

        return $predictions;
    }

    // Función para predecir los promedios de las siguientes sesiones de entrenamiento
    public function predictAverageScoresNextWeek()
    {
        // Configurar la localización en español
        setlocale(LC_TIME, 'es_ES.UTF-8');

        // Mapa de traducción de meses
        $monthNames = [
            1 => 'enero',
            2 => 'febrero',
            3 => 'marzo',
            4 => 'abril',
            5 => 'mayo',
            6 => 'junio',
            7 => 'julio',
            8 => 'agosto',
            9 => 'septiembre',
            10 => 'octubre',
            11 => 'noviembre',
            12 => 'diciembre'
        ];

        // Consulta para obtener el promedio de las notas del jugador en cada sesión de entrenamiento
        $sql = 'SELECT JUGADOR, 
                   ROUND(AVG(NOTA), 2) AS PROMEDIO,
                   FECHA
            FROM vista_predictiva_progresion
            WHERE IDJ = ? AND FECHA >= DATE_SUB(CURDATE(), INTERVAL 2 WEEK)
            GROUP BY IDE, JUGADOR
            ORDER BY FECHA ASC;';
        $params = array($this->jugador);
        $rows = Database::getRows($sql, $params);

        if (empty($rows)) {
            return [];
        }

        // Extraer fechas y promedios para la regresión
        $dates = [];
        $averages = [];

        foreach ($rows as $row) {
            $date = new DateTime($row['FECHA']);
            $timestamp = $date->getTimestamp();
            $dates[] = $timestamp;
            $averages[] = $row['PROMEDIO'];
        }

        $predictions = [];
        // Calcular la regresión para predecir el promedio en los próximos entrenamientos de la semana siguiente
        for ($i = 1; $i <= 7; $i++) {
            $X = array_slice($dates, 0, count($dates) - ($i - 1));
            $y = array_slice($averages, 0, count($averages) - ($i - 1));

            if (count($X) <= 1 || count(array_unique($X)) == 1) {
                throw new Exception("Datos insuficientes o colineales para la regresión.");
            }

            // Crear el modelo de regresión lineal
            $regression = new LeastSquares();
            $regression->train(array_map(function ($timestamp) {
                return [$timestamp];
            }, $X), $y);

            // Predecir el promedio para la próxima sesión
            $timestamp = end($dates) + $i * 24 * 60 * 60;
            $predictedAverage = $regression->predict([$timestamp]);

            // Asegurarse de que la nota no supere 10 ni sea menor a 0
            $predictedAverage = max(0, min($predictedAverage, 10));

            // Convertir timestamp a fecha en español
            $dateTime = new DateTime();
            $dateTime->setTimestamp($timestamp);
            $day = $dateTime->format('d');
            $month = (int) $dateTime->format('m');
            $year = $dateTime->format('Y');
            $monthName = $monthNames[$month];

            $date = "$day de $monthName de $year";

            $predictions[] = [
                'fecha' => $date,
                'promedio' => $predictedAverage
            ];
        }

        return $predictions;
    }

    //Predecir probabilidad de convocatoria

    public function predecir($nuevosDatos)
    {
        // Obtener los datos de entrenamiento desde la base de datos
        $datosEntrenamiento = $this->obtenerDatosEntrenamientoJugadores();

        if (count($datosEntrenamiento['datos']) == 0 || count($datosEntrenamiento['etiquetas']) == 0) {
            throw new Exception('No hay suficientes datos históricos para entrenar el modelo.');
        }

        // Crear el modelo KNN
        $classifier = new KNearestNeighbors();

        // Entrenar el modelo con los datos de la base de datos
        $classifier->train($datosEntrenamiento['datos'], $datosEntrenamiento['etiquetas']);

        // Realizar la predicción con los datos obtenidos de las funciones
        return $classifier->predict($nuevosDatos);
    }

    // Función para obtener los datos de entrenamiento de otros jugadores
    public function obtenerDatosEntrenamientoJugadores()
    {
        // Consulta que obtiene los datos de jugadores anteriores junto con la etiqueta si fueron convocados
        $sql = 'SELECT 
                    ROUND(AVG(vpp.nota), 2) AS promedio_notas,
                    ROUND(SUM(CASE WHEN a.asistencia = "Asistencia" THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id_entrenamiento), 2) AS porcentaje_asistencia,
                    ROUND(AVG(pp.puntuacion), 2) AS promedio_puntuacion,
                    (COUNT(DISTINCT cp.id_partido) / (SELECT COUNT(DISTINCT p.id_partido) 
                    FROM partidos p 
                    WHERE p.id_equipo IN (SELECT pe.id_equipo FROM plantillas_equipos pe WHERE pe.id_jugador = j.id_jugador))) * 100 AS porcentaje_convocado,
                    CASE WHEN COUNT(DISTINCT cp.id_partido) > 0 THEN 1 ELSE 0 END AS convocado
                FROM jugadores j
                LEFT JOIN asistencias a ON j.id_jugador = a.id_jugador
                LEFT JOIN entrenamientos e ON a.id_entrenamiento = e.id_entrenamiento
                LEFT JOIN participaciones_partidos pp ON j.id_jugador = pp.id_jugador
                LEFT JOIN partidos p ON p.id_partido = pp.id_partido
                LEFT JOIN convocatorias_partidos cp ON j.id_jugador = cp.id_jugador AND cp.estado_convocado = 1
                LEFT JOIN vista_predictiva_progresion vpp ON vpp.IDJ = j.id_jugador
                WHERE e.fecha_entrenamiento >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) 
                OR p.fecha_partido >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
                GROUP BY j.id_jugador';

        // Ejecutar la consulta y obtener los datos
        $datosJugadores = Database::getRows($sql, []);

        $datos = [];
        $etiquetas = [];

        foreach ($datosJugadores as $jugador) {
            // Añadir características a los datos de entrenamiento
            $datos[] = [
                $jugador['promedio_notas'],
                $jugador['porcentaje_asistencia'],
                $jugador['promedio_puntuacion'],
                $jugador['porcentaje_convocado']
            ];

            // Añadir la etiqueta de si fue convocado o no
            $etiquetas[] = $jugador['convocado'];
        }

        return ['datos' => $datos, 'etiquetas' => $etiquetas];
    }

    // 1. Promedio de las notas del jugador en cada sesión de entrenamiento durante los ultimos 2 meses
    public function PromedioNotasDelJugador()
    {
        // Consulta para obtener el promedio de las notas del jugador en cada sesión de entrenamiento durante los ultimos 2 meses
        $sql = 'SELECT IDJ AS id ,JUGADOR, 
        ROUND(AVG(NOTA), 2) AS PROMEDIO, FECHA
        FROM vista_predictiva_progresion WHERE IDJ = ? AND FECHA >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
        GROUP BY IDE, JUGADOR
        ORDER BY FECHA ASC;';
        $params = array($this->jugador);
        return Database::getRows($sql, $params);
    }

    // 2. Porcentaje de asistencias que ha tenido el jugador durante los ultimos 2 meses
    public function PorcentajeAsistenciasDelJugador()
    {
        // Consulta para obtener el porcentaje de asistencias que ha tenido el jugador durante los ultimos 2 meses
        $sql = 'SELECT j.id_jugador AS id, CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS JUGADOR, 
        ROUND(SUM(CASE WHEN a.asistencia = "Asistencia" THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id_entrenamiento), 2) AS porcentaje_asistencia
        FROM jugadores j INNER JOIN asistencias a ON j.id_jugador = a.id_jugador
        INNER JOIN entrenamientos e ON a.id_entrenamiento = e.id_entrenamiento
        WHERE j.id_jugador = ? AND e.fecha_entrenamiento >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
        GROUP BY j.id_jugador;';
        $params = array($this->jugador);
        return Database::getRows($sql, $params);
    }

    // 3. Puntuación del jugador dureante los partidos de los ultimos 2 meses
    public function PromedioPuntajeDeJugador()
    {
        // Consulta para obtener el promedio de puntuación de participaciones que ha tenido el jugador durante los ultimos 2 meses
        $sql = 'SELECT pp.id_jugador AS id, p.fecha_partido AS FECHA, pp.puntuacion AS PUNTUACION
        FROM participaciones_partidos pp INNER JOIN partidos p ON p.id_partido = pp.id_partido
        WHERE pp.id_jugador = ? AND p.fecha_partido >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH);';
        $params = array($this->jugador);
        return Database::getRows($sql, $params);
    }


    // 4. Porcentaje de partidos convocados del jugador
    public function PorcentajePartidosConvocadosJugador()
    {
        // Consulta para obtener el promedio de puntuación de participaciones que ha tenido el jugador
        $sql = 'SELECT j.id_jugador, 
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS nombre_completo,
        COUNT(DISTINCT cp.id_partido) AS partidos_convocados,
        (SELECT COUNT(DISTINCT p.id_partido) 
        FROM partidos p 
        WHERE p.id_equipo IN (SELECT pe.id_equipo 
                           FROM plantillas_equipos pe 
                           WHERE pe.id_jugador = ?)) AS total_partidos,
        (COUNT(DISTINCT cp.id_partido) / 
        (SELECT COUNT(DISTINCT p.id_partido) 
        FROM partidos p 
        WHERE p.id_equipo IN (SELECT pe.id_equipo 
                            FROM plantillas_equipos pe 
                            WHERE pe.id_jugador = ?))) * 100 AS porcentaje_convocado
        FROM 
            jugadores j
        LEFT JOIN 
            convocatorias_partidos cp ON j.id_jugador = cp.id_jugador AND cp.estado_convocado = 1
        LEFT JOIN 
            partidos p ON cp.id_partido = p.id_partido
        WHERE 
            j.id_jugador = ?
        AND 
            p.id_equipo IN (SELECT pe.id_equipo FROM plantillas_equipos pe WHERE pe.id_jugador = ?)
        GROUP BY 
            j.id_jugador;';
        $params = array($this->jugador, $this->jugador, $this->jugador, $this->jugador);
        return Database::getRows($sql, $params);
    }
}
