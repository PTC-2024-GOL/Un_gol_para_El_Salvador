let SAVE_MODAL;
let SAVE_FORM,
    ID_JUGADOR,
    JUGADOR,
    ASISTENCIA,
    ID_ASISTENCIA,
    OBSERVACION;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
// La lógica de esta pantalla aún no está terminada debido a que todavía me hace falta definir qué ocurrirá cuando se agregue una observación Y cuando se seleccione Una nueva opción de los ítems que contiene cada select
// Por lo tanto guayito del futuro, Tienes la tarea de hacer que el botón de guardar asistencias capture el json de lista datos Y active la opción de post.
// Debes verificar que cuando se seleccione una opción se actualiza el jason y que cuando se agregue una nueva observación se actualice el json tambien
const ASISTENCIAS_API_2 = '';

// Lista de datos para mostrar en la tabla de asistencias
const lista_datos_asistencias = [
    {
        asistencia: "Asistencia"
    },
    {
        asistencia: "Ausencia injustificada"
    },
    {
        asistencia: "Enfermedad"
    },
    {
        asistencia: "Estudio"
    },
    {
        asistencia: "Trabajo"
    },
    {
        asistencia: "Viaje"
    },
    {
        asistencia: "Permiso"
    },
    {
        asistencia: "Falta"
    },
    {
        asistencia: "Lesión"
    },
    
    {
        asistencia: "Otro"
    }
];

//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Función para poblar un combobox (select) con opciones
async function fillSelected(data, action, selectElement, selectedValue = '') {
    try {
        
        // Llenar el combobox con los datos proporcionados
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.asistencia; // Suponiendo que hay una propiedad 'asistencia' en los datos y la queremos usar como identificador
            option.textContent = item.asistencia; // Cambia 'asistencia' al nombre de la propiedad que deseas mostrar en el combobox
            selectElement.appendChild(option);
        });
        // Seleccionar el valor especificado si se proporciona
        if (selectedValue !== '') {
            selectElement.value = selectedValue;
        }
    } catch (error) {
        console.error('Error al llenar el combobox:', error);
    }
}

//Crea un comentario que describa la función que esta debajo de este comentario
//Función para guardar los datos del modal OpenCreate

const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar observación';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    // Se inicializan los campos con los datos.
    ID_ASISTENCIA.value = '';
    OBSERVACION.value = '';
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
        FORM.append('idAsitencia', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ASISTENCIAS_API_2, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Agregar observación';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ASISTENCIA.value = ROW.ID;
            OBSERVACION.value = ROW.OBSERVACION;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Agregar observación';
    }

}
// Crea una función que en base a un id, cree un combobox y usando la función fillSelected, lo llene con las opciones de la lista_datos_asistencias y que se seleccione la opción por defecto llamada Asistencia, quiero tener control de cada combobox así que cuando le crees su id, usa el id que se le pase como parametro como identificador de cada combobox.
async function createSelect(identificador) {
    try {
        const selectElement = document.createElement('select');
        newid = 'asistencia_' + identificador;
        selectElement.id = newid;
        await fillSelected(lista_datos_asistencias, 'readAll', selectElement, 'Asistencia');
        console.log('Elemento select antes de devolver:', selectElement);
        selectElement.classList.add('form-select');
        return selectElement;
    } catch (error) {
        console.error('Error al crear el combobox:', error);
    }
}

//Crea un comentario que describa la función que esta debajo
//Función asíncrona para llenar la tabla con los registros de la base de datos.
async function fillTable(form = null) {
    const lista_datos = [
        {
            jugador: 'Antonio Morales',
            asistencia: 'Asistencia',
            observacion: 'bla blab bla',
            id: 1,
        },
        {
            jugador: 'Jose Antonio',
            asistencia: 'Asistencia',
            observacion: 'bla blab bla',
            id: 2,
        },
        {
            jugador: 'Menchoga Pastre ',
            asistencia: 'Asistencia',
            observacion: 'bla blab bla',
            id: 3,
        },
        {
            jugador: 'Sanchez Cerén',
            asistencia: 'Asistencia',
            observacion: 'bla blab bla',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_asistencias_2');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        const action = (form) ? 'searchRows' : 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(ASISTENCIAS_API_2, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.JUGADOR}</td>
                    <td> ${createSelect(row.ID).outerHTML}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="openUpdate(${row.ID})">
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
        if (lista_datos.length > 0) {
            console.error('Entre al if, así que si detecto que hay datos');
            
            // Primero, creamos todas las promesas para los elementos select
            const selectPromises = lista_datos.map(row => createSelect(row.id));
            
            // Luego, resolvemos todas las promesas
            Promise.all(selectPromises).then(selects => {
                // Ahora que todas las promesas se han resuelto, podemos construir la cadena de texto
                lista_datos.forEach((row, index) => {
                    console.error('Estos son los id Encontrados: ', row.id);
                    const tablaHtml = `
                        <tr>
                            <td>${row.jugador}</td>
                            <td>${selects[index].outerHTML}</td>
                            <td>
                                <button type="button" class="btn btn-warnig" onclick="openUpdate(${row.id})">
                                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                                </button>
                            </td>
                        </tr>
                    `;
                    cargarTabla.innerHTML += tablaHtml;
                });
            });
        } else {
            cargarTabla.innerHTML = '<tr><td colspan="3">No se encontraron registros.</td></tr>';
        }
    }
}


// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const posicionHtml = await loadComponent('../componentes/specific_assistens.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = posicionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Asistencias equipo';
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ASISTENCIA = document.getElementById('idAsitencia'),
        OBSERVACION = document.getElementById('Observacion');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_ASISTENCIA.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ASISTENCIAS_API_2, action, FORM);
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
