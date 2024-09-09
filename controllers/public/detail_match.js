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
        // Extraer los datos de la respuesta.
        const localidad = DATA.dataset.localidad_partido; // Local o Visitante
        const equipo = DATA.dataset.nombre_equipo;
        const categoriaEquipo = DATA.dataset.nombre_categoria;
        const rival = DATA.dataset.nombre_rival;
        const resultado = DATA.dataset.resultado_partido;
        const logoEquipo = SERVER_URL.concat('images/equipos/', DATA.dataset.logo_equipo);
        const logoRival = SERVER_URL.concat('images/rivales/', DATA.dataset.logo_rival);
        
        // Variables para el resultado ajustado.
        let equipoIzquierda, equipoDerecha, logoIzquierda, logoDerecha, resultadoAjustado, categoriaIzquierda, categoriaDerecha;
        
        if (localidad === 'Local') {
            // Si es local, mantener el orden normal.
            equipoIzquierda = equipo;
            equipoDerecha = rival;
            logoIzquierda = logoEquipo;
            logoDerecha = logoRival;
            resultadoAjustado = resultado;
            categoriaIzquierda = categoriaEquipo;
            categoriaDerecha = '';
        } else {
            // Si es visitante, invertir los equipos y el resultado.
            equipoIzquierda = rival;
            equipoDerecha = equipo;
            logoIzquierda = logoRival;
            logoDerecha = logoEquipo;
            
            // Invertir el resultado (p.ej., de "2-1" a "1-2").
            const goles = resultado.split('-').map(gol => gol.trim());
            resultadoAjustado = `${goles[1]} - ${goles[0]}`;
            categoriaIzquierda = '';
            categoriaDerecha = categoriaEquipo;
        }

        // Actualizar el DOM según la localidad.
        document.getElementById('logo_equipo').src = logoIzquierda;
        document.getElementById('equipo').textContent = equipoIzquierda;
        document.getElementById('resultado').textContent = resultadoAjustado;
        document.getElementById('logo_rival').src = logoDerecha;
        document.getElementById('rival').textContent = equipoDerecha;
        document.getElementById('categoria-izquierda').textContent = categoriaIzquierda;
        document.getElementById('categoria-derecha').textContent = categoriaDerecha;
        document.getElementById('fecha').textContent = DATA.dataset.fecha;
        document.getElementById('temporada').textContent = DATA.dataset.nombre_temporada;
        document.getElementById('fecha-partido').textContent = DATA.dataset.fecha;
        document.getElementById('campo').textContent = DATA.dataset.cancha_partido;
    } else {
        // Manejar el error aquí.
        console.error('Error al obtener los datos del partido.');
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