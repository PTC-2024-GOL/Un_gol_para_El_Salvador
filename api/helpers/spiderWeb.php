<?php

class spiderWeb {
    private $numeros_primos = [3, 5, 7, 11, 13];

    public function validateKey($key) {
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

        // Calcular el múltiplo de la operación más cercano al minuto del día
        $multiplo = round($minutosDelDia / $operacion) * $operacion;

        // Probar cada exponente en el arreglo de números primos
        foreach ($this->numeros_primos as $exponente) {
            // Calcular la clave usando el exponente actual
            $calculatedKey = sqrt(pow($multiplo, $exponente));
            // Comparar la clave calculada con la clave proporcionada
            $key = (double)$key;
            if ($calculatedKey === $key) {
                return true; // Retorna true si hay coincidencia
            }
        }

        return false; // Retorna false si no se encontró coincidencia
    }
}