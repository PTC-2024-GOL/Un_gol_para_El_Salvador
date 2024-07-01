<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class AdministradoresHandler
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
    const RUTA_IMAGEN = '../../images/administradores/';

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */

    //Función para chequear el usuario de un admministrador en el login, con el procedimiento almacenado.
    public function authenticateAdmin($aliasemail, $password)
    {
        //Se llama el procedimiento almacenado
        $sql = 'CALL autentificar_administrador(?);';
        //Se mandan los parametros en el orden que lo pide el procedimiento. Primer parametro: Alias o Correo. Segundo parametro: Clave
        $params = array($aliasemail);
        //Se crea una variable y se le cede la variable de la sentencia sql y los parametros
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_administrador'])) {
            //Se ceden el id y el alias a una variable de sesión
            $_SESSION['idAdministrador'] = $data['ID'];
            $_SESSION['aliasAdministrador'] = $data['ALIAS'];
            $_SESSION['fotoAdministrador'] = $data['FOTO'];
            return true;
        } else {
            //Se retorna false si falla la autentificación
            return false;
        }
    }

    //Función para chequear el usuario de un admministrador en el login, sin el procedimiento almacenado.
    public function checkUser($username, $password)
    {
        //Se escribe la consulta
        $sql = 'SELECT id_administrador AS ID, alias_administrador AS ALIAS, CONCAT(nombre_administrador, " ", apellido_administrador) AS NOMBRECOMPLETO,
        clave_administrador AS CLAVE, foto_administrador AS FOTO, estado_administrador AS ESTADO, apellido_administrador AS APELLIDO,
        intentos_administrador AS INTENTOS, DATEDIFF(CURRENT_DATE, fecha_clave) as DIAS, 
        tiempo_intento AS TIEMPO, fecha_bloqueo AS BLOQUEO
        FROM administradores WHERE (BINARY alias_administrador = ? OR BINARY correo_administrador = ?)';
        //Se mandan los parametros en el orden que lo pide el procedimiento. Primer parametro: Alias o Correo. Segundo parametro: Clave
        $params = array($username, $username);
        $data = Database::getRow($sql, $params);
        // Obtener la fecha y hora actual
        $now = new DateTime();
        //Se verifica si tiene contador o si este ya paso.
        if ($data['TIEMPO'] != null && $data['TIEMPO'] < $now) {
            //el usuario tiene contador de tiempo
            return $this->condicion = 'temporizador';
        } elseif ($data['TIEMPO'] != null && $data['TIEMPO'] > $now) {
            //el usuario no tiene contador
            $this->alias = $data['ALIAS'];
            $this->resetTimeAttempt(null);
            $this->changeStateBlock();
            $this->resetAttempts();
        }
        if ($data['ESTADO'] == false) {
            //el usuario esta bloqueado
            return $this->condicion = 'bloqueado';
        } elseif ($data['ESTADO'] == true) {
            $timer = null;
            $this->tiempo = $data['TIEMPO'];
            //se verifica si el usuario tiene contador de tiempo
            if (Validator::validateAttemptsTime($data['TIEMPO']) != true) {
                //el usuario tiene contador de tiempo
                $timer = false;
                $this->tiempo = Validator::validateAttemptsTime($data['TIEMPO']);
            } else {
                //el usuario no tiene contador
                $this->alias = $data['ALIAS'];
                $this->resetTimeAttempt(null);
                $timer = true;
            }
            if ($timer == false) {
                //el usuario tiene contador de tiempo
                return $this->condicion = 'temporizador';
            } elseif ($data['INTENTOS'] >= 3) {
                //las contraseñas no coinciden, se validan los intentos de sesión para ver si el usuario deberia tener un cotnador
                return $this->condicion = 'tiempo';
            }
            // Se verifica si la contraseña coincide con el hash almacenado en la base de datos. 
            elseif (password_verify($password, $data['CLAVE'])) {
                $_SESSION['idAdministrador'] = $data['ID'];
                $_SESSION['aliasAdministrador'] = $data['ALIAS'];
                $_SESSION['fotoAdministrador'] = $data['FOTO'];
                $_SESSION['nombreAdministrador'] = $data['NOMBRECOMPLETO'];
                $_SESSION['apellidoAdministrador'] = $data['APELLIDO'];
                $this->dias = $data['DIAS'];
                $this->estado = $data['ESTADO'];
                return true;
            } else {
                //Se retorna false si falla la autentificación
                return false;
            }
        } else {
            //Se retorna false si falla la autentificación
            return false;
        }
    }

    // Función que retorna a su estado original la variable de condición
    public function resetCondition()
    {
        return $this->condicion = null;
    }

    // Función que chequea el estado
    public function checkStatus()
    {
        if ($this->estado) {
            return true;
        } else {
            return false;
        }
    }

    //Función para chequear la contraseña de un admministrador.
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_administrador AS CLAVE
                FROM administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
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
        $sql = 'UPDATE administradores
                SET clave_administrador = ?, fecha_clave = NOW()
                WHERE id_administrador = ?';
        $params = array($this->clave, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar un admministrador o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_administradores
        WHERE NOMBRE LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un admministrador.
    public function createRow()
    {
        $sql = 'CALL insertar_administrador_validado(?,?,?,?,?,?,?,?);';
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
        $sql = 'SELECT * FROM vista_tabla_administradores
        ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para leer un administrador.
    public function readOne()
    {
        $sql = 'SELECT id_administrador AS ID,
        nombre_administrador AS NOMBRE,
        apellido_administrador AS APELLIDO,
        correo_administrador AS CORREO,
        telefono_administrador AS TELÉFONO,
        dui_administrador AS DUI,
        fecha_nacimiento_administrador AS NACIMIENTO,
        clave_administrador AS CLAVE,
        foto_administrador AS IMAGEN
        FROM administradores
        WHERE id_administrador LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT IMAGEN
                FROM vista_tabla_administradores
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Leer la imagen del administrador que ha iniciado sesion.
    public function readFilenameProfile()
    {
        $sql = 'SELECT IMAGEN
                FROM vista_tabla_administradores
                WHERE ID = ?';
        $params = array($_SESSION['idAdministrador'],);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un admministrador.
    public function updateRow()
    {
        $sql = 'CALL actualizar_administrador_validado(?,?,?,?,?,?,?,?);';
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
        $sql = 'CALL eliminar_administrador(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para cambiar el estado de un admministrador.
    public function changeState()
    {
        $sql = 'UPDATE administradores SET estado_administrador = NOT estado_administrador WHERE id_administrador = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para cambiar el estado de un admministrador bloqueado.
    public function changeStateBlock()
    {
        $sql = 'UPDATE administradores SET estado_administrador = 1, fecha_bloqueo = NULL WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //Función para chequear si el DUI o el CORREO estan duplicados.
    public function checkDuplicate($value)
    {
        if ($this->id) {
            $sql = 'SELECT id_administrador
            FROM administradores
            WHERE dui_administrador = ? OR correo_administrador = ? AND id_administrador != ?';
            $params = array($value, $value, $this->id);
            return Database::getRow($sql, $params);
        } else {
            $sql = 'SELECT id_administrador
            FROM administradores
            WHERE dui_administrador = ? OR correo_administrador = ?';
            $params = array($value, $value);
            return Database::getRow($sql, $params);
        }
    }

    //Función para ingresar el primer usuario.
    public function firstUser()
    {
        $sql = 'CALL insertar_administrador_validado(?,?,?,?,?,?,?,?);';
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
        $sql = 'SELECT DATEDIFF(CURRENT_DATE, fecha_clave) AS DIAS FROM administradores WHERE id_administrador = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Agregar un intento fallido de inicio al usuario
    public function addAttempt()
    {
        $sql = 'UPDATE administradores SET intentos_administrador = intentos_administrador+1 WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //Reiniciar el contador de intentos a 0
    public function resetAttempts()
    {
        $sql = 'UPDATE administradores SET intentos_administrador = 0 WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //cambiar el contador de tiempo para incicar sesion nuevamente
    public function uploadTimeAttempt()
    {
        // Preparar la consulta SQL para actualizar el campo tiempo_intento sumando un día a la fecha actual
        $sql = 'UPDATE administradores SET tiempo_intento = DATE_ADD(NOW(), INTERVAL 1 DAY) WHERE alias_administrador = ?';
        $params = array($this->alias);
        // Ejecutar la consulta SQL
        return Database::executeRow($sql, $params);
    }


    //cambiar el contador de tiempo para incicar sesion nuevamente
    public function resetTimeAttempt($timer)
    {
        $sql = 'UPDATE administradores SET tiempo_intento = ? WHERE alias_administrador = ?';
        $params = array($timer, $this->alias);
        return Database::executeRow($sql, $params);
    }

    //bloquear un administrador
    public function blockUser()
    {
        $sql = 'UPDATE administradores SET estado_administrador = 0, fecha_bloqueo = NOW() WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //mostrar perfil
    public function readProfile()
    {
        $sql = 'SELECT id_administrador AS ID,
                foto_administrador AS IMAGEN, 
                CONCAT(nombre_administrador, " ", apellido_administrador) AS NOMBRE,
                correo_administrador AS CORREO, 
                telefono_administrador AS TELÉFONO,
                dui_administrador AS DUI,
                fecha_nacimiento_administrador AS NACIMIENTO,
                estado_administrador  AS ESTADO
                FROM administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRow($sql, $params);
    }

    //leer una linea en el perfil
    public function readOneProfile()
    {
        $sql = 'SELECT id_administrador AS ID,
                nombre_administrador AS NOMBRE,
                apellido_administrador AS APELLIDO,
                correo_administrador AS CORREO,
                telefono_administrador AS TELÉFONO,
                dui_administrador AS DUI,
                fecha_nacimiento_administrador AS NACIMIENTO,
                clave_administrador AS CLAVE,
                foto_administrador AS IMAGEN
                FROM administradores
                WHERE id_administrador LIKE ?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar el perfil.
    public function updateRowProfile()
    {
        $sql = 'CALL actualizar_administrador_validado(?,?,?,?,?,?,?,?);';
        $params = array(
            $_SESSION['idAdministrador'],
            $this->nombre,
            $this->apellido,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->imagen
        );
        $_SESSION['fotoAdministrador'] = $this->imagen;
        return Database::executeRow($sql, $params);
    }
}
