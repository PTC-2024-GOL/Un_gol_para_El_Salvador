<?php

use Phpml\Regression\LeastSquares;

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
        $sql = 'SELECT JUGADOR, CARACTERISTICA, ROUND(NOTA, 0) AS NOTA, IDC FROM vista_caracteristicas_analisis 
                WHERE IDE = ? AND IDJ = ?;';
        $params = array($this->entrenamiento, $this->jugador);
        return Database::getRows($sql, $params);
    }

    //Función para la gráfica de una característica.
    public function graphic()
    {
        $sql = 'SELECT CARACTERISTICA, NOTA FROM vista_caracteristicas_analisis 
                WHERE IDE = ? AND IDJ = ?;';
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
        $sql = 'SELECT ca.nota_caracteristica_analisis AS NOTA, e.fecha_entrenamiento AS FECHA, cj.nombre_caracteristica_jugador AS CARACTERISTICA
                FROM caracteristicas_analisis ca
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
                    'nota' => $predictedScore
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
            WHERE IDJ = ?
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
}
