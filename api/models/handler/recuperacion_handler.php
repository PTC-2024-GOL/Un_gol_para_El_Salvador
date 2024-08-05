<?php

// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');
// Se incluye la clase para enviar el correo.
require_once ('../../helpers/emailConnexion.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class RecuperacionHandler
{

    //Declaracion de variables aqui
    protected $idUsuario = null;
    protected $nivel = null;
    protected $fechaRegistro = null;
    protected $hash = null;
    protected $correo = null;
    protected $nombre = null;

    protected $contrasena = null;


    // Crea una funcion que consule la variable nivel y dependiendo de su valor, se mande a llamar readOne1, readOne2 o readOne3 y devuelva el resultado.
    public function readIdUsuario()
    {
        if ($this->nivel == 1) {
            return $this->readOne1();
        } elseif ($this->nivel == 2) {
            return $this->readOne2();
        } elseif ($this->nivel == 3) {
            return $this->readOne3();
        }
    }

    public function envioCorreo()
    {
        return Email::sendMail($this->idUsuario, $this->nivel, $this->hash, $this->correo, $this->nombre);
    }
    public function readHash()
    {
        if ($this->nivel == 1) {
            return $this->readHash1();
        } elseif ($this->nivel == 2) {
            return $this->readHash2();
        } elseif ($this->nivel == 3) {
            return $this->readHash3();
        }
    }
    public function updateHash()
    {
        if ($this->nivel == 1) {
            return $this->updateRow1();
        } elseif ($this->nivel == 2) {
            return $this->updateRow2();
        } elseif ($this->nivel == 3) {
            return $this->updateRow3();
        }
    }

    
    public function updatePassword()
    {
        $this->hash = '0000';
        if ($this->nivel == 1) {
            return $this->updatePassword1();
        } elseif ($this->nivel == 2) {
            return $this->updatePassword2();
        } elseif ($this->nivel == 3) {
            return $this->updatePassword3();
        }
    }

    //Función para crear el has
    public function createHash()
{   
    // Crea una variable que contenga un string aleatorio de 10 caracteres.
    $this->hash = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 10);
    // Crea una variable que contenga la variable hash y la variable fechaRegistro, separadas por un $.
    $this->hash = $this->hash . 'QQQ' . $this->fechaRegistro;
    return $this->hash;
} 

    //Función para leer id en base a su correo, versión admin.
    public function readOne1()
    {
        $sql = 'SELECT id_administrador, nombre_administrador FROM administradores
        WHERE correo_administrador = ?;';
        $params = array($this->correo);
        $this->idUsuario = Database::getRow($sql, $params);
        //id usuario contiene un arreglo con el nombre id_administrador, quiero que solo contenga el valor de id_administrador.
        $this->nombre = $this->idUsuario['nombre_administrador'];
        $this->idUsuario = $this->idUsuario['id_administrador'];
        return $this->idUsuario;
    }

    //Función para leer id en base a su correo, versión tecnico.
    public function readOne2()
    {
        $sql = 'SELECT id_tecnico, nombre_tecnico FROM tecnicos
            WHERE correo_tecnico = ?;';
        $params = array($this->correo);
        $this->idUsuario = Database::getRow($sql, $params);
        //id usuario contiene un arreglo con el nombre id_administrador, quiero que solo contenga el valor de id_administrador.
        $this->nombre = $this->idUsuario['nombre_tecnico'];
        $this->idUsuario = $this->idUsuario['id_tecnico'];
        return $this->idUsuario;
    }

    //Función para leer id en base a su correo, versión jugador.
    public function readOne3()
    {
        $sql = 'SELECT id_jugador, nombre_jugador FROM jugadores
        WHERE correo_jugador = ?;';
        $params = array($this->correo);
        $this->idUsuario = Database::getRow($sql, $params);
        //id usuario contiene un arreglo con el nombre id_administrador, quiero que solo contenga el valor de id_administrador.
        $this->nombre = $this->idUsuario['nombre_jugador'];
        $this->idUsuario = $this->idUsuario['id_jugador'];
        return $this->idUsuario;
    }
    //Función para actualizar el hash en la tabla administradores.
    public function updateRow1()
    {

        $sql = 'UPDATE administradores SET recovery_code = ? WHERE id_administrador = ?;';
        $params = array(
            $this->hash,
            $this->idUsuario
        );
        return Database::executeRow($sql, $params);
    }

    //Función para actualizar el hash en la tabla tecnico.
    public function updateRow2()
    {

        $sql = 'UPDATE tecnicos SET recovery_code = ? WHERE id_tecnico = ?;';
        $params = array(
            $this->hash,
            $this->idUsuario
        );
        return Database::executeRow($sql, $params);
    }
    //Función para actualizar el hash en la tabla jugador.
    public function updateRow3()
    {

        $sql = 'UPDATE jugadores SET recovery_code = ? WHERE id_jugador = ?;';
        $params = array(
            $this->hash,
            $this->idUsuario
        );
        return Database::executeRow($sql, $params);
    }

    //Función para actualizar la contraseña en la tabla administradores.
    public function updatePassword1()
    {
        $sql = 'UPDATE administradores SET clave_administrador = ?, recovery_code = ? WHERE id_administrador = ?;';
        $params = array(
            $this->contrasena,
            $this->hash,
            $this->idUsuario
        );
        return Database::executeRow($sql, $params);
    }
    
    //Función para actualizar la contraseña en la tabla tecnico.
    public function updatePassword2()
    {
        $sql = 'UPDATE tecnicos SET clave_tecnico = ?, recovery_code = ? WHERE id_tecnico = ?;';
        $params = array(
            $this->contrasena,
            $this->hash,
            $this->idUsuario
        );
        return Database::executeRow($sql, $params);
    }

    //Función para actualizar la contraseña en la tabla jugador.
    public function updatePassword3()
    {
        $sql = 'UPDATE jugadores SET clave_jugador = ?, recovery_code = ? WHERE id_jugador = ?;';
        $params = array(
            $this->contrasena,
            $this->hash,
            $this->idUsuario
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer el hash en la tabla administradores.
    public function readHash1()
    {
        $sql = 'SELECT recovery_code FROM administradores
        WHERE id_administrador = ?;';
        $params = array($this->idUsuario);
        $this->hash = Database::getRow($sql, $params);
        $this->hash = $this->hash['recovery_code'];
        return $this->hash;
    }

    //Función para leer el hash en la tabla tecnico.
    public function readHash2()
    {
        $sql = 'SELECT recovery_code FROM tecnicos
        WHERE id_tecnico = ?;';
        $params = array($this->idUsuario);
        $this->hash = Database::getRow($sql, $params);
        $this->hash = $this->hash['recovery_code'];
        return $this->hash;
    }

    //Función para leer el hash en la tabla jugador.
    public function readHash3()
    {
        $sql = 'SELECT recovery_code FROM jugadores
        WHERE id_jugador = ?;';
        $params = array($this->idUsuario);
        $this->hash = Database::getRow($sql, $params);
        $this->hash = $this->hash['recovery_code'];
        return $this->hash;
    }

}

