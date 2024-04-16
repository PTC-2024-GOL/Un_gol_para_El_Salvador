let SAVE_MODAL,
    SEE_MODAL,
    SEE_FORM;
let SAVE_FORM,
    ID_PARTIDO,
    EQUIPO,
    RIVAL,
    FECHA_PARTIDO,
    CANCHA,
    LOGO,
    LOGO_RIVAL,
    RESULTADO_PARTIDO,
    LOCALIDAD,
    TIPO_RESULTADO_PARTIDO,
    ID_EQUIPO,
    JORNADA;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const PARTIDO_API = '';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}
/*
* Función para preparar el formulario al momento de insertar un registro.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar partido';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

// Funcion para preparar el formulario al momento de abrirlo
/*
* Función asíncrona para preparar el formulario al momento de ver un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
//

const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPartido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTIDO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Ver partido';
            // Se prepara el formulario.
            SEE_MODAL.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PARTIDO.value = ROW.ID;
            EQUIPO.value = ROW.EQUIPOP;
            RIVAL.value = ROW.RIVALP;
            FECHA_PARTIDO.value = ROW.FECHAP;
            CANCHA.value = ROW.CANCHAP;
            RESULTADO_PARTIDO.value = ROW.RESULTADOP;
            LOCALIDAD.value = ROW.LOCALIDAD;
            TIPO_RESULTADO_PARTIDO.value = ROW.TIPORESULTADOP;
            JORNADA.value = ROW.JORNADAP;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SEE_MODAL.show();
        MODAL_TITLE.textContent = 'Ver partido';
    }
}
/*
* Función asíncrona para preparar el formulario al momento de actualizar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPartido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTIDO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar partido';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PARTIDO.value = ROW.ID;
            EQUIPO.value = ROW.EQUIPOP;
            RIVAL.value = ROW.RIVALP;
            FECHA_PARTIDO.value = ROW.FECHAP;
            CANCHA.value = ROW.CANCHAP;
            RESULTADO_PARTIDO.value = ROW.RESULTADOP;
            LOCALIDAD.value = ROW.LOCALIDAD;
            TIPO_RESULTADO_PARTIDO.value = ROW.TIPORESULTADOP;
            JORNADA.value = ROW.JORNADAP;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar partido';
    }

}
/*
* Función asíncrona para eliminar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el partido de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPartido', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PARTIDO_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarTabla();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
        confirmAction('¿Desea eliminar el partido de forma permanente?');
    }

}


/*
* Función asíncrona para llenar las cartas con los registros disponibles.
* Parámetros: form (formulario de búsqueda).
* Retorno: ninguno.
*/
async function fillCards(form = null) {
    const lista_datos = [
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        },
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        },
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        },
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        }
    ];
    const cargarCartas = document.getElementById('matches_cards');

    try {
        cargarCartas.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const cardsHtml = `<div class="col-md-6 col-sm-12">
    <div class="tarjetas p-4">
        <div class="row">
            <div class="col-auto">
                <img src="../../../resources/img/svg/calendar.svg" alt="">
            </div>
            <div class="col">
                <p class="fw-semibold mb-0">${row.FECHA_PARTIDO}</p>
                <p class="small">${row.LOCALIDAD}</p>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col-4">
                <img src="${row.LOGO}" class="img">
                <p class="small mt-3">${row.EQUIPO}</p>
            </div>
            <div class="col-4">
                <h2 class="fw-semibold">${row.RESULTADO_PARTIDO}</h2>
            </div>
            <div class="col-4">
                <img src="${row.LOGO_RIVAL}" class="img">
                <p class="small mt-3">${row.RIVAL}</p>
            </div>
        </div>
        <hr>
        <button class="btn bg-blue-principal-color text-white btn-sm rounded-3" onclick="openUpdate(${row.ID_PARTIDO})">
            Editar partido
        </button>
    </div>
</div>
`;
                cargarCartas.innerHTML += cardsHtml;
            });
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const cardsHtml = `<div class="col-md-6 col-sm-12">
    <div class="tarjetas shadow p-4">
        <div class="row">
            <div class="col-auto">
                <img src="../../../resources/img/svg/calendar.svg" alt="">
            </div>
            <div class="col">
                <p class="fw-semibold mb-0">${row.fechaPartido}</p>
                <p class="small">${row.localidad}</p>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col-4">
                <img src="${row.logo}" class="img">
                <p class="small mt-3">${row.equipo}</p>
            </div>
            <div class="col-4">
                <h2 class="fw-semibold">${row.resultado}</h2>
            </div>
            <div class="col-4">
                <img src="${row.logo_rival}" class="img">
                <p class="small mt-3">${row.rival}</p>
            </div>
        </div>
        <hr>
        <button class="btn bg-yellow-principal-color text-white btn-sm rounded-3 mb-3"
            onclick="openUpdate(${row.id_partido})">
            Editar partido
        </button>
        <button class="btn bg-blue-principal-color text-white btn-sm rounded-3 mb-3"
            onclick="seeModal(${row.id_partido})">
            Más información
        </button>
        <button class="btn bg-red-cream-color text-white btn-sm rounded-3 mb-3"
            onclick="openDelete(${row.id_partido})">
            Eliminar
        </button>
    </div>
</div>
`;
            cargarCartas.innerHTML += cardsHtml;
        });
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/matches.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Partidos';
    fillCards();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE = document.getElementById('modalTitle2')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PARTIDO = document.getElementById('idPartido'),
        EQUIPO = document.getElementById('equipos'),
        RIVAL = document.getElementById('rival'),
        FECHA_PARTIDO = document.getElementById('fechaPartido'),
        CANCHA = document.getElementById('cancha'),
        RESULTADO_PARTIDO = document.getElementById('resultado'),
        LOCALIDAD = document.getElementById('localidad'),
        TIPO_RESULTADO_PARTIDO = document.getElementById('tipoResultado');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_PARTIDO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(PARTIDO_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillCards();
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
        fillCards();
    });
};