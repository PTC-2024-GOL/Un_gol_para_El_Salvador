<?php
// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Subcontenido.
 */
class EstadoFisicoJugadorHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $idJugador = null;
    protected $altura = null;
    protected $peso = null;
    protected $imc = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     * CREATE TABLE estados_fisicos_jugadores(
  id_estado_fisico_jugador INT AUTO_INCREMENT PRIMARY KEY,
  id_jugador INT NOT NULL, 
  CONSTRAINT fk_estado_fisico_jugador FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador),
  altura_jugador DECIMAL(4, 2) UNSIGNED NOT NULL,
  peso_jugador DECIMAL(5, 2) UNSIGNED NOT NULL,
  indice_masa_corporal DECIMAL(5, 2) UNSIGNED NULL
);
     */

    //Función para buscar un Estado fisico o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = "SELECT 
                id_estado_fisico_jugador,
                id_jugador,
                altura_jugador,
                peso_jugador,
                indice_masa_corporal,
                fecha_creacion,
                DATE_FORMAT(fecha_creacion, '%d de %M de %Y') AS fecha_creacion_format
                FROM estados_fisicos_jugadores
                WHERE fecha_creacion_format LIKE ?
                ORDER BY fecha_creacion DESC;";
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un estado fisico. 

    public function createRow()
    {
        // Calcular el IMC
        $this->imc = ($this->peso * 0.45359237) / (($this->altura / 100) * ($this->altura / 100));
        $sql = 'INSERT INTO estados_fisicos_jugadores (id_jugador, altura_jugador, peso_jugador, indice_masa_corporal) VALUES(?, ?, ?, ?);';
        $params = array(
            $this->idJugador,
            $this->altura,
            $this->peso,
            $this->imc
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las un Subcontenido o varios. 
    public function readAll()
    {
        $sql = "SELECT 
        e.id_estado_fisico_jugador,
        e.id_jugador,
        e.altura_jugador,
        e.peso_jugador,
        e.indice_masa_corporal,
        e.fecha_creacion,
        CONCAT(j.nombre_jugador, ' ', j.apellido_jugador) AS nombre_jugador,
        DATE_FORMAT(e.fecha_creacion, '%d de %M de %Y') AS fecha_creacion_format
        FROM estados_fisicos_jugadores e
        INNER JOIN
        jugadores j ON j.id_jugador = e.id_jugador
        WHERE e.id_jugador = ?;";
        $params = array($this->idJugador);
        return Database::getRows($sql, $params);
    }

    //Función para leer un Subcontenido o varios. 

    public function readOne()
    {
        $sql = "SELECT 
                id_estado_fisico_jugador,
                id_jugador,
                altura_jugador,
                peso_jugador,
                indice_masa_corporal,
                fecha_creacion,
                DATE_FORMAT(fecha_creacion, '%d de %M de %Y') AS fecha_creacion_format
                FROM estados_fisicos_jugadores WHERE id_estado_fisico_jugador = ?;";
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar un Subcontenido o varios. 

    public function updateRow()
    {
        $this->imc = ($this->peso * 0.45359237) / (($this->altura / 100) * ($this->altura / 100));
        $sql = 'UPDATE estados_fisicos_jugadores SET peso_jugador = ?, altura_jugador = ?, indice_masa_corporal = ?, id_jugador = ? WHERE id_estado_fisico_jugador = ?;';
        $params = array(
            $this->peso,
            $this->altura,
            $this->imc,
            $this->idJugador,
            $this->id
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un Subcontenido o varios. 

    public function deleteRow()
    {
        $sql = 'DELETE FROM estados_fisicos_jugadores WHERE id_estado_fisico_jugador = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
