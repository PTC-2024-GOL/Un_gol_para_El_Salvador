<?php
/*
 *	Clase para validar todos los datos de entrada del lado del servidor.
 */
class Validator
{
    /*
     *   Atributos para manejar algunas validaciones.
     */
    private static $filename = null;
    private static $search_value = null;
    private static $password_error = null;
    private static $file_error = null;
    private static $search_error = null;

    // Método para obtener el error al validar una contraseña.
    public static function getPasswordError()
    {
        return self::$password_error;
    }

    // Método para obtener el nombre del archivo validado.
    public static function getFilename()
    {
        return self::$filename;
    }

    // Método para obtener el error al validar un archivo.
    public static function getFileError()
    {
        return self::$file_error;
    }

    // Método para obtener el valor de búsqueda.
    public static function getSearchValue()
    {
        return self::$search_value;
    }

    // Método para obtener el error al validar una búsqueda.
    public static function getSearchError()
    {
        return self::$search_error;
    }

    /*
     *   Método para sanear todos los campos de un formulario (quitar los espacios en blanco al principio y al final).
     *   Parámetros: $fields (arreglo con los campos del formulario).
     *   Retorno: arreglo con los campos saneados del formulario.
     */
    public static function validateForm($fields)
    {
        foreach ($fields as $index => $value) {
            $value = trim($value);
            $fields[$index] = $value;
        }
        return $fields;
    }

    /*
     *   Método para validar un número natural como por ejemplo llave primaria, llave foránea, entre otros.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateNaturalNumber($value)
    {
        // Se verifica que el valor sea un número entero mayor o igual a uno.
        if (filter_var($value, FILTER_VALIDATE_INT, array('options' => array('min_range' => 1)))) {
            return true;
        } else {
            return false;
        }
    }

    public static function validatePositiveNumber($value)
    {
        // Se verifica que el valor sea un número entero mayor o igual a 0.
        if ($value >= 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function validatePositiveNumber2($value)
    {
        // Se verifica que el valor sea un número entero mayor a 0 y menor a 100.
        if ($value > 0 && $value < 100) {
            return true;
        } else {
            return false;
        }
    }


    /*
         *   Método para validar un archivo de imagen.
         *   Parámetros: $file (archivo de un formulario) y $dimension (medida mínima para la imagen).
         *   Retorno: booleano (true si el archivo es correcto o false en caso contrario).
         */
    public static function validateImageFile($file, $dimension)
    {
        if (is_uploaded_file($file['tmp_name'])) {
            // Se obtienen los datos de la imagen.
            $image = getimagesize($file['tmp_name']);
            // Se comprueba si el archivo tiene un tamaño mayor a 2MB.
            if ($file['size'] > 2097152) {
                self::$file_error = 'El tamaño de la imagen debe ser menor a 2MB';
                return false;
            } elseif ($image['mime'] == 'image/jpeg' || $image['mime'] == 'image/png') {
                // Se obtiene la extensión del archivo (.jpg o .png) y se convierte a minúsculas.
                $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                // Se establece un nombre único para el archivo.
                self::$filename = uniqid() . '.' . $extension;
                return true;
            } else {
                self::$file_error = 'El tipo de imagen debe ser jpg o png';
                return false;
            }
        } else {
            return false;
        }
    }

