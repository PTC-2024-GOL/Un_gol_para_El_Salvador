<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla características jugadores.
 */
class CaracteristicasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $clasificacion = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar una característica o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_caracteristicas_jugadores
        WHERE NOMBRE LIKE ?
        ORDER BY CLASIFICACION;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una característica.
    public function createRow()
    {
        $sql = 'CALL insertar_caracteristica_jugador(?,?);';
        $params = array(
            $this->nombre,
            $this->clasificacion
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las característica.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_caracteristicas_jugadores ORDER BY CLASIFICACION;';
        return Database::getRows($sql);
    }

    //Función para leer una característica.
    public function readOne()
    {
        $sql = 'SELECT id_caracteristica_jugador AS ID,
                nombre_caracteristica_jugador AS NOMBRE,
                clasificacion_caracteristica_jugador AS CLASIFICACION
                FROM caracteristicas_jugadores
                WHERE id_caracteristica_jugador LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una característica.
    public function updateRow()
    {
        $sql = 'CALL actualizar_caracteristica_jugador(?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->clasificacion
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una característica.
    public function deleteRow()
    {
        $sql = 'CALL eliminar_caracteristica_jugador(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
