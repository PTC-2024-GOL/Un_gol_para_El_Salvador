<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class HorariosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $dia = null;
    protected $horaInicial = null;
    protected $horaFinal = null;
    protected $campoEntrenamiento = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un horario.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM horarios
        WHERE nombre_horario LIKE ? OR dia LIKE ?
        ORDER BY nombre_horario;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un horario.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_horario(?,?,?,?,?);';
        $params = array(
            $this->nombre,
            $this->dia,
            $this->horaInicial,
            $this->horaFinal,
            $this->campoEntrenamiento
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todos los horarios.
    public function readAll()
    {
        $sql = 'SELECT * FROM horarios
        ORDER BY nombre_horario;';
        return Database::getRows($sql);
    }

    //Función para leer un horario.
    public function readOne()
    {
        $sql = 'SELECT * FROM horarios
        WHERE id_horario LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar un horario.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_horario(?,?,?,?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->dia,
            $this->horaInicial,
            $this->horaFinal,
            $this->campoEntrenamiento
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un horario.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_horario(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
