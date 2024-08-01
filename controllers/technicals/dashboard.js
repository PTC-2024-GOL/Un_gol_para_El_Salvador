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

//VARIABLES PARA EL ULTIMO PARTIDO
let MATCH;

let SELECT_MODA;

let SAVE_MODAL;
let SAVE_FORM,
    ID_CALENDARIO,
    TITULO,
    FECHA_INICIO,
    FECHA_FINAL,
    COLOR;

let API_SOCCER = 'services/technics/equipos.php';
let MATCHES_API = 'services/technics/partidos.php';
let CALENDAR_API = 'services/technics/calendario.php';

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

    if (DATA.status) {
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
    } else {
        TEXT.classList.add('d-none');
        GRAPHIC_TEXT.classList.remove('d-none');
        GRAPHIC_TEXT.textContent = DATA.error;
        GRAPHIC.classList.add('d-none');
    }

    //ESTADISTICA

    const DATA2 = await fetchData(MATCHES_API, 'matchesResult', FORM);

    if (DATA2.status) {
        GANADOS.textContent = DATA2.dataset.victorias;
        PERDIDOS.textContent = DATA2.dataset.derrotas;
        EMPATADOS.textContent = DATA2.dataset.empates;
        GOLES_CONTRA.textContent = DATA2.dataset.golesEnContra;
        GOLES_FAVOR.textContent = DATA2.dataset.golesAFavor;
        DIFERENCIA.textContent = DATA2.dataset.diferencia;
    }


}

const soccerTeams = async () => {

    const DATA = await fetchData(API_SOCCER, 'readAll');

    if (DATA.status) {
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
                                    <small>${row.nombre_equipo}</small>
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

const lastMatch = async () => {
    const DATA = await fetchData(MATCHES_API, 'lastMatch');
    if (DATA.status) {
        MATCH.innerHTML = `
                    <div class="container mt-3 p-3">
                    <!-- Primera fila que contiene la fecha -->
                    <div class="row d-flex align-items-center">
                        <div class="col-12 text-center">
                            <p class="mb-0 fw-semibold fs-5">${DATA.dataset.fecha}</p>
                            <p class="fs-6">${DATA.dataset.localidad_partido}</p>
                        </div>
                    </div>
                    <!-- Segunda fila que contiene el resultado -->
                    <div class="row d-flex align-items-center mt-2">
                        <div class="col-1">
                            <img src="${SERVER_URL}images/equipos/${DATA.dataset.logo_equipo}"
                                 class="rounded-circle" width="90px" height="90px" alt="">
                        </div>
                        <div class="col-4">
                            <p class="float-end fs-5">${DATA.dataset.nombre_equipo}</p>
                        </div>
                        <div class="col-2 text-center">
                            <h1 class="text-blue-principal-color fw-semibold">${DATA.dataset.resultado_partido}</h1>
                        </div>
                        <div class="col-4">
                            <p class="float-start fs-5">${DATA.dataset.nombre_rival}</p>
                        </div>
                        <div class="col-1">
                            <img src="${SERVER_URL}images/rivales/${DATA.dataset.logo_rival}"
                                 class="rounded-circle float-end" width="90px" height="90px" alt="">
                        </div>
                    </div>
                </div>
        `
    }
}

const getUser = async () => {
    const DATA = await fetchData(USER_API, 'getUser');

    if (DATA.status) {
        ADMIN_NAME.textContent = DATA.nombre.split(' ')[0] + ' ' + DATA.apellido.split(' ')[0] // Split nos sirve para cortar un string y que solo aparezca en este caso el primer nombre y primer apellido.
    }
}

let title;
let calendarInstance;

const calendar = async () => {
    const initialLocaleCode = 'es';
    const calendarEl = document.getElementById('calendar');
    calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridDay'
        },
        footerToolbar: {
            left: 'addEventButton'
        },
        //Cambio de idioma
        locale: initialLocaleCode,

        //Para ver todos los eventos creados desde la api y se agregan al calendario
        events: async (fetchInfo, successCallback) => {
                const DATA = await fetchData(CALENDAR_API, 'readAll');

                if(DATA.status) {
                    const events = DATA.dataset.map(event => ({
                        title: event.titulo,
                        start: event.fecha_inicio,
                        end: event.fecha_final,
                        backgroundColor: event.color,
                        borderColor: event.color,
                        id: event.id_calendario
                    }));

                    // Pasar los eventos al calendario
                    successCallback(events);
                } else {
                    throw new Error(DATA.error);
                }
        },

        //Agregar evento al calendario
        customButtons: {
            addEventButton: {
                text: 'Agregar evento',
                click: async function() {
                    SAVE_MODAL.show();
                    MODAL_TITLE.textContent = 'Agregar evento'

                    await addOrUpdateEvent();
                }
            }
        },


        //Evento que se activa cuando se hace clic a un evento en el calendario - Para eliminar o editar.
        eventClick: function(info) {
            const action = prompt('¿Qué acción deseas realizar? Escribe "editar" o "eliminar".');

            if (action === 'editar') {
                let newTitle = prompt('Actualizar título:', info.event.title);
                if (newTitle) {
                    let newColor = prompt('Actualizar color:', info.event.backgroundColor);

                    // Actualizar el evento con el nuevo título y color
                    calendarInstance.getEventById(info.event.id).setProp('title', newTitle);
                    calendarInstance.getEventById(info.event.id).setProp('backgroundColor', newColor);

                    alert(`Evento actualizado: ${newTitle}`);
                }
            } else if (action === 'eliminar') {
                if (confirm(`¿Seguro que quieres eliminar el evento "${info.event.title}"?`)) {
                    info.event.remove(); // Eliminar el evento del calendario
                    alert(`Evento "${info.event.title}" eliminado.`);
                }
            } else {
                alert('Acción no válida.');
            }
        }
    });
    calendarInstance.render();

}

