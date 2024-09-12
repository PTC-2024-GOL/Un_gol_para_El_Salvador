let PARAMS = new URLSearchParams(location.search);
let EQUIPO;
let CATEGORIA;
let IMAGEN;

let BTN_PARTIDOS;
let BTN_JUGADORES;

const PARTIDO_API = 'services/public/partidos.php';
const PARTICIPACION_API = 'services/public/participaciones.php';

let cargarCards;
let noData;

let jugadoresContainer;
let partidosContainer;

//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const fillParticipations = async (idPosicion) => {
    noData.innerHTML = '';
    const cargarCards = document.getElementById('rowCards2');

    let FORM = new FormData();
    let option;

    FORM.append('idEquipo', PARAMS.get('id'));

    cargarCards.innerHTML = ''
    if(idPosicion){
        FORM.append('idPosicion', idPosicion);
        option = 'filterAllParticipationPublic';
    }else{
        option = 'readAllParticipation'
    }

    const DATA = await fetchData(PARTICIPACION_API, option, FORM);
    if(DATA.status){
        let data = DATA.dataset;
        data.forEach(row =>{
            const cardsHtml = `
            <div class="col-md-4 col-sm-12">
            <div class="carta ps-3 pe-3 pt-3 pb-3 shadow rounded-4 mb-5">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <img class="rounded-circle" src="${SERVER_URL}images/jugadores/${row.foto_jugador}" width="80" height="80">
                    </div>
                    <div class="col">
                        <h5>${row.nombre}</h5>
                        <p class="mb-0">${row.posicion}</p>
                    </div>
                </div>
                <div id="totalRows" class="mt-3">
                    <div class="col-4 text-center bg-blue-light-color rounded-3">
                        <p class="bg-blue-principal-color text-light p-1 rounded-3">Asistencias</p>
                        <p>${row.asistencias}</p>
                    </div>
                    <div class="col-4 text-center bg-blue-light-color rounded-3 mx-1">
                        <p class="bg-blue-principal-color text-light p-1 rounded-3">Goles</p>
                        <p>${row.goles}</p>
                    </div>
                    <div class="col-4 text-center bg-blue-light-color rounded-3">
                        <p class="bg-blue-principal-color text-light p-1 rounded-3">Partidos</p>
                        <p>${row.partidos}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <p class="text-light bg-yellow-principal-color p-2 rounded-3 mb-2">${row.tarjetas_amarillas} Tarjetas amarillas</p>
                    <p class="text-light bg-red-cream-color p-2 rounded-3">${row.tarjetas_rojas} Tarjetas rojas</p>
                </div>
            </div>
        </div>
            `
            cargarCards.innerHTML += cardsHtml;
        })
    }else{
        noData.innerHTML = `
            <div class="d-flex justify-content-center">
                <p class="bg-blue-light-color rounded-3 p-3">No hay jugadores en esta posición</p>
            <div/>
        `
    }
}

const selectedFilter = async (element) => {
    // Remover la clase 'active' de cualquier elemento seleccionado previamente
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(item => item.classList.remove('active'));

    // Agregar la clase 'active' al elemento seleccionado
    element.classList.add('active');

    // Obtener el ID de la posición del elemento seleccionado
    const idPosicion = element.querySelector('p').innerText;
    console.log('ID Posición seleccionado:', idPosicion);

    if(idPosicion === '0') {
        await fillParticipations();
        console.log('Todos')
    }else{
        await fillParticipations(idPosicion);
    }

}

const fillNav = async () => {
    const cargarNav = document.getElementById('positionsNav');
    cargarNav.innerHTML = '';

    const staticItem = `
        <li class="nav-item" onclick="selectedFilter(this)">
            <p class="d-none">0</p> <!-- id fijo -->
            <a class="nav-link text-dark" href="#">Todos</a> <!-- Texto fijo -->
        </li>
    `;
    cargarNav.innerHTML += staticItem;

    const DATA = await fetchData(PARTICIPACION_API, 'positionParticipation');
    if(DATA.status){
        let data = DATA.dataset;
        data.forEach(row => {
            const navigationHtml =`
                <li class="nav-item" onclick="selectedFilter(this)">
                    <p class="d-none">${row.id_posicion}</p>
                    <a class="nav-link text-dark" href="#">${row.posicion}</a>
                </li>
            `
            cargarNav.innerHTML += navigationHtml;
        })
    }else{
        console.log(DATA.error)
    }
}

