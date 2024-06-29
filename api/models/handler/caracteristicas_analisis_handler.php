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
        ORDER BY JUGADOR;';
        $params = array($this->entrenamiento ,$value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una característica.
    public function createRow()
    {
        $sql = 'CALL insertar_analisis_caracteristica_jugador(?,?);';
        $params = array(
            $this->nota,
            $this->caracteristica,
            $this->jugador,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las característica.
    public function readAll()
    {
        $sql = 'SELECT IDJ ,JUGADOR, 
        ROUND(AVG(NOTA), 2) AS PROMEDIO 
        FROM vista_caracteristicas_analisis WHERE IDE = ? GROUP BY JUGADOR;';
        $params = array($this->entrenamiento);
        return Database::getRows($sql, $params);
    }

    //Función para leer una característica.
    public function readOne()
    {
        $sql = 'SELECT JUGADOR, CARACTERISTICA, NOTA FROM vista_caracteristicas_analisis 
                WHERE IDE = ? AND IDJCA = ?
                GROUP BY JUGADOR;';
        $params = array($this->entrenamiento,$this->id);
        return Database::getRow($sql, $params);
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

    //Función para eliminar una característica.
    public function deleteRow()
    {
        $sql = 'CALL eliminar_analisis_caracteristica_jugador(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
