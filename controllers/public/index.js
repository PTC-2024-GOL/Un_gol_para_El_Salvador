const PARTIDO_API = 'services/public/partidos.php';

//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const showMatches = async () => {
    const cargarCards = document.getElementById('rowCards');
    cargarCards.innerHTML = '';
    const DATA = await fetchData(PARTIDO_API, 'readAllTheLast5');
    if(DATA.status){
        let data = DATA.dataset;
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
                            <img class="rounded-circle" src="${SERVER_URL}images/equipos/${row.logo_equipo}" width="80px">
                        </div>
                        <div class="col-md-4">
                            <h1 class="fw-bold text-secondary">${row.resultado_partido}</h1>
                        </div>
                        <div class="col-md-4">
                            <img class="rounded-circle" src="${SERVER_URL}images/rivales/${row.logo_rival}" width="80px">
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
        console.log('Algo paso')
    }

}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const homeHtml = await loadComponent('../components/index.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = homeHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Inicio';
    await showMatches();
};