const showMatches = async () => {
    cargarCards.innerHTML = '';
    let FORM = new FormData();
    FORM.append('idEquipo', PARAMS.get('id'));
    console.log(PARAMS.get('id'));
    const DATA = await fetchData(PARTIDO_API, 'readAllByIdEquiposTop20', FORM);
    console.log(DATA);
    if (DATA.status) {
        let data = DATA.dataset;
        //Agarra el primer elemento del array para obtener el nombre del equipo y la categoria
        EQUIPO = data[0].nombre_equipo;
        CATEGORIA = data[0].nombre_categoria;
        IMAGEN = data[0].logo_equipo;
        console.log(data);
        data.forEach(row => {
            const cardsHtml = `
            <div class="col-sm-6 col-md-4 mb-4">
                <div class="cards shadow p-3 border border-dark-subtle">
                    <div class="header text-center">
                        <p class="fw-semibold mb-0 text-secondary">${row.fecha}</p>
                        <p class="fw-light">${row.nombre_categoria}</p>
                    </div>
                    <div class="row justify-content-center text-center">
                        <div class="col-md-4">
                            <img class="rounded-circle img-fluid" src="${SERVER_URL}images/equipos/${row.logo_equipo}" width="80px">
                            <p>${row.nombre_equipo}</p>
                        </div>
                        <div class="col-md-4">
                            <h1 class="fw-bold text-secondary">${row.resultado_partido}</h1>
                        </div>
                        <div class="col-md-4">
                            <img class="rounded-circle img-fluid" src="${SERVER_URL}images/rivales/${row.logo_rival}" width="80px">
                            <p>${row.nombre_rival}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center pe-3 ps-3 mt-2 mb-2">
                        <a href="detail_match.html?id=${row.id_partido}" class="btn btn-outline-secondary">Ir al partido</a>
                    </div>
                </div>
            </div>
            `;
            cargarCards.innerHTML += cardsHtml;
        })
    } else {
        const DATA = await fetchData(PARTIDO_API, 'readPartidoSinEquipo', FORM);
        if(DATA.status)
        {
            
        let data = DATA.dataset;
        console.log(data, ' Esta es la data');
        //Agarra el primer elemento del array para obtener el nombre del equipo y la categoria
        EQUIPO = data.nombre_equipo;
        CATEGORIA = data.nombre_categoria;
        IMAGEN = data.logo_equipo;
        cargarCards.innerHTML = `
        <div class="d-flex justify-content-center">
            <p class="bg-blue-light-color rounded-3 p-3">No hay partidos registrados</p>
        <div/>
    `;
        }
    }
}

const jugadoresClicked = () => {
    BTN_PARTIDOS.classList.remove('btn-light');
    BTN_PARTIDOS.classList.add('btn-outline-light');

    jugadoresContainer.classList.remove('d-none');
    partidosContainer.classList.add('d-none');

    BTN_JUGADORES.classList.remove('btn-outline-light');
    BTN_JUGADORES.classList.add('btn-light');
}
const partidoClicked = () => {
    BTN_JUGADORES.classList.remove('btn-light');
    BTN_JUGADORES.classList.add('btn-outline-light')

    partidosContainer.classList.remove('d-none');
    jugadoresContainer.classList.add('d-none');

    BTN_PARTIDOS.classList.remove('btn-outline-light');
    BTN_PARTIDOS.classList.add('btn-light');
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const homeHtml = await loadComponent('../components/matches.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = homeHtml;
    const titleElement = document.getElementById('title');
    const nombreEquipo = document.getElementById('nombreEquipo');
    const nombreCategoria = document.getElementById('nombreCategoria');
    cargarCards = document.getElementById('rowCards');
    noData = document.getElementById('noData')
    jugadoresContainer = document.getElementById('jugadorContainer');
    partidosContainer = document.getElementById('partidosContainer');

    BTN_PARTIDOS = document.getElementById('partidos');
    BTN_JUGADORES = document.getElementById('jugadores')

    await showMatches();
    await fillParticipations();
    await fillNav();
    titleElement.textContent = 'Partidos de ' + EQUIPO;
    nombreEquipo.textContent = EQUIPO;
    nombreCategoria.textContent = CATEGORIA;
    const imagenEquipo = document.getElementById('imagen');
    imagenEquipo.insertAdjacentHTML('beforeend', `<img src="${SERVER_URL}images/equipos/${IMAGEN}" alt="logo" class="me-2 rounded-circle" style="width: 90px; height: 90px;">`);
};
