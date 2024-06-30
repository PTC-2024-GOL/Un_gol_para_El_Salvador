let ADMIN_NAME;

//VARIABLES PARA EL MANEJO DE LA GRAFICA
let SELECT;
let GRAPHIC_DATA;
let GRAPHIC_TEXT;
let GRAPHIC;
let TEXT;

//VARIABLES PARA EL MANEJO DE RESULTADOS GENERALES DEL EQUIPO
let GANADOS;
let PERDIDOS;
let EMPATADOS;
let GOLES_CONTRA;
let GOLES_FAVOR;
let DIFERENCIA;

//VARIABLES PARA MOSTRAR LOS EQUIPOS
let TEAMS;

let API_SOCCER = 'services/admin/equipos.php';
let MATCHES_API = 'services/admin/partidos.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

//Funcion para manejar la grafica y estadisticas generales del equipo cuando se seleccione un equipo
const changeSoccer = async () => {
    SELECT = document.getElementById('equipos').value;

    const FORM = new FormData();
    FORM.append('idEquipo', SELECT);

    //GRAFICA
    const DATA = await fetchData(MATCHES_API, 'trainingAnylsis', FORM);

    if(DATA.status){
        TEXT.classList.add('d-none');
        GRAPHIC.classList.remove('d-none');
        GRAPHIC_TEXT.classList.add('d-none');
        GRAPHIC_DATA = DATA.dataset;
        let caracteristica = [];
        let promedio = [];
        GRAPHIC_DATA.forEach(filter => {
            caracteristica.push(filter.caracteristica);
            promedio.push(filter.promedio);
        });
        // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
        DoughnutGraph('estadistica', caracteristica, promedio, 'Promedio por cada área');
    } else{
        TEXT.classList.add('d-none');
        GRAPHIC_TEXT.classList.remove('d-none');
        GRAPHIC_TEXT.textContent = DATA.error;
        GRAPHIC.classList.add('d-none');
    }

    //ESTADISTICA

    const DATA2 = await fetchData(MATCHES_API, 'matchesResult', FORM);

    if(DATA2.status){
        GANADOS.textContent = DATA2.dataset.victorias;
        PERDIDOS.textContent = DATA2.dataset.derrotas;
        EMPATADOS.textContent = DATA2.dataset.empates;
        GOLES_CONTRA.textContent = DATA2.dataset.golesEnContra;
        GOLES_FAVOR.textContent = DATA2.dataset.golesAFavor;
        DIFERENCIA .textContent = DATA2.dataset.diferencia;
    }


}

const soccerTeams = async () => {

    const DATA = await fetchData(API_SOCCER, 'readAll');

    if(DATA.status){
        TEAMS.innerHTML = '';
        DATA.dataset.forEach(row => {
            TEAMS.innerHTML += `
                <li class="list-group-item">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-3 ">
                                <img src="${SERVER_URL}images/equipos/${row.logo_equipo}"
                                    class="rounded-circle" width="50px" height="50px" alt="">
                            </div>
                            <div class="col-4">
                                <div class="container ">
                                    <small>${row.NOMBRE}</small>
                                </div>
                            </div>
                            <div class="col-5">
                                <div class="container text-light bg-blue-principal-color rounded-3 text-center d-none d-md-block">
                                    <small>${row.nombre_categoria}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
        `
        });
    }


}

const getUser = async () => {
    const DATA = await fetchData(USER_API, 'getUser');

    if (DATA.status) {
        ADMIN_NAME.textContent = DATA.nombre.split(' ')[0] + ' ' + DATA.apellido.split(' ')[0] // Split nos sirve para cortar un string y que solo aparezca en este caso el primer nombre y primer apellido.
    }
}


    const calendar = async () => {
    
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth'
  });
  calendar.render();

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

    //GRAFICA
    ADMIN_NAME = document.getElementById('nombreAdmin');
    GRAPHIC_TEXT = document.getElementById('graphicText');
    GRAPHIC = document.getElementById('estadistica');
    TEXT = document.getElementById('text');

    //ESTADISTICAS POR EQUIPO
    GANADOS = document.getElementById('ganados');
    PERDIDOS = document.getElementById('perdidos');
    EMPATADOS = document.getElementById('empatados');
    GOLES_CONTRA = document.getElementById('golesContra');
    GOLES_FAVOR = document.getElementById('golesFavor');
    DIFERENCIA = document.getElementById('diferencia');

    //LISTADO DE EQUIPO
    TEAMS = document.getElementById('teams');

    await calendar();
    await getUser();
    await soccerTeams();

    await fillSelect(API_SOCCER, 'readAll', 'equipos');
}