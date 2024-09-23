<?php

class spiderWeb {
    private $numeros_primos = [3, 5, 7, 11, 13];
    private $encryptionKey = 'califragilisticoespialidoso'; // Contraseña utilizada como clave de encriptación

    // Función para desencriptar la clave
    private function decryptAES($encryptedData) {
        // Separar el IV del texto cifrado
        list($ciphertext, $iv) = explode('.', $encryptedData);

        // Convertir de Base64URL a Base64 estándar
        $ciphertext = str_replace(['-', '_'], ['+', '/'], $ciphertext);
        $ciphertext = base64_decode($ciphertext);

        // Convertir el IV de hexadecimal a binario
        $iv = hex2bin($iv);

        // Asegurarse de que la clave tenga 32 bytes (AES-256)
        $encryptionKey = str_pad($this->encryptionKey, 32, "\0");

        // Desencriptar usando AES-256-CBC
        $plaintext = openssl_decrypt($ciphertext, 'AES-256-CBC', $encryptionKey, OPENSSL_RAW_DATA, $iv);

        return $plaintext;
    }

    // Método para validar la clave encriptada
    public function validateKey($encryptedKey) {
        // Desencriptar la clave proporcionada
        $key = $this->decryptAES($encryptedKey);

        // Crear variables con el día, mes y año actuales
        $now = new DateTime();
        $dia = (int)$now->format('d');
        $mes = (int)$now->format('m');
        $año = (int)$now->format('Y');

        // Crear variable resultado de la operación "(año/mes) / dia"
        $operacion = ($año / $mes) / $dia;

        // Crear variable con el minuto del día
        $hora = (int)$now->format('H');
        $minutos = (int)$now->format('i');
        $minutosDelDia = ($hora * 60) + $minutos;

        // Array para almacenar datos de comparación
        $comparisonData = [];

        // Calcular el múltiplo de la operación más cercano al minuto del día
        $multiplo = round($minutosDelDia / $operacion) * $operacion;

        // Probar cada exponente en el arreglo de números primos
        foreach ($this->numeros_primos as $exponente) {
            // Calcular la clave usando el exponente actual
            $calculatedKey = sqrt(pow($multiplo, $exponente));
            // Comparar la clave calculada con la clave proporcionada
            $key = (double)$key;
            $comparisonData[] = [
                'calculatedKey' => $calculatedKey,
                'providedKey' => $key,
                'exponente' => $exponente
            ];
            if ($calculatedKey === $key) {
                return true;
            }
        }

        // Si no se encuentra coincidencia, probar con el siguiente minuto
        $minutos = (int)$now->format('i');
        $minutosDelDia = ($hora * 60) + $minutos + 1;

        // Calcular el múltiplo de la operación más cercano al minuto del día
        $multiplo = round($minutosDelDia / $operacion) * $multiplo;

        // Probar cada exponente en el arreglo de números primos
        foreach ($this->numeros_primos as $exponente) {
            // Calcular la clave usando el exponente actual
            $calculatedKey = sqrt(pow($multiplo, $exponente));
            // Guardar los datos en el array
            if ($calculatedKey === $key) {
                return true;
            }
            $comparisonData[] = [
                'calculatedKey' => $calculatedKey,
                'providedKey' => (double)$key,
                'exponente' => $exponente
            ];
        }

        // Retornar los valores comparados en lugar de false
        return ['result' => false, 'comparisonData' => $comparisonData];
    }
}
