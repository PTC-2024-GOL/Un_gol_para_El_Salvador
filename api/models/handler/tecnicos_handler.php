<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tecnico.
 */
class TecnicosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $alias = null;
    protected $clave = null;
    protected $telefono = null;
    protected $dui = null;
    protected $nacimiento = null;
    protected $imagen = null;
    protected $estado = null;
    protected $tiempo = null;
    protected $dias = null;
    protected $bloqueo = null;
    protected $condicion = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/tecnicos/';

    /*
     *  Métodos para gestionar la cuenta del tecnico.
     */

    //Función para chequear el usuario de un admministrador en el login, sin el procedimiento almacenado.
    
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_tecnico, correo_tecnico, clave_tecnico, estado_tecnico, foto_tecnico, alias_tecnico, nombre_tecnico
                FROM tecnicos
                WHERE correo_tecnico = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['clave_tecnico'])) {
            $this->id = $data['id_tecnico'];
            $this->correo = $data['correo_tecnico'];
            $this->alias = $data['alias_tecnico'];
            $this->estado = $data['estado_tecnico'];
            $this->imagen = $data['foto_tecnico'];
            $this->nombre = $data['nombre_tecnico'];
            return true;
        } else {
            return false;
        }
    }

    // Función que chequea el estado
    public function checkStatus()
    {
        if ($this->estado) {
            $_SESSION['idTecnico'] = $this->id;
            $_SESSION['correoTecnico'] = $this->correo;
            $_SESSION['fotoTecnico'] = $this->imagen;
            $_SESSION['aliasTecnico'] = $this->alias;
            $_SESSION['nombreTecnico'] = $this->nombre;
            return true;
        } else {
            return false;
        }
    }

    //Función para chequear la contraseña de un admministrador.
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_tecnico AS CLAVE
                FROM tecnicos
                WHERE id_tecnico = ?';
        $params = array($_SESSION['idTecnico']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['CLAVE'])) {
            return true;
        } else {
            return false;
        }
    }

    //Función para cambiar la contraseña de un admministrador.
    public function changePassword()
    {
        $sql = 'UPDATE tecnicos
                SET clave_tecnico = ?, fecha_clave = NOW()
                WHERE id_tecnico = ?';
        $params = array($this->clave, $_SESSION['idTecnico']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar un admministrador o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_tecnicos
        WHERE NOMBRE LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un admministrador.
    public function createRow()
    {
        $sql = 'CALL insertar_tecnico_validado(?,?,?,?,?,?,?,?);';
        $params = array(
            $this->nombre,
            $this->apellido,
            $this->clave,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todos los admministradores.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tabla_tecnicos
        ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para leer un tecnico.
    public function readOne()
    {
        $sql = 'SELECT id_tecnico AS ID,
        nombre_tecnico AS NOMBRE,
        apellido_tecnico AS APELLIDO,
        correo_tecnico AS CORREO,
        telefono_tecnico AS TELÉFONO,
        dui_tecnico AS DUI,
        fecha_nacimiento_tecnico AS NACIMIENTO,
        clave_tecnico AS CLAVE,
        foto_tecnico AS IMAGEN
        FROM tecnicos
        WHERE id_tecnico LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT IMAGEN
                FROM vista_tabla_tecnicos
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un admministrador.
    public function updateRow()
    {
        $sql = 'CALL actualizar_tecnico_validado(?,?,?,?,?,?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->apellido,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un admministrador.
    public function deleteRow()
    {
        $sql = 'CALL eliminar_tecnico(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para cambiar el estado de un admministrador.
    public function changeState()
    {
        $sql = 'UPDATE tecnicos SET estado_tecnico = NOT estado_tecnico WHERE id_tecnico = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para cambiar el estado de un admministrador bloqueado.
    public function changeStateBlock()
    {
        $sql = 'UPDATE tecnicos SET estado_tecnico = 1, fecha_bloqueo = NULL WHERE alias_tecnico = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //Función para chequear si el DUI o el CORREO estan duplicados.
    public function checkDuplicate($value)
    {
        $sql = 'SELECT ID
                FROM vista_tabla_tecnicos
                WHERE DUI = ? OR CORREO = ?';
        $params = array($value, $value);
        return Database::getRow($sql, $params);
    }

    //Función para ingresar el primer usuario.
    public function firstUser()
    {
        $sql = 'CALL insertar_tecnico(?,?,?,?,?,?,?,1,?);';
        $params = array(
            $this->nombre,
            $this->apellido,
            $this->clave,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para validación de cambio de contraseña cada 90 dias.
    public function readPassDate()
    {
        $sql = 'SELECT DATEDIFF(CURRENT_DATE, fecha_clave) AS DIAS FROM tecnicos WHERE id_tecnico = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Agregar un intento fallido de inicio al usuario
    public function addAttempt()
    {
        $sql = 'UPDATE tecnicos SET intentos_tecnico = intentos_tecnico+1 WHERE alias_tecnico = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //Reiniciar el contador de intentos a 0
    public function resetAttempts()
    {
        $sql = 'UPDATE tecnicos SET intentos_tecnico = 0 WHERE alias_tecnico = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //cambiar el contador de tiempo para incicar sesion nuevamente
    public function uploadTimeAttempt()
    {
        // Preparar la consulta SQL para actualizar el campo tiempo_intento sumando un día a la fecha actual
        $sql = 'UPDATE tecnicos SET tiempo_intento = DATE_ADD(NOW(), INTERVAL 1 DAY) WHERE alias_tecnico = ?';
        $params = array($this->alias);
        // Ejecutar la consulta SQL
        return Database::executeRow($sql, $params);
    }


    //cambiar el contador de tiempo para incicar sesion nuevamente
    public function resetTimeAttempt($timer)
    {
        $sql = 'UPDATE tecnicos SET tiempo_intento = ? WHERE alias_tecnico = ?';
        $params = array($timer, $this->alias);
        return Database::executeRow($sql, $params);
    }

    //bloquear un tecnico
    public function blockUser()
    {
        $sql = 'UPDATE tecnicos SET estado_tecnico = 0, fecha_bloqueo = NOW() WHERE alias_tecnico = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }
}
