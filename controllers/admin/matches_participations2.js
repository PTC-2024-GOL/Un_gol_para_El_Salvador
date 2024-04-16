// Recibimos los parametros
const params = new URLSearchParams(window.location.search);
const idEquipo = params.get("idEquipo");
const nombreEquipo = params.get("nombreEquipo");


let ID_PARTIDO,
    ID_EQUIPO,
    LOGO_RIVAL,
    LOGO_EQUIPO,
    NOMBRE_RIVAL,
    FECHA,
    LOCALIDAD,
    RESULTADO;

const API = '';
const MATCHES_API = '';


async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

async function fillCards(form = null) {
    const lista_datos = [
        {
            fecha: '14 de nov de 2023',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre_equipo: nombreEquipo,
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
            nombre_rival: 'Monaco',
            localidad: 'Visitante',
            resultado: '5 : 2',
            id_equipo: idEquipo,
            id_partido: 1,
        },
        {
            fecha: '14 de nov de 2023',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre_equipo: 'Un gol para El Salvador',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
            nombre_rival: 'Monaco',
            resultado: '5 : 2',
            localidad: 'Visitante',
            id_equipo: 1,
            id_partido: 1,
        },
        {
            fecha: '14 de nov de 2023',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre_equipo: 'Un gol para El Salvador',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
            nombre_rival: 'Monaco',
            resultado: '5 : 2',
            localidad: 'Visitante',
            id_equipo: 1,
            id_partido: 1,
        },
        {
            fecha: '14 de nov de 2023',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre_equipo: 'Un gol para El Salvador',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
            nombre_rival: 'Monaco',
            resultado: '5 : 2',
            localidad: 'Visitante',
            id_equipo: 1,
            id_partido: 1,
        }
    ];
    const cargarCartas = document.getElementById('matches_cards');

    try {
        cargarCartas.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const cardsHtml =  `<div class="col-md-6 col-sm-12">
                <div class="tarjetas p-4">
                    <div class="row">
                        <div class="col-auto">
                            <img src="../../../resources/img/svg/calendar.svg" alt="">
                        </div>
                        <div class="col">
                            <p class="fw-semibold mb-0">${row.FECHA}</p>
                            <p class="small">${row.LOCALIDAD}</p>
                        </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-4">
                            <img src="${row.LOGO_EQUIPO}" class="img">
                            <p class="small mt-3">${row.NOMBRE_EQUIPO}</p>
                        </div>
                        <div class="col-4">
                            <h2 class="fw-semibold">${row.RESULTADO}</h2>
                        </div>
                        <div class="col-4">
                            <img src="${row.LOGO_RIVAL}" class="img">
                            <p class="small mt-3">${row.NOMBRE_RIVAL}</p>
                        </div>
                    </div>
                    <hr>
                    <button class="btn bg-blue-principal-color text-white btn-sm rounded-3"  onclick="goToPlayers(${row.id_partido})">
                        Agregar participaciones
                    </button>
                </div>
                </div>
              `;
                cargarCartas.innerHTML += cardsHtml;
            });
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const cardsHtml = `<div class="col-md-6 col-sm-12">
            <div class="tarjetas shadow p-4">
                <div class="row">
                    <div class="col-auto">
                        <img src="../../../resources/img/svg/calendar.svg" alt="">
                    </div>
                    <div class="col">
                        <p class="fw-semibold mb-0">${row.fecha}</p>
                        <p class="small">${row.localidad}</p>
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-4">
                        <img src="${row.logo}" class="img">
                        <p class="small mt-3">${row.nombre_equipo}</p>
                    </div>
                    <div class="col-4">
                        <h2 class="fw-semibold">${row.resultado}</h2>
                    </div>
                    <div class="col-4">
                        <img src="${row.logo_rival}" class="img">
                        <p class="small mt-3">${row.nombre_rival}</p>
                    </div>
                </div>
                <hr>
                <button class="btn bg-blue-principal-color text-white btn-sm rounded-3"  onclick="goToPlayers(${row.id_partido})">
                    Agregar participaciones
                </button>
            </div>
            </div>
          `;
            cargarCartas.innerHTML += cardsHtml;
        });
    }
}

// Creamos una funcion que recibe como parametro el id del equipo que fue seleccionado
function goToPlayers(idParticipacion) {
  
    // Redirecciona a la otra pantalla y manda tambien el id del equipo
    window.location.href = "../pages/matches_participations3.html?idParticipacion=" + idParticipacion;
}

window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const participacionesHtml = await loadComponent('../components/matches_participations2.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = participacionesHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Participaciones'; 
    fillCards();
}
