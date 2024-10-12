<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class testHandler
{

    //Declaracion de variables aqui
    protected $idTest = null;
    protected $idJugador = null;
    protected $pregunta = null;
    protected $respuesta = null;
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para insertar una respuesta de test.
    public function createRow()
    {
        $sql = 'INSERT INTO respuesta_test(pregunta, respuesta, id_test) VALUES (?,?,?);';
        $params = array(
            $this->pregunta,
            $this->respuesta,
            $this->idTest
        );

        return Database::executeRow($sql, $params);
    }

    //Función para actualizar de que el test fue contestado
    public function updateRow()
    {

        // Aquí actualizamos el estado del test a contestado.
        $sql = 'UPDATE test SET contestado = 1 WHERE id_test = ?;';
        $params = array($this->idTest);

        return Database::executeRow($sql, $params);
    }

    //Función para leer los últimos 60 registro fisico de un jugador.
    public function readAll()
    {
        $sql = 'SELECT 
                r.pregunta, 
                r.respuesta, 
                t.fecha, 
                t.id_jugador
            FROM 
                respuesta_test r
            INNER JOIN 
                test t ON r.id_test = t.id_test
            WHERE 
                t.id_jugador = ?
            ORDER BY 
                t.fecha DESC
            LIMIT 60;';
        $params = array($this->idJugador);
        return Database::getRows($sql, $params);
    }

    //Función para saber si el jugador tiene test sin contestar. dejamos el id del partido para saber si es el test del partido.
    public function testSinContestar()
    {
        $sql = 'SELECT id_test, id_partido 
        FROM test
        ORDER BY fecha DESC 
        WHERE id_jugador = ? 
        AND fecha IN (DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY))
        AND contestado = 0
        LIMIT 1;
        ';

        $params = array($this->idJugador);
        return Database::getRow($sql, $params);
    }
    
    public function testSinContestarMovil()
    {
        $sql ='SELECT
        id_test,
        id_jugador,
        fecha,
        contestado,
        CASE
        WHEN id_partido IS NOT NULL THEN CONCAT("Test físico ", DATE_FORMAT(fecha, "%d de %M de %Y"), " post partido")
        WHEN id_entrenamiento IS NOT NULL THEN CONCAT("Test físico ", DATE_FORMAT(fecha, "%d de %M de %Y"), " post entrenamiento")
        ELSE "Test físico (fecha desconocida)"
        END AS nombre_test
        FROM test
        WHERE id_jugador = ?
        AND contestado = 0;';
        $params = array($_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }
}