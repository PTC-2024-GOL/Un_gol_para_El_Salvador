<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla plantillas.
 */
class EquiposHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombreEquipo = null;
    protected $generoEquipo = null;
    protected $telefonoEquipo = null;
    protected $idCuerpoTecnico = null;
    protected $idCategoria = null;
    protected $logoEquipo = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/equipos/';

    /*
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */


    //Función para buscar un equipo.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_equipos
        WHERE NOMBRE LIKE ? OR vista_equipos.nombre_categoria LIKE ?
        ORDER BY nombre_categoria ASC ;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para mostrar todos los equipos
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_equipos ORDER BY nombre_categoria ASC ;';
        return Database::getRows($sql);
    }

    //Funcion para mostrar el cuerpo tecnico de un equipo
    public function readAllStaff()
    {
        $sql = 'SELECT * FROM vista_tecnicos_equipos
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    //Funcion para mostrar todos los equipos por genero
    public function readAllByGender()
    {
        $sql = 'SELECT * FROM vista_equipos
                WHERE genero_equipo = ? ORDER BY nombre_categoria ASC';
        $params = array($this->generoEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un equipo.
    public function createRow()
    {
        $sql = 'INSERT INTO equipos(nombre_equipo, genero_equipo, telefono_contacto, id_cuerpo_tecnico, id_categoria, logo_equipo) VALUE (?,?,?,?,?,?)';
        $params = array(
            $this->nombreEquipo,
            $this->generoEquipo,
            $this->telefonoEquipo,
            $this->idCuerpoTecnico,
            $this->idCategoria,
            $this->logoEquipo
        );
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar un equipo
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_equipos
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un equipo.
    public function updateRow()
    {
        $sql = 'UPDATE equipos
        SET nombre_equipo = ?, genero_equipo = ?, telefono_contacto = ?, id_cuerpo_tecnico = ?, id_categoria = ?, logo_equipo = ?
        WHERE id_equipo = ?';
        $params = array(
            $this->nombreEquipo,
            $this->generoEquipo,
            $this->telefonoEquipo,
            $this->idCuerpoTecnico,
            $this->idCategoria,
            $this->logoEquipo,
            $this->id
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una equipo.
    public function deleteRow()
    {
        $sql = 'DELETE FROM equipos WHERE id_equipo = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT logo_equipo
                FROM vista_equipos
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /// TECNICOS ////////////////////////////////////////////
    public function readAllByIdTecnico()
    {
        $sql = 'SELECT * FROM vista_equipos_tecnicos WHERE id_tecnico = ? ORDER BY nombre_categoria ASC;';
        $params = array($_SESSION['idTecnico']);
        return Database::getRows($sql, $params);
    }

    //Funcion para mostrar todos los equipos por genero
    public function readAllByGenderTecnicos()
    {
        $sql = 'SELECT * FROM vista_equipos_tecnicos
                WHERE id_tecnico =? AND  genero_equipo = ? ORDER BY nombre_categoria ASC';
        $params = array($_SESSION['idTecnico'], $this->generoEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para buscar un equipo.
    public function searchRowsTecnicos()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_equipos_tecnicos
        WHERE id_tecnico =? AND nombre_equipo LIKE ?
        ORDER BY nombre_categoria ASC ;';
        $params = array($_SESSION['idTecnico'], $value);
        return Database::getRows($sql, $params);
    }

    //FUNCIONES PARA GRAFICAS
    public function countTeamsByCategory()
    {
        $sql = 'SELECT COUNT(ID) AS total, vista_equipos.nombre_categoria FROM vista_equipos WHERE id_categoria = ?';
        $params = array($this->idCategoria);
        return Database::getRows($sql,$params);
    }

    public function readAllEquipos()
    {
        $sql = 'SELECT NOMBRE, ID, nombre_categoria, logo_equipo FROM vista_equipos;';
        return Database::getRows($sql);
    }

}
