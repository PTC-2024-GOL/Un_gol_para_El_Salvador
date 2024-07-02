<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class JornadasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $numero = null;
    protected $plantilla = null;
    protected $fechaInicio = null;
    protected $fechaFinal = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un cuerpo técnico o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vw_jornadas
        WHERE NOMBRE LIKE ? OR NUMERO LIKE ? OR PLANTILLA LIKE ? OR FECHA_INICIO LIKE ? OR FECHA_FIN LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value, $value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una cuerpo técnico.
    public function createRow()
    {
        $sql = 'CALL insertar_jornada(?,?,?,?,?);';
        $params = array(
            $this->nombre,
            $this->numero,
            $this->plantilla,
            $this->fechaInicio,
            $this->fechaFinal
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las cuerpo técnico.
    public function readAll()
    {
        $sql = 'SELECT * FROM vw_jornadas
        ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para leer una cuerpo técnico.
    public function readOne()
    {
        $sql = 'SELECT * FROM vw_jornadas
        WHERE ID LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una cuerpo técnico.
    public function updateRow()
    {
        $sql = 'CALL actualizar_jornada(?,?,?,?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->numero,
            $this->plantilla,
            $this->fechaInicio,
            $this->fechaFinal
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una cuerpo técnico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_jornada(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
