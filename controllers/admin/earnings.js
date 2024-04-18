
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


const graficoBarrasAnalisis = async () => {
    /*
*   Lista de datos de ejemplo en caso de error al obtener los datos reales.
*/
    const datosEjemplo = [
        {
            mes: 'Enero',
            nota: 700
        },
        {
            mes: 'Febrero',
            nota: 100
        },
        {
            mes: 'Marzo',
            nota: 250
        },
        {
            mes: 'Abril',
            nota: 700
        },
        {
            mes: 'Mayo',
            nota: 100
        },
        {
            mes: 'Junio',
            nota: 150
        },
        {
            mes: 'Julio',
            nota: 100
        },
        {
            mes: 'Agosto',
            nota: 200
        },
        {
            mes: 'Septiembre',
            nota: 400
        },
        {
            mes: 'Octubre',
            nota: 100
        },
        {
            mes: 'Noviembre',
            nota: 150
        },
        {
            mes: 'Diciembre',
            nota: 160
        }

    ];

    let mes = [];
    let notas = [];
    datosEjemplo.forEach(filter => {
        mes.push(filter.mes);
        notas.push(filter.nota);
    });
    // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
    lineGraph('analisis', mes, notas, 'Ingreso de este mes');

}


window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const lesionHtml = await loadComponent('../components/earnings.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = lesionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Ingresos'; 
    graficoBarrasAnalisis();


}