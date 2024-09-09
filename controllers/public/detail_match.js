//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const PARTIDO_API = 'services/public/partidos.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);

async function readMatch() {

    // Constante tipo objeto con los datos del producto seleccionado.
    const FORM = new FormData();
    FORM.append('idPartido', PARAMS.get('id'));
    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(PARTIDO_API, 'readOnePublic', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se colocan los datos en la página web de acuerdo con el producto seleccionado previamente.
        document.getElementById('logo_equipo').src = SERVER_URL.concat('images/equipos/', DATA.dataset.logo_equipo);
        document.getElementById('equipo').textContent = DATA.dataset.nombre_equipo;
        document.getElementById('categoria').textContent = DATA.dataset.nombre_categoria;
        document.getElementById('resultado').textContent = DATA.dataset.resultado_partido;
        document.getElementById('logo_rival').src = SERVER_URL.concat('images/rivales/', DATA.dataset.logo_rival);
        document.getElementById('rival').textContent = DATA.dataset.nombre_rival;
        document.getElementById('fecha').textContent = DATA.dataset.fecha;
        document.getElementById('temporada').textContent = DATA.dataset.nombre_temporada;
        document.getElementById('fecha-partido').textContent = DATA.dataset.fecha;
        document.getElementById('campo').textContent = DATA.dataset.cancha_partido;
    } else {

    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const homeHtml = await loadComponent('../components/detail_match.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    readMatch();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = homeHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Detalle del partido';
};