//Funcion para actualizar o agregar eventos al calendario
const addOrUpdateEvent = async () => {
    // Creación y actualización del evento
    SAVE_FORM.addEventListener('submit', async (event) => {
        event.preventDefault();
        const FORM = new FormData(SAVE_FORM);
        let action = (ID_CALENDARIO.value) ? 'updateRow' : 'createRow';
        const DATA = await fetchData(CALENDAR_API, action, FORM);

        if (DATA.status) {
            SAVE_MODAL.hide();
            await sweetAlert(1, DATA.message, true);

            // Si la acción fue crear un nuevo evento, lo agregamos al calendario
            if (action === 'createRow') {
                calendarInstance.addEvent({
                    title: TITULO.value,
                    start: FECHA_INICIO.value,
                    end: FECHA_FINAL.value,
                    backgroundColor: COLOR.value,
                    borderColor: COLOR.value,
                });
            } else {
                // Si la acción fue actualizar, buscamos y actualizamos el evento en el calendario
                let existingEvent = calendarInstance.getEventById(ID_CALENDARIO.value);
                if (existingEvent) {
                    existingEvent.setProp('title', TITULO.value);
                    existingEvent.setStart(FECHA_INICIO.value);
                    existingEvent.setEnd(FECHA_FINAL.value);
                    existingEvent.setProp('backgroundColor', COLOR.value);
                    existingEvent.setProp('borderColor', COLOR.value);
                }
            }

        } else {
            await sweetAlert(2, DATA.error, true);
        }
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

    //PARTIDO
    MATCH = document.getElementById('match');

    await calendar();
    await getUser();
    await soccerTeams();
    await lastMatch();

    await fillSelect(API_SOCCER, 'readAll', 'equipos');

    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SAVE_FORM = document.getElementById('saveForm'),
        ID_CALENDARIO = document.getElementById('idCalendario'),
        TITULO = document.getElementById('titulo'),
        FECHA_INICIO = document.getElementById('fechaI'),
        FECHA_FINAL = document.getElementById('fechaF'),
        COLOR = document.getElementById('color');
}