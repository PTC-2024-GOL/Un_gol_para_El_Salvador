<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla plantillas.
 */
class JugadoresHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $dorsalJ = null;
    protected $nombreJ = null;
    protected  $apellidoJ = null;
    protected $estatusJ = null;
    protected $nacimientoJ = null;
    protected $generoJ = null;
    protected $perfilJ = null;
    protected $becado = null;
    protected $posicionPrincipal = null;
    protected $posicionSecundaria = null;
    protected $claveJ = null;
    protected $fotoJ = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/jugadores/';


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un jugador.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_jugadores
        WHERE nombre_jugador LIKE ? OR apellido_jugador LIKE ?
        ORDER BY fecha_creacion;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un jugador.
    public function createRow()
    {
        $sql = 'CALL insertar_jugador (?,?,?,?,?,?,?,?,?,?,?,?)';
        $params = array(
            $this->dorsalJ,
            $this->nombreJ,
            $this->apellidoJ,
            $this->estatusJ,
            $this->nacimientoJ,
            $this->generoJ,
            $this->perfilJ,
            $this->becado,
            $this->posicionPrincipal,
            $this->posicionSecundaria,
            $this->claveJ,
            $this->fotoJ
        );
        return Database::executeRow($sql, $params);
    }


    //Función para mostrar todos los jugadores
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_jugadores ORDER BY fecha_creacion;';
        return Database::getRows($sql);
    }

    //Función para mostrar todos los jugadores filtrados por el genero
    public function readAllByGender()
    {
        $sql = 'SELECT * FROM vista_jugadores WHERE genero_jugador = ? ORDER BY fecha_creacion;';
        $params = array($this->generoJ);
        return Database::getRows($sql, $params);
    }


    //Función para mostrar uno de los jugadores
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_jugadores
                WHERE id_jugador= ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT foto_jugador
                FROM jugadores
                WHERE id_jugador = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar jugadores
    public function updateRow()
    {
        $sql = 'CALL actualizar_jugador (?,?,?,?,?,?,?,?,?,?,?,?)';
        $params = array(
            $this->id,
            $this->dorsalJ,
            $this->nombreJ,
            $this->apellidoJ,
            $this->estatusJ,
            $this->nacimientoJ,
            $this->generoJ,
            $this->perfilJ,
            $this->becado,
            $this->posicionPrincipal,
            $this->posicionSecundaria,
            $this->fotoJ,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una jugador.
    public function deleteRow()
    {
        $sql = 'DELETE FROM jugadores WHERE id_jugador = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

}
