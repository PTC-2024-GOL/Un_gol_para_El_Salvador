<?php


// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class CategoriasHandler
{

    protected $idCategoria = null;


    //Función para leer todas las categorías -- Lo cree porque necesito llenar un combox.
    public function readAll()
    {
        $sql = 'SELECT * FROM categorias
        ORDER BY nombre_categoria DESC;';
        return Database::getRows($sql);
    }
}