<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class PosicionesHandler{

    //Declaracion de variables aqui
    protected $idPosicion = null;

    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para leer todas las posiciones.
    public function readAll()
    {
        $sql = 'SELECT * FROM posiciones
        ORDER BY posicion;';
        return Database::getRows($sql);
    }
}

