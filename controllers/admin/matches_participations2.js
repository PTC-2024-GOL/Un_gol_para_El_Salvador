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

// Constantes para completar las rutas de la API.
const PARTIDO_API = 'services/admin/partidos.php';


async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


async function fillCards() {

    const cargarCartas = document.getElementById('matches_cards');

    try {
        cargarCartas.innerHTML = '';
        // Se verifica la acción a realizar.
        const form = new FormData();
        form.append('idEquipo', idEquipo);

        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTIDO_API, 'readAllByIdEquipos', form);

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
                            <p class="fw-semibold mb-0">${row.fecha_partido}</p>
                            <p class="small">${row.localidad_partido}</p>
                        </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-4">
                            <img src="${SERVER_URL}images/equipos/${row.logo_equipo}" class="img">
                            <p class="small mt-3">${row.nombre_equipo}</p>
                        </div>
                        <div class="col-4">
                            <h2 class="fw-semibold">${row.resultado_partido}</h2>
                        </div>
                        <div class="col-4">
                            <img src="${SERVER_URL}images/partidos/${row.logo_rival}" class="img">
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
        } else {
            await sweetAlert(3, DATA.error, true, '../../../views/admin/pages/matches_participations1.html');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

async function searchMatches(form = null) {

    const cargarCartas = document.getElementById('matches_cards');

        cargarCartas.innerHTML = '';

        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTIDO_API, 'searchRows', form);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                idPartido = row.id_partido;

                const cardsHtml =  `<div class="col-md-6 col-sm-12">
                <div class="tarjetas p-4">
                    <div class="row">
                        <div class="col-auto">
                            <img src="../../../resources/img/svg/calendar.svg" alt="">
                        </div>
                        <div class="col">
                            <p class="fw-semibold mb-0">${row.fecha}</p>
                            <p class="small">${row.localidad_partido}</p>
                        </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-4">
                            <img src="${SERVER_URL}images/equipos/${row.logo_equipo}" class="img">
                            <p class="small mt-3">${row.nombre_equipo}</p>
                        </div>
                        <div class="col-4">
                            <h2 class="fw-semibold">${row.resultado_partido}</h2>
                        </div>
                        <div class="col-4">
                            <img src="${SERVER_URL}images/partidos/${row.logo_rival}" class="img">
                            <p class="small mt-3">${row.nombre_rival}</p>
                        </div>
                    </div>
                    <hr>
                    <button class="btn bg-blue-principal-color text-white btn-sm rounded-3"  onclick="goToPlayers(idPartido)">
                        Agregar participaciones
                    </button>
                </div>
                </div>
              `;
                cargarCartas.innerHTML += cardsHtml;
            });
        } else {
            await sweetAlert(3, DATA.error, true);
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
    await fillCards();

    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');

    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);

        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        searchMatches(FORM);
    });
}
