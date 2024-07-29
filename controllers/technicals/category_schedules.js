let SAVE_MODAL;
let SAVE_FORM,
    ID_HORARIO_CAT,
    HORARIO,
    CATEGORIA;
let SEARCH_FORM;
let ROWS_FOUND;

// Constantes para completar las rutas de la API.
const API = 'services/technics/horarios_categoria.php';
const CATEGORIA_API = 'services/technics/categorias.php';
const HORARIO_API = 'services/technics/horarios.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Variables y constantes para la paginación
const horariosCatPorPagina = 10;
let paginaActual = 1;
let horariosCate = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_horarios_cat');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            horariosCate = DATA.dataset;
            mostrarHorariosCate(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para mostrar técnicos en una página específica
function mostrarHorariosCate(pagina) {
    const inicio = (pagina - 1) * horariosCatPorPagina;
    const fin = inicio + horariosCatPorPagina;
    const horariosCatPagina = horariosCate.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_horarios_cat');
    cargarTabla.innerHTML = '';
    horariosCatPagina.forEach(row => {
        const tablaHtml = `
                <tr>
                    <td>${row.nombre_categoria}</td>
                    <td>${row.nombre_horario}</td>
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

    const totalPaginas = Math.ceil(horariosCate.length / horariosCatPorPagina);

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
    mostrarHorariosCate(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const posicionHtml = await loadComponent('../components/category_schedules.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = posicionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Horarios de las categorías';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');
    // Verificar si SEARCH_FORM está seleccionado correctamente
    console.log(SEARCH_FORM)
    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);
        console.log(SEARCH_FORM);
        console.log(FORM);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillTable(FORM);
    });
};
