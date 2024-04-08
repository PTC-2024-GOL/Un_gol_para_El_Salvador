let SAVE_MODAL;
let SAVE_FORM,
    ID_PARTIDO,
    EQUIPO,
    RIVAL,
    FECHA_PARTIDO,
    CANCHA,
    RESULTADO_PARTIDO,
    LOCALIDAD,
    TIPO_RESULTADO_PARTIDO,
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
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar partido';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

// Funcion para preparar el formulario al momento de abrirlo

const seeModal =async (id) => {
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
            MODAL_TITLE.textContent = 'Ver partido';
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
        MODAL_TITLE.textContent = 'Ver partido';
    }
}
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
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
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
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


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado: '3-1',
            localidad: 'Visitante',
            id: 1,
            tipo_resultado_partido: 'victoria',
        },
        {
            equipo: 'Mar',
            rival: 'FC Migueleños',
            fechaPartido: '12 de abril del 2024',
            resultado: '2-2',
            localidad: 'Local',
            id: 2,
            tipo_resultado_partido: 'empate',
        },
        {
            equipo: 'GOL',
            rival: 'FESA',
            fechaPartido: '20 de marzo del 2024',
            resultado: '1-2',
            localidad: 'Local',
            id: 3,
            tipo_resultado_partido: 'derrota',
        },
        {
            equipo: 'Power kid',
            rival: 'Toluca',
            fechaPartido: '15 de marzo del 2024',
            resultado: '2-0',
            localidad: 'Visitante',
            id: 4,
            tipo_resultado_partido: 'victoria',
        }
    ];
    const cargarTabla = document.getElementById('tabla_partido');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTIDO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const resultadoColorClass = row.TIPO_RESULTADO_PARTIDO === 'victoria' ? 'text-success' : row.TIPO_RESULTADO_PARTIDO === 'empate' ? 'text-dark' : 'text-danger';
                const tablaHtml = `
                <tr>
                    <td>${row.EQUIPO}</td>
                    <td>${row.RIVAL}</td>
                    <td>${row.FECHAPARTIDO}</td>
                    <td class="${resultadoColorClass}">${row.RESULTADO}</td>
                    <td>${row.LOCALIDAD}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <img src="../../recursos/img/svg/icons_forms/pen 1.svg" width="30" height="30">
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.ID})">
                            <i class="bi bi-trash-fill"></i>
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
            const resultadoColorClass = row.tipo_resultado_partido === 'victoria' ? 'text-success' : row.tipo_resultado_partido=== 'empate' ? 'text-dark' : 'text-danger';
            const tablaHtml = `
            <tr>
                <td>${row.equipo}</td>
                <td>${row.rival}</td>
                <td>${row.fechaPartido}</td>
                <td class="${resultadoColorClass}">${row.resultado}</td>
                <td>${row.localidad}</td>
                <td>
                    <button type="button" class="btn btn-warnig" onclick="seeModal(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
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
    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/matches.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    cargarTabla();
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
