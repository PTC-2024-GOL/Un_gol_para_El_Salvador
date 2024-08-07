<?php
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
        CASE 
        WHEN ca.nota_caracteristica_analisis IS NULL THEN 0
        ELSE ca.nota_caracteristica_analisis
        END AS NOTA,
        cj.id_caracteristica_jugador AS IDC,
        cj.nombre_caracteristica_jugador AS CARACTERISTICA,
        cj.clasificacion_caracteristica_jugador AS TIPO,
        COALESCE(ca.id_entrenamiento, a.id_entrenamiento) AS IDE,
        a.asistencia AS ASISTENCIA
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
	    WHERE a.asistencia = "Asistencia" AND jn.id_jornada =(SELECT id_jornada FROM entrenamientos WHERE id_entrenamiento = 7);';
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
}
