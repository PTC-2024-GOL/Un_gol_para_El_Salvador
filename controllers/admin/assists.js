let SAVE_MODAL;
let SAVE_FORM,
    ID_CATEGORIA,
    EQUIPO,
    CATEGORIA,
    HORARIO,
    SEE_MODAL;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const DETALLE_CONTENIDO_API = 'services/admin/detalle_contenido.php';

// Lista de datos para mostrar en la tabla de horarios
const lista_datos_horario = [
    {
        horario: "8:00 AM- 10:20 AM",
        id: 1,
    },
    {
        horario: '1:30 PM - 3_00 PM',
        id: 2,
    },
    {
        horario: '4:00 PM- 6:30 PM',
        id: 3,
    }
];


//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

/*
*   Función para abrir la página de detalles específicos.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
//
// Función para abrir la página de detalles específicos.
const openPag = () => {
    id_entrenamiento = document.getElementById('horario').value;
    window.location.href = `../pages/specific_assistens.html?id_entrenamiento=${id_entrenamiento}`;
}

// Funcion para preparar el formulario al momento de abrirlo
/*
*   Función asíncrona para preparar el formulario al momento de elegir un horario.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idEquipo', id);
    
        // Petición para obtener los datos del registro solicitado.
        await fillSelectPost(DETALLE_CONTENIDO_API, 'readOneHorario', 'horario', FORM);
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Elegir entrenamiento';
            const DATA2 = await fetchData(DETALLE_CONTENIDO_API, 'readlastAssists', FORM);
        if (DATA2.status) {
            CHART.classList.remove('d-none');
            datos = DATA2.dataset;
            console.log('Estos son los datos de la variable', datos);
            let mes = [];
            let cantidad = [];
            DATA2.dataset.forEach(row => {
                mes.push(row.fecha);
                //Formatea asistencias a número
                cantidad.push(Number(row.asistencia));
            });
            console.log('Estos son los datos de la variable', mes);
            console.log('Estos son los datos de la variable', cantidad);
            lineTwoGraph('myChart', mes, cantidad, 'Asistencias', 'Asistencias', 'fechas');
    
            console.log('Llegue después de la grafica');
        } else {
            CHART.classList.add('d-none');
        }
    } catch (Error) {
        console.log(Error);
        SEE_MODAL.show();
        MODAL_TITLE.textContent = 'Elegir horario cuando error';
        SEE_FORM.reset();
    }
}

//Crea un comentario que describa la función llamada cargarTabla
/*
*   Función asíncrona para cargar la tabla de detalles de contenidos.
*   Parámetros: form (formulario de búsqueda).
*   Retorno: ninguno.
*/
// Manejo para la paginacion
const injuriesByPage = 10;
let currentPage = 1;
let injuries = [];

function showInjuries(page) {
    const start = (page - 1) * injuriesByPage;
    const end = start + injuriesByPage;
    const injuriesPage = injuries.slice(start, end);

    const fillTable = document.getElementById('tabla_detalles_contenidos');
    fillTable.innerHTML = '';
    injuriesPage.forEach(row => {
        const tablaHtml = `
                <tr>
                <td>${row.nombre_equipo}</td>
                <td>${row.nombre_categoria}</td>
                
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.id_equipo})">
                    <img src="../../../resources/img/svg/icons_forms/reloj.png" width="30" height="30">
                    </button>
                </td>
            </tr>
                `;
        fillTable.innerHTML += tablaHtml;
    });

    updatePaginate();
}

async function cargarTabla(form = null) {
    const lista_datos = [
        {
            equipo: 'Leones',
            categoria: 'Categoria 13-14',
            id: 1,
        },
        {
            equipo: 'MAR',
            categoria: 'Categoria 15-16',
            id: 2,
        },
        {
            equipo: 'GOL',
            categoria: 'Categoria 12-13',
            id: 3,
        },
        {
            equipo: 'Powers guys',
            categoria: 'Categoria 14',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_detalles_contenidos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRowsHorario' : action = 'readAllHorario';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(DETALLE_CONTENIDO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            injuries = DATA.dataset;
            showInjuries(currentPage);
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td>${row.nombre_equipo}</td>
                <td>${row.nombre_categoria}</td>
                
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.id_equipo})">
                    <img src="../../../resources/img/svg/icons_forms/reloj.png" width="30" height="30">
                    </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}

// Función para actualizar los contlesiones de paginación
function updatePaginate() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(injuries.length / injuriesByPage);

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
    showInjuries(currentPage);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/assists.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Asistencias';
    await cargarTabla();
    // Constantes para establecer los elementos del componente Modal.

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE = document.getElementById('modalTitle2')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('seeForm'),
        ID_CATEGORIA = document.getElementById('idCategoria'),
        CHART = document.getElementById('contendorChart'),
        HORARIO = document.getElementById('horario');
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
        cargarTabla(FORM);
    });
};
