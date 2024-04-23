
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const graficoPieDashboard = async () => {
    /*
*   Lista de datos de ejemplo en caso de error al obtener los datos reales.
*/
    const datosEjemplo = [
        {
            partido: 'Partidos ganados',
            resultado: 5
        },
        {
            partido: 'Partidos perdidos',
            resultado: 5
        },
        {
            partido: 'Partidos empatados',
            resultado: 5
        },
        {
            partido: 'Goles en contra',
            resultado: 6
        },
        {
            partido: 'Goles a favor',
            resultado: 5
        },
        {
            partido: 'Diferencia',
            resultado: 5
        }
    ];

    let partido = [];
    let resultado = [];
    datosEjemplo.forEach(filter => {
        partido.push(filter.partido);
        resultado.push(filter.resultado);
    });
    // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
    DoughnutGraph('estadistica', partido, resultado, 'Total');

}


const calendar = async () => {
    
    const Calendar = tui.Calendar;

    const calendar = new Calendar('#calendar', {
    defaultView: 'month',
    template: {
      time(event) {
        const { start, end, title } = event;
  
        return `<span style="color: white;">${formatTime(start)}~${formatTime(end)} ${title}</span>`;
      },
      allday(event) {
        return `<span style="color: gray;">${event.title}</span>`;
      },
    },
    calendars: [
      {
        id: 'cal1',
        name: 'Personal',
        backgroundColor: '#03bd9e',
      },
      {
        id: 'cal2',
        name: 'Work',
        backgroundColor: '#00a9ff',
      },
    ],
  });

}

window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const lesionHtml = await loadComponent('../components/dashboard.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = lesionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Dashboard'; 

    //Agrega el nombre del admin que ha iniciado sesion
    const adminName = document.getElementById('nombreAdmin');
    adminName.textContent ='José Gonzáles';
    graficoPieDashboard();
    calendar();
    console.log(adminName.text)
}