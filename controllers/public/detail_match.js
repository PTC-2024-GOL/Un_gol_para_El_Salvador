//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const PARTIDO_API = 'services/public/partidos.php';
const PARTICIPACIONES_API = 'services/public/participaciones.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);

// Función para leer el detalle de partido
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

// Función para cargar las estadisticas
async function cargarEstadisticas() {
    try {
        const productCardsContainer = document.getElementById('stats-cards');
        productCardsContainer.innerHTML = '';
        // Constante tipo objeto con los datos del producto seleccionado.
        const FORM = new FormData();
        FORM.append('idPartido', PARAMS.get('id'));
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTICIPACIONES_API, "participationMatch", FORM);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(row => {
                const cardHtml = `
                    <div class="col-sm-6 col-md-6">
                        <div class="shadow rounded-5">
                                <div class="row p-3 align-items-center">
                                    <div class="col-4 ">
                                    <img src="${SERVER_URL}images/jugadores/${row.foto_jugador}" height="120px" width="120px" id="imgJugador">
                                    </div>
                                <div class="col-8">
                                <div class="row align-items-center">
                                    <div class="col-9">
                                        <small class="text-blue-color">${row.posicion}</small>
                                        <p class="fw-semibold mb-0">${row.jugador}</p>
                                        <p class="mb-0">⏱️ ${row.minutos_jugados} ${getTitular(row.titular)}</p>
                                    </div>
                                    <div class="col-2 text-center">
                                        <div class="bg-blue-principal-color text-light rounded-circle" id="dorsal">
                                            <div class="fs-6">${row.dorsal_jugador}</div>
                                        </div>
                                    </div>
                                </div>                             
                                    <hr>
                                    <div class="d-flex mt-3 justify-content-center">
                                    <button type="button" class="btn transparente mx-2">
                                       ${row.goles} <img src="../../../resources/img/svg/icons_forms/ball.svg" width="20" height="20">
                                    </button>
                                    <button type="button" class="btn transparente mx-2">
                                       ${row.asistencias} <img src="../../../resources/img/png/public/shoes.png" width="35" height="35">
                                    </button>
                                    <button type="button" class="btn bg-yellow-color mx-2" id="btnOpenAmonestacion_${row.id_jugador}" onclick="openAmonestaciones(${row.idParticipacion})">
                                       ${row.tarjetas_amarillas} <img src="../../../resources/img/svg/icons_forms/amonestacion.svg" width="20" height="20">
                                    </button>
                                    <button type="button" class="btn bg-red-cream-color mx-2" id="btnOpenAmonestacion_${row.id_jugador}" onclick="openAmonestaciones(${row.idParticipacion})">
                                       ${row.tarjetas_rojas} <img src="../../../resources/img/svg/icons_forms/amonestacion.svg" width="20" height="20">
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productCardsContainer.innerHTML += cardHtml;
            });
        } else {
            console.log("Error al obtener datos");
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para verificar si el jugador fue titular o suplente
function getTitular(titular) {
    switch (titular) {
        case "0":
            return '🔄️ entro de cambio';
        case "1":
            return '🏃🏻‍♂️ titular';
        default:
            return '';
    }
}

// Función para cargar los jugadores en la alineación
async function cargarAlineacion() {
    try {
        const productCardsContainer = document.getElementById('players-cards');
        productCardsContainer.innerHTML = '';
        // Constante tipo objeto con los datos del producto seleccionado.
        const FORM = new FormData();
        FORM.append('idPartido', PARAMS.get('id'));
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTICIPACIONES_API, "alineacionPartido", FORM);
        console.log(DATA);
        if (DATA.status) {
            let defensa = 8;
            let central = 25;
            let mediocentro = 8;
            let extremo = 8;
            let delantero = 36;

            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(row => {
                let golesHtml = '';
                let asistenciasHtml = '';
                let amarillasHtml = '';
                let rojasHtml = '';

                if (row.goles > 0) {
                    for (let i = 0; i < row.goles; i++) {
                        golesHtml += '⚽ ';
                    }
                }
                
                if (row.asistencias > 0) {
                    for (let i = 0; i < row.asistencias; i++) {
                        asistenciasHtml += '👟 '; 
                    }
                }

                if (row.tarjetas_amarillas > 0) {
                    for (let i = 0; i < row.tarjetas_amarillas; i++) {
                        amarillasHtml += '🟨 '; 
                    }
                }

                if (row.tarjetas_rojas > 0) {
                    for (let i = 0; i < row.tarjetas_rojas; i++) {
                        rojasHtml += '🟥 '; 
                    }
                }
                const cardHtml = `
                    <div class="card player-card" 
                    style="
                        top: ${row.posicion == "Portero" ? "40%" 
                        : row.posicion == "Defensa" ? defensa + "%" 
                        : row.posicion == "Central" ? central + "%" 
                        : row.posicion == "Mediocampista" ? mediocentro + "%" 
                        : row.posicion == "Extremo" ? extremo + "%" 
                        : delantero + "%"}; 
                        left: ${row.posicion == "Portero" ? "6%" 
                        : row.posicion == "Defensa" ? "37%" 
                        : row.posicion == "Central" ? "22%" 
                        : row.posicion == "Mediocampista" ? "56%" 
                        : row.posicion == "Extremo" ? "75%" : "75%"};">
                        <div class="card-header p-1 text-center">
                            <p class="card-text">${row.posicion}</p>
                        </div>
                        <div class="card-body p-1 text-center">
                            <img src="${SERVER_URL}images/jugadores/${row.foto_jugador}" class="card-img-top" alt="${row.jugador}">
                        </div>
                        <div class="card-footer p-1 text-center">
                            <p class="card-text">${row.jugador} 
                            ${golesHtml} ${asistenciasHtml} ${amarillasHtml} ${rojasHtml}</p>
                        </div>
                    </div>
                `;

                productCardsContainer.innerHTML += cardHtml;

                // Ajustar las posiciones de las cartas
                if (row.posicion == "Defensa") {
                    defensa += 60;
                } else if (row.posicion == "Central") {
                    central += 30;
                } else if (row.posicion == "Mediocampista") {
                    mediocentro += 30;
                } else if (row.posicion == "Extremo") {
                    extremo += 60;
                } else if (row.posicion == "Delantero") {
                    delantero += 20;
                }
            });
        } else {
            console.log("Error al obtener datos");
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
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
    cargarEstadisticas();
    cargarAlineacion();
};