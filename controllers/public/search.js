// Recibimos los parametros
const params = new URLSearchParams(window.location.search);
const search = params.get("search");

let currentSearch;
let noData;
let debounceTimer; // Variable para almacenar el temporizador del debounce

const PARTIDO_API = 'services/public/partidos.php';

//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const searchWord = async () => {

    const cargarCards = document.getElementById('matchesCard');
    noData.innerHTML = '';

    cargarCards.innerHTML = '';
    const form = new FormData();
    form.append('search', currentSearch.value);

    const DATA = await fetchData(PARTIDO_API, 'searchRows', form);
    if(DATA.status){
        let data = DATA.dataset;
        data.forEach(row =>{
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
            `
            cargarCards.innerHTML += cardsHtml;
        })
    }else{
        noData.innerHTML = `
            <div class="p-4">
                <p class="fw-semibold">No hay resultado para tú búsqueda. Intenta con otra palabra.</p>
            </div>
        `
    }
}

// Función para manejar el debounce
function handleSearchDebounced() {
    clearTimeout(debounceTimer); // Limpiar el temporizador anterior
    debounceTimer = setTimeout(async () => {
        await searchWord();
    }, 10000); // 500 ms de retraso antes de hacer la búsqueda
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const homeHtml = await loadComponent('../components/search.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = homeHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Búsqueda';

    currentSearch = document.getElementById('search2');
    noData = document.getElementById('noData');

    currentSearch.value = search;

    // Llama a searchWord() cuando se complete la escritura
    currentSearch.addEventListener('input', handleSearchDebounced);

    // Si hay un valor inicial en el parámetro "search", realizar la búsqueda
    if (search) {
        await searchWord();
    }
};