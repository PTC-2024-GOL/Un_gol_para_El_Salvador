<?php


// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class CategoriasHandler
{

    protected $idCategoria = null;
    protected $nombreCategoria = null;
    protected $edadMinima = null;
    protected $edadMaxima = null;

    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para buscar una categoría.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_categorias
        WHERE nombre_categoria LIKE ?
        ORDER BY nombre_categoria;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function searchRowsTechnics()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT DISTINCT
            c.id_categoria,
            c.nombre_categoria,
            c.edad_minima_permitida,
            c.edad_maxima_permitida
        FROM
            categorias c
        INNER JOIN
            equipos e ON c.id_categoria = e.id_categoria
        INNER JOIN
            cuerpos_tecnicos ct ON e.id_cuerpo_tecnico = ct.id_cuerpo_tecnico
        INNER JOIN
            detalles_cuerpos_tecnicos dct ON ct.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
        WHERE
            dct.id_tecnico = ? AND c.nombre_categoria LIKE ?
        ORDER BY
            c.nombre_categoria;';
        $params = array($_SESSION['idTecnico'], $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una categoría.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_categoria(?,?,?);';
        $params = array(
            $this->nombreCategoria,
            $this->edadMinima,
            $this->edadMaxima
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las categorías.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_categorias
        ORDER BY nombre_categoria DESC;';
        return Database::getRows($sql);
    }

    public function readAllTechnics()
    {
        $sql = 'SELECT DISTINCT
            c.id_categoria,
            c.nombre_categoria,
            c.edad_minima_permitida,
            c.edad_maxima_permitida
        FROM
            categorias c
        INNER JOIN
            equipos e ON c.id_categoria = e.id_categoria
        INNER JOIN
            cuerpos_tecnicos ct ON e.id_cuerpo_tecnico = ct.id_cuerpo_tecnico
        INNER JOIN
            detalles_cuerpos_tecnicos dct ON ct.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
        WHERE
            dct.id_tecnico = ?
        ORDER BY
            c.nombre_categoria;';
        $params = array($_SESSION['idTecnico']);
        return Database::getRows($sql, $params);
    }
 

    //Función para leer una categoría.
    public function readOne()
    {
        $sql = 'SELECT * FROM categorias
        WHERE id_categoria LIKE ?';
        $params = array($this->idCategoria);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar una categoría.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_categoria(?,?,?,?);';
        $params = array(
            $this->idCategoria,
            $this->nombreCategoria,
            $this->edadMinima,
            $this->edadMaxima,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una categoría.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_categoria(?);';
        $params = array($this->idCategoria);
        return Database::executeRow($sql, $params);
    }
}