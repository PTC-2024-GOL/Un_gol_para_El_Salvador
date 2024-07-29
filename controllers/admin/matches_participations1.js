
let HIDDEN;

// Constantes para completar las rutas de la API.
const SOCCER_TEAM_API = 'services/admin/equipos.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Manejo para la paginacion
const soccerTeamByPage = 10;
let currentPage = 1;
let soccerTeam = [];


function showSoccerTeam(page) {
    const start = (page - 1) * soccerTeamByPage;
    const end = start + soccerTeamByPage;
    const soccerTeamPage = soccerTeam.slice(start, end);

    const fillTable = document.getElementById('cards');
    fillTable.innerHTML = '';
    soccerTeamPage.forEach(row => {
        const tablaHtml = `
                <tr>
                    <div class="col-md-3 col-sm-12">
                        <div class="tarjetas-equipos shadow " onclick="goToMatches(${row.ID})"> 
                            <img src="${SERVER_URL}images/equipos/${row.logo_equipo}" id="imagenEquipo" width="160px" height="160px" class="rounded-circle p-4"> 
                            <p class="titulo-equipo text-light p-2" id="tituloEquipo">${row.NOMBRE}</p> 
                        </div>
                    </div>
                `;
        fillTable.innerHTML += tablaHtml;
    });

    updatePaginate();
}

// Funcion que muestra todos los equipos registrados
async function fillCards(form = null) {
    HIDDEN = document.getElementById('hiddenElement');

    HIDDEN.classList.add('d-none');

    const cargarCartas = document.getElementById('cards');

    try {
        cargarCartas.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(SOCCER_TEAM_API, action, form);

        if (DATA.status) {
            soccerTeam = DATA.dataset;
            showSoccerTeam(currentPage);
        } else {
            await sweetAlert(4, DATA.error, true);
            HIDDEN.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para actualizar los contlesiones de paginación
function updatePaginate() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(soccerTeam.length / soccerTeamByPage);

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
    showSoccerTeam(currentPage);
}


// Creamos una funcion que recibe como parametro el id y nombre del equipo que fue seleccionado y se los manda a la siguiente pantalla
function goToMatches(idEquipo) {

    // Redirecciona a la otra pantalla y manda tambien el id del equipo
    window.location.href = `../pages/matches_participations2.html?idEquipo=${idEquipo}`;

}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const participacionesHtml = await loadComponent('../components/matches_participations1.html');

    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = participacionesHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Participaciones';
    await fillCards();

    HIDDEN = document.getElementById('hiddenElement');

    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');

    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);

        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillCards(FORM);
    });
};




