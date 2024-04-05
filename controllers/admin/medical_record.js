let SAVE_MODAL;
let SAVE_FORM,
    ID_REGISTRO_MEDICO,
    JUGADOR,
    FECHA_LESION,
    FECHA_REGISTRO,
    DIAS_LESIONADO,
    LESION,
    RETORNO_ENTRENO,
    RETORNO_PARTIDO;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const API = '';

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
    MODAL_TITLE.textContent = 'Agregar un registro médico';
    // Se prepara el formulario.
    SAVE_FORM.reset();
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
        FORM.append('idMedico', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar un registro médico';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_REGISTRO_MEDICO.value = ROW.ID;
            JUGADOR.value = ROW.JUGADOR;
            FECHA_LESION.value = ROW.FECHA_LESION;
            FECHA_REGISTRO.value = ROW.FECHA_REGISTRO;
            DIAS_LESIONADO.value = ROW.DIAS;
            LESION.value = ROW.LESION;
            RETORNO_ENTRENO.value = ROW.RETORNO_ENTRENO;
            RETORNO_PARTIDO.value = ROW.RETORNO_PARTIDO;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar un registro médico';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el registro médico?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idMedico', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
        confirmAction('¿Desea eliminar el registro médico?');
    }

}


async function fillTable(form = null) {
    const lista_datos = [
        {
            jugador: 'Mateo',
            fecha_lesion: '2024-01-10',
            fecha_registro: '2024-01-11',
            dias_lesionado: '4',
            lesion: 'Tren superior',
            retorno_entreno: '2024-01-14',
            retorno_partido: '2024-01-23',
            id: 1,
        },
        {
            jugador: 'Fernando',
            fecha_lesion: '2024-02-28',
            fecha_registro: '2024-02-29',
            dias_lesionado: '10',
            lesion: 'Tren superior',
            retorno_entreno: '2024-03-10',
            retorno_partido: '2024-03-19',
            id: 2,
        },
        {
            jugador: 'Daniel',
            fecha_lesion: '2024-03-05',
            fecha_registro: '2024-03-06',
            dias_lesionado: '3',
            lesion: 'Tren superior',
            retorno_entreno: '2024-03-09',
            retorno_partido: '2024-03-20',
            id: 3,
        },
        {
            jugador: 'Xavier',
            fecha_lesion: '2024-04-26',
            fecha_registro: '2024-04-28',
            dias_lesionado: '25',
            lesion: 'Tren superior',
            retorno_entreno: '2024-05-21',
            retorno_partido: '2024-06-01',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_registro_medico');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.JUGADOR}</td>
                    <td>${row.FECHA_LESION}</td>
                    <td>${row.FECHA_REGISTRO}</td>
                    <td>${row.DIAS}</td>
                    <td>${row.LESION}</td>
                    <td>${row.RETORNO_ENTRENO}</td>
                    <td>${row.RETORNO_PARTIDO}</td>
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
            const tablaHtml = `
            <tr>
            <td>${row.jugador}</td>
            <td>${row.fecha_lesion}</td>
            <td>${row.fecha_registro}</td>
            <td>${row.dias_lesionado}</td>
            <td>${row.lesion}</td>
            <td>${row.retorno_entreno}</td>
            <td>${row.retorno_partido}</td>
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
    const horarioHtml = await loadComponent('../componentes/medical_record.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = horarioHtml;
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_REGISTRO_MEDICO = document.getElementById('idMedico'),
        JUGADOR = document.getElementById('jugador'),
        FECHA_LESION = document.getElementById('fechaLesion'),
        FECHA_REGISTRO = document.getElementById('fechaRegistro'),
        DIAS_LESIONADO = document.getElementById('diasLesionado'),
        LESION = document.getElementById('lesion'),
        RETORNO_ENTRENO = document.getElementById('retornoEntreno'),
        RETORNO_PARTIDO = document.getElementById('retornoPartido');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CATEGORIAS.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
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
        fillTable(FORM);
    });
};
