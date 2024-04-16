let SAVE_MODAL,
 MODAL_TITLE;
let SEE_MODAL,
MODAL_TITLE1;
let SAVE_FORM,
    ID_CATEGORIAS,
    NOMBRE_CATEGORIA,
    EDAD_MIN,
    EDAD_MAX,
    TEMPORADA,
    HORARIO,
    SEE_FORM;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const API = '';
const HORARIOS_API = '';

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
    MODAL_TITLE.textContent = 'Agregar una categoría';
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
        FORM.append('idCategoria', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar una categoría';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CATEGORIAS.value = ROW.ID;
            NOMBRE_CATEGORIA.value = ROW.NOMBRE;
            EDAD_MIN.value = ROW.MINIMA;
            EDAD_MAX.value = ROW.MAXIMA;
            TEMPORADA.value = ROW.TEMPORADA;
            HORARIO.value = ROW.HORARIO;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar una categoría';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la categoría?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCategoria', id);
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
        confirmAction('¿Desea eliminar la categoría?');
    }

}


const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCategoria', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ASISTENCIAS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Elegir horario';
            // Se prepara el formulario.
            SEE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CATEGORIA.value = ROW.ID;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SEE_MODAL.show();
        MODAL_TITLE1.textContent = 'Elegir horario';
        cargarTabla();
    }
}


async function cargarTabla(form = null) {
    const lista_horarios = [
        {
            nombre_horario: 'Horario lunes 1',
            dia: 'Lunes',
            campo_entrenamiento: 'El cafetalón',
            hora_inicial: '16:00',
            hora_final: '17:00',
            id: 1,
        },
        {
            nombre_horario: 'Horario lunes 1',
            dia: 'Lunes',
            campo_entrenamiento: 'El cafetalón',
            hora_inicial: '16:00',
            hora_final: '17:00',
            id: 1,
        },
        {
            nombre_horario: 'Horario lunes 1',
            dia: 'Lunes',
            campo_entrenamiento: 'El cafetalón',
            hora_inicial: '16:00',
            hora_final: '17:00',
            id: 1,
        },
        {
            nombre_horario: 'Horario lunes 1',
            dia: 'Lunes',
            campo_entrenamiento: 'El cafetalón',
            hora_inicial: '16:00',
            hora_final: '17:00',
            id: 1,
        }
    ];
    const cargarTabla = document.getElementById('tabla_horarios');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(JUGADOR_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/admin/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.APELLIDO}</td>
                    <td>${row.DORSAL}</td>
                    <td>${row.POSICION_PRINCIPAL}</td>
                    <td>${row.NACIMIENTO}</td>
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
        lista_horarios.forEach(row => {
            const tablaHtml = `
            <tr>
                <td>${row.nombre_horario}</td>
                <td>${row.dia}</td>
                <td>${row.campo_entrenamiento}</td>
                <td>${row.hora_inicial}</td>
                <td>${row.hora_final}</td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}


async function fillTable(form = null) {
    const lista_datos = [
        {
            nombre: 'Nivel 1',
            minima: '4',
            maxima: '7',
            temporada: '2021',
            id: 1,
        },
        {
            nombre: 'Nivel 2',
            minima: '8',
            maxima: '13',
            temporada: '2022',
            id: 2,
        },
        {
            nombre: 'Nivel 3',
            minima: '14',
            maxima: '15',
            temporada: '2023',
            id: 3,
        },
        {
            nombre: 'Nivel 4',
            minima: '16',
            maxima: '18',
            temporada: '2024',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_categorias');

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
                    <td>${row.NOMBRE}</td>
                    <td>${row.MINIMA}</td>
                    <td>${row.MAXIMA}</td>
                    <td>${row.TEMPORADA}</td>
                    <td>
                    <button type="button" class="btn transparente" onclick="seeModal()">
                    <img src="../../../resources/img/svg/icons_forms/reloj.png" width="30" height="30">
                    </button>
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
            <td>${row.nombre}</td>
            <td>${row.minima}</td>
            <td>${row.maxima}</td>
            <td>${row.temporada}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/reloj.png" width="30" height="30">
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
    // Carga los components de manera síncrona
    const horarioHtml = await loadComponent('../components/categories.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = horarioHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Categorías';
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle2');

    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_CATEGORIAS = document.getElementById('idCategoria'),
        NOMBRE_CATEGORIA = document.getElementById('nombreCategoria'),
        EDAD_MIN = document.getElementById('edadMin'),
        EDAD_MAX = document.getElementById('edadMax'),
        TEMPORADA = document.getElementById('temporada'),
        HORARIO = document.getElementById('horario');
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