    /*
     *   Método para validar un correo electrónico.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateEmail($value)
    {
        if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar un dato booleano.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateBoolean($value)
    {
        if ($value == 1 || $value == 0) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar una cadena de texto (letras, digitos, espacios en blanco y signos de puntuación).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateString($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\,\;\.]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    public static function validateNumberArray($value)
    {
        // Verifica si el valor es un array y tiene exactamente 6 elementos.
        if (is_array($value) && count($value) === 6) {
            // Recorre el array para verificar que cada elemento sea un número.
            foreach ($value as $item) {
                if (!is_numeric($item)) {
                    return false; // Si algún elemento no es numérico, retorna false.
                }
            }
            return true; // Si todos los elementos son numéricos y hay 4, retorna true.
        } else {
            return false; // Si no es un array o no tiene exactamente 4 elementos, retorna false.
        }
    }

    /*
 *   Método para validar una cadena de texto (letras, dígitos, espacios en blanco, signos de puntuación y guiones).
 *   Parámetros: $value (dato a validar).
 *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
 */
    public static function validateStringText($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\,\;\.\-\+]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /* 
 *   Método para validar una cadena de texto (letras, dígitos, espacios en blanco, signos de puntuación y guiones).
 *   Parámetros: $value (dato a validar).
 *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
 */
    public static function validateTextOrtograpic($value)
    {
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\,\;\.\-\+\/\?\!]*$/', $value)) {
            return true;
        } else {
            return false;
        }
    }


    /*
     *   Método para validar un dato alfabético (letras y espacios en blanco).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateAlphabetic($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar un dato alfanumérico (letras, dígitos y espacios en blanco).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateAlphanumeric($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar la longitud de una cadena de texto.
     *   Parámetros: $value (dato a validar), $min (longitud mínima) y $max (longitud máxima).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateLength($value, $min, $max)
    {
        // Se verifica la longitud de la cadena de texto.
        if (strlen($value) >= $min && strlen($value) <= $max) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar un dato monetario.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateMoney($value)
    {
        // Se verifica que el número tenga una parte entera y como máximo dos cifras decimales.
        if (preg_match('/^[0-9]+(?:\.[0-9]{1,2})?$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar una contraseña.
   *   Parámetros: $value (dato a validar).
   *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
   */
    public static function validatePassword($value, $name, $lastname, $birthday, $phone, $email)
    {
        // Se verifica la longitud mínima.
        if (strlen($value) < 8) {
            self::$password_error = 'Clave menor a 8 caracteres';
            return false;
        } elseif (strlen($value) > 72) {
            self::$password_error = 'Clave mayor a 72 caracteres';
            return false;
        } elseif (preg_match('/\s/', $value)) {
            self::$password_error = 'Clave contiene espacios en blanco';
            return false;
        } elseif (!preg_match('/\W/', $value)) {
            self::$password_error = 'Clave debe contener al menos un caracter especial';
            return false;
        } elseif (!preg_match('/\d/', $value)) {
            self::$password_error = 'Clave debe contener al menos un dígito';
            return false;
        } elseif (!preg_match('/[a-z]/', $value)) {
            self::$password_error = 'Clave debe contener al menos una letra en minúsculas';
            return false;
        } elseif (!preg_match('/[A-Z]/', $value)) {
            self::$password_error = 'Clave debe contener al menos una letra en mayúsculas';
            return false;
        }

        $sensitiveData = [
            'nombre' => $name,
            'apellido' => $lastname,
            'fecha de nacimiento' => $birthday,
            'teléfono' => $phone,
            'email' => $email
        ];

        $valueLower = strtolower($value); // Convertir la contraseña a minúsculas para evitar problemas con mayúsculas/minúsculas

        foreach ($sensitiveData as $dataLabel => $data) {
            if ($data) {
                $dataLower = strtolower($data); // Convertir también el dato personal a minúsculas
                // Verificamos si alguna subcadena de 3 caracteres o más del dato personal está en la contraseña
                for ($i = 0; $i <= strlen($dataLower) - 3; $i++) {
                    $substring = substr($dataLower, $i, 3); // Extraer una subcadena de 3 caracteres
                    if (strpos($valueLower, $substring) !== false) {
                        self::$password_error = "Clave contiene parte del $dataLabel del usuario: '$substring'";
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /*
     *   Método para validar el formato del DUI (Documento Único de Identidad).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateDUI($value)
    {
        // Se verifica que el número tenga el formato 00000000-0.
        if (preg_match('/^[0-9]{8}[-][0-9]{1}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar un número telefónico.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validatePhone($value)
    {
        // Se verifica que el número tenga el formato 0000-0000 y que inicie con 2, 6 o 7.
        if (preg_match('/^[2,6,7]{1}[0-9]{3}[-][0-9]{4}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar una fecha.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateDate($value)
    {
        // Se dividen las partes de la fecha y se guardan en un arreglo con el siguiene orden: año, mes y día.
        $date = explode('-', $value);
        if (checkdate($date[1], $date[2], $date[0])) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar un valor de búsqueda.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateSearch($value)
    {
        if (trim($value) == '') {
            self::$search_error = 'Ingrese un valor para buscar';
            return false;
        } elseif (str_word_count($value) > 3) {
            self::$search_error = 'La búsqueda contiene más de 3 palabras';
            return false;
        } elseif (self::validateString($value)) {
            self::$search_value = $value;
            return true;
        } else {
            self::$search_error = 'La búsqueda contiene caracteres prohibidos';
            return false;
        }
    }

    public static function validateSearch2($value)
    {
        if (trim($value) == '') {
            self::$search_error = 'Ingrese un valor para buscar';
            return false;
        } elseif (str_word_count($value) > 3) {
            self::$search_error = 'La búsqueda contiene más de 3 palabras';
            return false;
        } elseif (self::validateStringText($value)) {
            self::$search_value = $value;
            return true;
        } else {
            self::$search_error = 'La búsqueda contiene caracteres prohibidos';
            return false;
        }
    }

    /*
     *   Método para validar un archivo al momento de subirlo al servidor.
     *   Parámetros: $file (archivo), $path (ruta del archivo) y $name (nombre del archivo).
     *   Retorno: booleano (true si el archivo fue subido al servidor o false en caso contrario).
     */
    public static function saveFile($file, $path)
    {
        if (!$file) {
            return false;
        } elseif (move_uploaded_file($file['tmp_name'], $path . self::$filename)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar el cambio de un archivo en el servidor.
     *   Parámetros: $file (archivo), $path (ruta del archivo) y $old_filename (nombre del archivo anterior).
     *   Retorno: booleano (true si el archivo fue subido al servidor o false en caso contrario).
     */
    public static function changeFile($file, $path, $old_filename)
    {
        if (!self::saveFile($file, $path)) {
            return false;
        } elseif (self::deleteFile($path, $old_filename)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     *   Método para validar un archivo al momento de borrarlo del servidor.
     *   Parámetros: $path (ruta del archivo) y $filename (nombre del archivo).
     *   Retorno: booleano (true si el archivo fue borrado del servidor o false en caso contrario).
     */
    public static function deleteFile($path, $filename)
    {
        if ($filename == 'default.png') {
            return true;
        } elseif (@unlink($path . $filename)) {
            return true;
        } else {
            return false;
        }
    }

    public static function validateSessionTime()
    {
        //Tiempo en segundos para dar vida a la sesión.
        $inactivo = 300; //Tiempo en segundos.

        //Calculamos tiempo de vida inactivo.
        $vida_session = time() - $_SESSION['tiempo'];

        //Compraración para redirigir página, si la vida de sesión sea mayor a el tiempo insertado en inactivo.
        if ($vida_session > $inactivo) {
            session_destroy();
            exit();
        } else { // si no ha caducado la sesion, actualizamos
            $_SESSION['tiempo'] = time();
            return true;
        }
    }

    public static function validateAttemptsTime($tiempo)
    {
        if ($tiempo != null) {
            //Tiempo en segundos para dar vida a la sesión.
            $temporizador = 30; //Tiempo en segundos.

            //Calculamos tiempo de vida inactivo.
            $cuenta = time() - $tiempo;

            //Compraración para redirigir página, si la vida de sesión sea mayor a el tiempo insertado en inactivo.
            if ($cuenta > $temporizador) {
                //Destruimos sesión.
                return true;
            } else { // si no ha caducado la sesion, actualizamos
                return false;
            }
        } else {
            return true;
        }
    }


    /*
     *   Método para validar un formato de hora (HH:MM).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateTime($value)
    {
        // Expresión regular para verificar el formato de hora HH:MM[:SS], donde los segundos son opcionales
        if (preg_match('/^(2[0-3]|[01][0-9]):([0-5][0-9])(?::([0-5][0-9]))?$/', $value, $matches)) {
            $hour = $matches[1];
            $minute = $matches[2];
            $second = isset($matches[3]) ? $matches[3] : '00'; // Si los segundos no están presentes, se asigna '00'

            // Retorna la hora en formato HH:MM:SS
            return "$hour:$minute:$second";
        }

        // Si no cumple con el formato, retorna false
        return false;
    }


    /*
     *   Método para validar una fecha (mayor a 18 años).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validateDateBirthday($value)
    {
        // Se dividen las partes de la fecha y se guardan en un arreglo en el siguiene orden: año, mes y día.
        $datev = strtotime($value);
        $datem = strtotime('-18 years', time());
        $datea = strtotime('-122 years', time());
        if ($datev > $datem) {
            return false;
        } elseif ($datev < $datea) {
            return false;
        } else {
            $date = explode('-', $value);
            if (checkdate($date[1], $date[2], $date[0])) {
                return true;
            } else {
                return false;
            }
        }
    }

    /*
     *   Método para validar un número decimal positivo.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    public static function validatePositiveDecimal($value)
    {
        // Se verifica que el valor sea un número decimal positivo.
        if (filter_var($value, FILTER_VALIDATE_FLOAT) && $value > 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function validatePlayerDateBirthday($value)
    {
        // Se dividen las partes de la fecha y se guardan en un arreglo en el siguiene orden: año, mes y día.
        $datev = strtotime($value);
        $datem = strtotime('-4 years', time());
        $datea = strtotime('-30 years', time());
        if ($datev > $datem) {
            return false;
        } elseif ($datev < $datea) {
            return false;
        } else {
            $date = explode('-', $value);
            if (checkdate($date[1], $date[2], $date[0])) {
                return true;
            } else {
                return false;
            }
        }
    }

    public static function validatePositiveDecimal2($value)
    {
        // Se verifica que el valor sea un número decimal positivo.
        if (filter_var($value, FILTER_VALIDATE_FLOAT) && $value > 0 && $value < 11) {
            return true;
        } else {
            return false;
        }
    }




    /*
     *   Método para un dato de tipo DATETIME
     *   Prametros: $value (dato a validar)
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario)
     *   Este método valida el formato de la fecha y la hora en formato ISO 8601
     */
    public static function validateDateTime($value)
    {
        // Verifica que el formato sea correcto usando expresiones regulares: YYYY-MM-DDTHH:MM[:SS]
        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})T(2[0-3]|[01][0-9]):([0-5][0-9])(?::([0-5][0-9]))?$/', $value, $matches)) {
            // Extrae las partes de la fecha y la hora
            $year = $matches[1];
            $month = $matches[2];
            $day = $matches[3];
            $hour = isset($matches[4]) ? $matches[4] : '01';
            $minute = isset($matches[5]) ? $matches[5] : '00';
            // Si los segundos no están presentes, se asigna '00'
            $second = isset($matches[6]) ? $matches[6] : '00';

            // Verifica la validez de la fecha
            if (checkdate($month, $day, $year)) {
                // Retorna la fecha en el formato que MySQL acepta: YYYY-MM-DD HH:MM:SS
                return "$year-$month-$day $hour:$minute:$second";
            }
        }
        return false;
    }
    /* 
    public static function generar_salt($dui)
    {
        // Arreglo de caracteres especiales que serán utilizados en el salt.
        $caracteres_especiales = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

        // Alfabeto para convertir resultados numéricos en letras si están en el rango 1-26.
        $alfabeto = range('A', 'Z');

        // Remover el guion del formato del DUI (ejemplo: "12345678-9" -> "123456789").
        $dui = str_replace('-', '', $dui);

        $salt = '';  // Variable que almacenará el salt final generado.

        // Iterar a través de cada dígito del DUI.
        for ($i = 0; $i < strlen($dui); $i++) {
            // Convertir el dígito actual a un número entero.
            $digito = (int)$dui[$i];
            $resultado = 0;  // Inicializamos la variable que contendrá el resultado de la operación.

            // Dependiendo de la posición del dígito (índice + 1), aplicar una operación distinta.
            switch ($i + 1) {
                case 1:
                    // Para el primer dígito: aplicar una suma con una derivada.
                    // Derivada de f(x) = x^2 + 3x -> f'(x) = 2x + 3
                    // Si el dígito es 0, aplicamos el coseno para evitar 0 en el resultado.
                    $resultado = ($digito == 0) ? cos(0) + pow(1, 1) : 2 * $digito + 3;
                    break;
                case 2:
                    // Para el segundo dígito: aplicar una resta con función exponencial.
                    // Exponencial: e^(x - 3) para aumentar la complejidad.
                    // Si el dígito es 0, aplicamos el coseno.
                    $resultado = ($digito == 0) ? cos(0) + pow(2, 2) : exp($digito - 3);
                    break;
                case 3:
                    // Para el tercer dígito: aplicar una división con logaritmo natural.
                    // Logaritmo natural: ln(x + 1) para evitar valores negativos o infinitos.
                    $resultado = ($digito == 0) ? cos(0) + pow(3, 3) : log($digito + 1);
                    break;
                case 4:
                    // Nueva operación: Suma con función factorial y logaritmo.
                    // Aplicamos factorial al valor absoluto del dígito y le sumamos log(digito + 10)
                    $resultado = ($digito == 0) ? cos(0) + pow(4, 4) : self::factorial($digito) + log($digito + 10);
                    break;
                case 5:
                    // Nueva operación: Potencia elevada con raíz cúbica.
                    // Elevar al cuadrado el dígito y tomar la raíz cúbica del resultado.
                    $resultado = ($digito == 0) ? cos(0) + pow(5, 5) : pow($digito, 2) * self::cbrt($digito);
                    break;
                case 6:
                    // Nueva operación: Logaritmo en base 10 combinado con función exponencial.
                    // Aplicamos logaritmo base 10 y luego exponencial.
                    $resultado = ($digito == 0) ? cos(0) + pow(6, 6) : exp(log10($digito + 1));
                    break;
                case 7:
                    // Nueva operación: Tangente hiperbólica con coseno inverso.
                    // Calculamos el coseno inverso y combinamos con tangente hiperbólica.
                    $resultado = ($digito == 0) ? cos(0) + pow(7, 7) : atanh($digito / 10) + acos($digito / 10);
                    break;
                case 8:
                    // Nueva operación: Logaritmo de raíz cuadrada y multiplicación por pi.
                    // Tomamos la raíz cuadrada del dígito y multiplicamos por pi.
                    $resultado = ($digito == 0) ? cos(0) + pow(8, 8) : sqrt($digito) * M_PI;
                    break;
                case 9:
                    // Nueva operación: Potencia de euler (e^x) combinada con tangente inversa.
                    // Aplicamos la potencia de Euler y luego la tangente inversa.
                    $resultado = ($digito == 0) ? cos(0) + pow(9, 9) : atan($digito) + exp($digito / 10);
                    break;
            }

            // Redondeamos el resultado para evitar valores con decimales.
            $resultado = round($resultado);

            // Validar si el resultado es demasiado grande o negativo.
            if ($resultado < 0) {
                // Si es negativo, tomamos los últimos dos dígitos y los convertimos a positivo.
                $resultado = abs($resultado);
                $resultado = (int)substr($resultado, -2);  // Tomamos los últimos dos dígitos.
            } elseif ($resultado > 99) {
                // Si es demasiado grande (más de 99), tomamos solo los primeros dos dígitos.
                $resultado = (int)substr($resultado, 0, 2);  // Tomamos los primeros dos dígitos.
            }

            // Si el resultado es mayor a 27, solo usamos uno de los dos dígitos (para generar letras).
            if ($resultado > 27) {
                $resultado = (int)substr((string)$resultado, 0, 1);
            }

            // Obtener el primer dígito del resultado para seleccionar el carácter especial.
            $primer_digito = abs((int)($resultado / 10)) % 10;

            // Seleccionamos un carácter especial basado en el primer dígito.
            $caracter_especial = $caracteres_especiales[$primer_digito % count($caracteres_especiales)];

            // Convertimos el resultado en una letra si está en el rango 1-26; de lo contrario, dejamos el número.
            $letra = ($resultado > 0 && $resultado <= 26)
                ? $alfabeto[$resultado - 1]  // Convertimos a letra si está en el rango.
                : $resultado;  // Si no, mantenemos el número.

            // Redondeamos el resultado y obtenemos solo el primer dígito.
            $resultado = abs((int)substr((string)round($resultado), 0, 1));
            
            // Construimos la sal combinando el carácter especial, el número y la letra.
            $salt .= $caracter_especial . '.' . $resultado . '.' . $letra;
        }

        // Devolvemos la sal generada.
        return $salt;
    }

    // Función auxiliar para calcular el factorial de un número.
    public static function factorial($n)
    {
        if ($n <= 1) {
            return 1;
        }
        return $n * self::factorial($n - 1);
    }

    // Función para calcular la raíz cúbica.
    public static function cbrt($n)
    {
        return pow($n, 1 / 3);
    } */
}
