<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class RegistrosHandler{

    //Declaracion de variables aqui
    protected $idRegistroMedico = null;
    protected $jugador = null;
    protected $fechaLesion = null;
    protected $fechaRegistro = null;
    protected $diasLesionado = null;
    protected $lesion = null;
    protected $retornoEntreno = null;
    protected $retornoPartido = null;

    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para buscar un registro médico.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_registros_medicos
        WHERE nombre_completo_jugador LIKE ?
        ORDER BY nombre_completo_jugador;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un registro médico.
    public function createRow()
    {
        if ($this->retornoPartido == '' or $this->retornoEntreno == ''){
            $this->retornoPartido = NULL;
            $this->retornoEntreno = NULL;
        }

        $sql = 'CALL sp_insertar_registro_medico(?,?,?,?,?,?);';
        $params = array(
            $this->jugador,
            $this->fechaLesion,
            $this->diasLesionado,
            $this->lesion,
            $this->retornoEntreno,
            $this->retornoPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas los registros médicos.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_registros_medicos
        ORDER BY nombre_completo_jugador;';
        return Database::getRows($sql);
    }

    //Función para leer un registro médico.
    public function readOne()
    {
        $sql = 'SELECT * FROM registros_medicos
        WHERE id_registro_medico LIKE ?';
        $params = array($this->idRegistroMedico);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un registro médico.
    public function updateRow()
    {
        if ($this->retornoPartido == '' or $this->retornoEntreno == ''){
            $this->retornoPartido = NULL;
            $this->retornoEntreno = NULL;
        }

        $sql = 'CALL sp_actualizar_registro_medico(?,?,?,?,?,?,?);';
        $params = array(
            $this->idRegistroMedico,
            $this->jugador,
            $this->fechaLesion,
            $this->diasLesionado,
            $this->lesion,
            $this->retornoEntreno,
            $this->retornoPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un registro médico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_registro_medico(?);';
        $params = array($this->idRegistroMedico);
        return Database::executeRow($sql, $params);
    }

}

