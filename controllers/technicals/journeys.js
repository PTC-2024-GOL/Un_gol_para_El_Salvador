let SAVE_MODAL;
let SAVE_FORM,
    ID_JORNADA,
    NUMERO_JORNADA,
    PLANTILLA,
    FECHA_INICIO,
    FECHA_FINAL;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const API = '';
const TEMPORADA_API = '';
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


const openCreate = () => {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Agregar una jornada';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se carga la lista utilizando el metodo ReadAll de la api de temporada.
        fillSelect(TEMPORADA_API, 'readAll', 'plantilla');
        fillSelected(lista_select, 'readAll', 'plantilla');
        
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
        FORM.append('idJornada', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar la jornada';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_JORNADA.value = ROW.ID;
            NUMERO_JORNADA.value = ROW.NUMERO;
            fillSelect(TEMPORADA_API, 'readAll', 'temporada', ROW.TEMPORADA);
            FECHA_INICIO.value = ROW.INICIO;
            FECHA_FINAL.value = ROW.FINAL;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar la jornada';
        fillSelected(lista_select, 'readAll', 'plantilla');
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la jornada?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idJornada', id);
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
    }

}


async function fillTable(form = null) {
    const lista_datos = [
        {
            jornada: 1,
            temporada: 2024,
            fecha_inicio: "2024-01-31",
            fecha_final: "2024-02-06",
            id: 1,
        },
        {
            jornada: 2,
            temporada: 2024,
            fecha_inicio: "2024-02-07",
            fecha_final: "2024-02-14",
            id: 2,
        },
        {
            jornada: 3,
            temporada: 2024,
            fecha_inicio: "2024-02-15",
            fecha_final: "2024-02-22",
            id: 3,
        },
        {
            jornada: 4,
            temporada: 2024,
            fecha_inicio: "2024-02-23",
            fecha_final: "2024-02-30",
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_jornadas');

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
                <tr class="text-end">
                    <td>${row.NUMERO}</td>
                    <td>${row.TEMPORADA}</td>
                    <td>${row.INICIO}</td>
                    <td>${row.FINAL}</td>
                    <td>
                        <a href="trainings.html?id=${row.ID}" class="btn btn-primary">
                        <img src="../../recursos/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </a>
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
                <td>${row.jornada}</td>
                <td>${row.temporada}</td>
                <td>${row.fecha_inicio}</td>
                <td>${row.fecha_final}</td>
                <td>
                    <a href="trainings.html?id=${row.id}" class="btn transparente">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18" height="18">
                    </a>
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
    const contentHtml = await loadComponent('../components/journey.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = contentHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Jornadas';
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

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
