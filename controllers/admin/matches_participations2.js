// Recibimos los parametros
const params = new URLSearchParams(window.location.search);
const idEquipo = params.get("idEquipo");
let idPartido;



let ID_PARTIDO,
    ID_EQUIPO,
    LOGO_EQUIPO;

let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const PARTIDO_API = 'services/admin/partidos.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const openReportWithParams = (id) => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/reporte_parametrizado_participaciones.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('idPartido', id);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

// Manejo para la paginacion
const matchesByPage = 10;
let currentPage = 1;
let matches = [];

function showMatches(page) {
    const start = (page - 1) * matchesByPage;
    const end = start + matchesByPage;
    const matchesPage = matches.slice(start, end);

    const fillTable = document.getElementById('matches_cards');
    fillTable.innerHTML = '';
    matchesPage.forEach(row => {
        const tablaHtml = `
                <tr>
                <div class="col-md-6 col-sm-12">
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
                            <img src="${SERVER_URL}images/rivales/${row.logo_rival}" class="img">
                            <p class="small mt-3">${row.nombre_rival}</p>
                        </div>
                    </div>
                    <hr>
                    <button class="btn bg-blue-secondary-color text-white btn-sm rounded-3" onclick="openReportWithParams(${row.id_partido})" >Generar reporte</button>
                    <button class="btn bg-blue-principal-color text-white btn-sm rounded-3"  onclick="goToPlayers(${row.id_partido})">
                        Agregar participaciones
                    </button>
                </div>
                </div>
                </tr>
                `;
        fillTable.innerHTML += tablaHtml;
    });

    updatePaginate();
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
            matches = DATA.dataset;
            showMatches(currentPage);
        } else {
            await sweetAlert(3, DATA.error, true, '../../../views/admin/pages/matches_participations1.html');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para actualizar los contlesiones de paginación
function updatePaginate() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(matches.length / matchesByPage);

    if (currentPage > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${i})">${i}</a></li>`;
    }

    if (currentPage < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function nextPage(newPage) {
    currentPage = newPage;
    showMatches(currentPage);
}

// Creamos una funcion que recibe como parametro el id del equipo que fue seleccionado
function goToPlayers(idPartido) {

    // Redirecciona a la otra pantalla y manda tambien el id del equipo
    window.location.href = `../pages/matches_participations3.html?idPartido=${idPartido}&idEquipo=${idEquipo}`;
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

    // // Método del evento para cuando se envía el formulario de buscar.
    // SEARCH_FORM.addEventListener('submit', async (event) => {
    //     // Se evita recargar la página web después de enviar el formulario.
    //     event.preventDefault();
    //
    //     const FORM = new FormData(SEARCH_FORM);
    //
    //     // Petición para obtener los registros disponibles.
    //     const DATA = await fetchData(PARTIDO_API, 'searchRows', FORM);
    //
    //     if (DATA.status) {
    //         matches = DATA.dataset;
    //         showMatches(currentPage);
    //     } else {
    //         await sweetAlert(3, DATA.error, true);
    //     }
    // });
}
