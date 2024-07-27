let SEARCH_FORM;
let ROWS_FOUND;

// Constantes para completar las rutas de la API.
const API = 'services/technics/jornadas.php';
/* 
Para cargar una lista con la api en php, se hara referencia al metodo ReadAll, del archivo de la api con el cual se quiera
cargar la lista, en este caso en especifico, API se ocuparia para referenciar el link de la api que contenga todos los metodos
para las jornadas en si, mientras que TEMPORADA_API, se ocupara para referenciar el link de la api que contenga el metodo 
ReadAll con el fin de cargar la lista "reciclando" una api que ya existe. 
*/

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/


const lista_select = [
    {
        plantilla: "Plantilla de la liga ADFA San Salvador 2024",
        id: 1,
    },
    {
        plantilla: "Plantilla para la competición internacional Dallas Cup 2024",
        id: 2,
    },
    {
        plantilla: "Plantilla de la copa salesiana 2024",
        id: 3,
    }
];

// Función para poblar un combobox (select) con opciones
const fillSelected = (data, action,selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona la plantilla';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.plantilla; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};


// Variables y constantes para la paginación
const jornadasPorPagina = 10;
let paginaActual = 1;
let jornadas = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_jornadas');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            jornadas = DATA.dataset;
            mostrarJornadas(paginaActual);
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
function mostrarJornadas(pagina) {
    const inicio = (pagina - 1) * jornadasPorPagina;
    const fin = inicio + jornadasPorPagina;
    const jornadasPagina = jornadas.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_jornadas');
    cargarTabla.innerHTML = '';
    jornadasPagina.forEach(row => {
        const tablaHtml = `
                <tr>
                    <td>${row.NUMERO}</td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.FECHA_INICIO}</td>
                    <td>${row.FECHA_FIN}</td>
                    <td>
                    <a href="trainings.html?id=${row.ID}" class="btn transparente">
                    <img src="../../../resources/img/svg/icons_forms/training.svg" width="20" height="20">
                    </a>
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

    const totalPaginas = Math.ceil(jornadas.length / jornadasPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-light" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-light" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-light" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarJornadas(paginaActual);
}
// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const contentHtml = await loadComponent('../components/journey.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = contentHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Jornadas';
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
