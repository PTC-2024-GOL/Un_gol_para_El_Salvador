
// Constantes para completar las rutas de la API.
const API = 'services/admin/convocatorias.php';

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);
let ROWS_FOUND;
//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


const openReportWithParams = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/reporte_parametrizado_convocatoria.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('idPartido', PARAMS.get('idPartido'));
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}
/*
*   Función asíncrona para realizar peticiones a la API.
*   Esta función envia todos los datos del formulario. en forma de arreglos
*/
const guardar = async () => {
    const RESPONSE = await confirmAction('¿Desea guardar la convocatoria?');
    try {
        if (RESPONSE) {
            const FORM = new FormData();
            FORM.append('partido', PARAMS.get('idPartido'));

            // Crear un arreglo para almacenar los datos de los checkbox.
            const convocados = [];
            let marcados = 0;

            // Recorrer todos los inputs de tipo checkbox y agregar los datos al arreglo.
            document.querySelectorAll('input[type="checkbox"]').forEach(input => {
                const jugador = input.id;
                const convocado = input.checked ? 1 : 0; // Asigna 1 si está marcado, 0 si no.

                // Contar los checkboxes marcados.
                if (convocado === 1) {
                    marcados++;
                }

                // Agregar el jugador y el estado del checkbox al arreglo.
                convocados.push({
                    jugador: jugador,
                    convocado: convocado
                });
            });

            // Validar que el número de checkboxes marcados esté entre 14 y 18.
            if (marcados < 14 || marcados > 18) {
                sweetAlert(2, 'Debe seleccionar entre 14 y 18 jugadores.', false);
                return;
            }

            // Agregar el JSON de los convocados al FormData.
            FORM.append('convocatoria', JSON.stringify(convocados));
            console.log(JSON.stringify(convocados));

            // Petición para guardar los datos.
            const DATA = await fetchData(API, 'savesCalls', FORM);
            console.log(DATA);

            if (DATA.status) {
                await sweetAlert(1, DATA.message, true);
                fillTable();
            } else if (!DATA.exception) {
                sweetAlert(2, DATA.error, false);
            } else {
                sweetAlert(2, DATA.exception, false);
            }
        }
    } catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }
};



// Variables y constantes para la paginación
const convocadosPorPagina = 25;
let paginaActual = 1;
let convocados = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable() {
    const cargarTabla = document.getElementById('tabla_convocados');
    try {
        cargarTabla.innerHTML = '';
        // Se define un objeto con los datos de la categoría seleccionada.
        const FORM = new FormData();
        FORM.append('partido', PARAMS.get('idPartido'));
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, 'readAll', FORM);
        console.log(DATA);

        if (DATA.status) {
            convocados = DATA.dataset;
            mostrarconvocados(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
            await sweetAlert(3, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para mostrar técnicos en una página específica
function mostrarconvocados(pagina) {
    const inicio = (pagina - 1) * convocadosPorPagina;
    const fin = inicio + convocadosPorPagina;
    const convocadosPagina = convocados.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_convocados');
    cargarTabla.innerHTML = '';
    convocadosPagina.forEach(row => {
        const checked = row.CONVOCADO == 1 ? 'checked' : ''; // Determina si el checkbox debe estar marcado

        const tablaHtml = `
                <tr>
                    <td>${row.DORSAL}
                    <img src="${SERVER_URL}images/jugadores/${row.FOTO}" height="50" width="50" class="circulo"> ${row.JUGADOR}
                    </td>
                    <td>${row.POSICION_PRINCIPAL}</td>
                    <td>${row.POSICION_SECUNDARIA}</td>
                    <td class="text-center">
                    <input class="form-check-input bg-blue-principal-color rounded-3 fs-5" type="checkbox" name="convocado" id="${row.IDJ}" 
                    value="${row.CONVOCADO}" ${checked}>
                    </input>
                    </td>
                </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;
    });

    actualizarPaginacion();
}

// Función para actualizar los controles de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(convocados.length / convocadosPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarconvocados(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/calls_to_matches.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Convocatoria de jugadores';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
};
