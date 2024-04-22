let SEE_MODAL,
    MODAL_TITLE1;

let SAVE_FORM,
    ID_EQUIPO,
    NOMBRE_EQUIPO,
    TELEFONO_EQUIPO,
    ID_CUERPO_TECNICO,
    ID_ADMINISTRADOR,
    ID_CATEGORIA,
    LOGO_EQUIPO
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const EQUIPO_API = '';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Funcion para preparar el formulario al momento de abrirlo

const seeModal = () => {
    SEE_MODAL.show();
    MODAL_TITLE1.textContent = 'Cuerpo Técnico del equipo';
}

async function cargarTabla(form = null) {
    const lista_datos = [
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Gol',
            telefono: '2243-2312',
            categoria: '16',
            cuerpo_técnico: 1,
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Monaco',
            telefono: '1234-5678',
            categoria: '17',
            cuerpo_técnico: 1,
            id: 2,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Selecta',
            telefono: '1234-5678',
            categoria: '28',
            cuerpo_técnico: 1,
            id: 3,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Software',
            telefono: '1234-5678',
            categoria: '17',
            cuerpo_técnico: 1,
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_equipos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(EQUIPO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/admin/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.TELEFONO}</td>
                    <td>${row.ID_CATEGORIA}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal(${row.ID_CUERPO_TECNICO})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </button>
                    </td>
                </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
            });
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.telefono}</td>
                <td>${row.categoria}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.cuerpo_técnico})">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const equiposHtml = await loadComponent('../components/soccer_team.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = equiposHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Equipos';
    cargarTabla();

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle1')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ADMINISTRADOR = document.getElementById('idEquipo'),
        NOMBRE_EQUIPO = document.getElementById('nombreEquipo'),
        TELEFONO_EQUIPO = document.getElementById('telefonoEquipo'),
        ID_CATEGORIA = document.getElementById('categoriaEquipo'),
        ID_CUERPO_TECNICO = document.getElementById('cuerpoTecnico'),
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_EQUIPO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(EQUIPO_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            cargarTabla();
        } else {
            sweetAlert(2, DATA.error, false);
            console.error(DATA.exception);
        }
    });
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
