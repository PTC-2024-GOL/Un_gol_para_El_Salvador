let SAVE_MODAL;
let SAVE_FORM,
    ID_JUGADOR,
    JUGADOR,
    BOTON,
    ASISTENCIA,
    ID_ASISTENCIA,
    OBSERVACION;
let SEARCH_FORM,
ID_URL,
ID_ENTRENAMIENTO_url,
ID_HORARIO_url;

// Constantes para completar las rutas de la API.
// La lógica de esta pantalla aún no está terminada debido a que todavía me hace falta definir qué ocurrirá cuando se agregue una observación Y cuando se seleccione Una nueva opción de los ítems que contiene cada select
// Por lo tanto guayito del futuro, Tienes la tarea de hacer que el botón de guardar asistencias capture el json de lista datos Y active la opción de post.
// Debes verificar que cuando se seleccione una opción se actualiza el jason y que cuando se agregue una nueva observación se actualice el json tambien
const ASISTENCIAS_API_2 = 'services/admin/asistencias.php';

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
        asistencia: "Lesion"
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
async function fillSelected(data, action, selectElement, selectedValue) {
    try {
            selectElement.innerHTML = '';
        // Llenar el combobox con los datos proporcionados
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.asistencia; // Suponiendo que hay una propiedad 'asistencia' en los datos y la queremos usar como identificador
            option.textContent = item.asistencia;
            if (item.asistencia == selectedValue)
            {
                console.log('Estoy seleccionando la opción:', item.asistencia, '<- -> ' , selectedValue);
                console.log('Estoy seleccionando la opción:', item.asistencia);
            option.selected = true; // Cambia 'asistencia' al nombre de la propiedad que deseas mostrar en el combobox
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error al llenar el combobox:', error);
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
async function createSelect(identificador, selectedValue) {
    try {
        const selectElement = document.createElement('select');
        newid = 'asistencia_' + identificador;
        selectElement.id = newid;
        selectElement.classList.add('form-select');
        await fillSelected(lista_datos_asistencias, 'readAll', selectElement, selectedValue);
        console.log('Elemento select antes de devolver:', selectElement, ' ', selectedValue);
        return selectElement;
    } catch (error) {
        console.error('Error al crear el combobox:', error);
    }
}

//Crea un comentario que describa la función que esta debajo
// Función asíncrona para llenar la tabla con los registros de la base de datos.
async function fillTable(asistencia) {
    let lista_datos = [];
    const cargarTabla = document.getElementById('tabla_asistencias_2');

    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let form = new FormData();
        let action = '';
        form.append('idEntrenamiento', ID_ENTRENAMIENTO_url);
        (asistencia == 0) ? action = 'readAlldefault' : action = 'readAll';
        const DATA = await fetchData(ASISTENCIAS_API_2, action, form);
        console.log(DATA);
        lista_datos = DATA.dataset; 
        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            if (lista_datos.length > 0) {
                console.error('Entre al if, así que si detecto que hay datos');
                console.log(lista_datos);
                // Primero, creamos todas las promesas para los elementos select
                const selectPromises = lista_datos.map(row => createSelect(row.id, row.asistencia));
                
                // Luego, resolvemos todas las promesas
                Promise.all(selectPromises).then(selects => {
                    // Ahora que todas las promesas se han resuelto, podemos construir la cadena de texto
                    lista_datos.forEach((row, index) => {
                        console.error('Estos son los id Encontrados: ', row.id);
                        const tablaHtml = `
                            <tr>
                                <td>${row.jugador}</td>
                                <td id="select-container-${row.id}"></td>
                                <td>
                                    <button type="button" class="btn" onclick="openUpdate(${row.id})">
                                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                                    </button>
                                </td>
                            </tr>
                        `;
                        cargarTabla.innerHTML += tablaHtml;

                        // Insertar el elemento select en el contenedor adecuado
                        document.getElementById(`select-container-${row.id}`).appendChild(selects[index]);

                        // Asignar la opción seleccionada
                        selects[index].value = row.asistencia;
                    });
                });
            } else {
                cargarTabla.innerHTML = '<tr><td colspan="3">No se encontraron registros.</td></tr>';
            }
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
                            <td id="select-container-${row.id}"></td>
                            <td>
                                <button type="button" class="btn btn-warning" onclick="openUpdate(${row.id})">
                                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                                </button>
                            </td>
                        </tr>
                    `;
                    cargarTabla.innerHTML += tablaHtml;

                    // Insertar el elemento select en el contenedor adecuado
                    document.getElementById(`select-container-${row.id}`).appendChild(selects[index]);

                    // Asignar la opción seleccionada
                    selects[index].value = row.asistencia;
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
    // Carga los components de manera síncrona
    const posicionHtml = await loadComponent('../components/specific_assistens.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = posicionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    const boton = document.getElementById('tituloBoton');
    ID_URL = new URLSearchParams(window.location.search);
    ID_ENTRENAMIENTO_url = ID_URL.get('id_entrenamiento');
    const FORM = new FormData();
    FORM.append('idEntrenamiento', ID_ENTRENAMIENTO_url);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ASISTENCIAS_API_2, 'readOne', FORM);
    ID_HORARIO_url = DATA.dataset.id_horario;
    (DATA.dataset.asistencia == 1) ? boton.textContent = 'Modificar registro' : boton.textContent = 'Guardar registro';
    (DATA.dataset.asistencia == 1) ? titleElement.textContent = 'Asistencia del equipo - actualizar' : titleElement.textContent = 'Asistencia del equipo - agregar asistencia';
    fillTable(DATA.dataset.asistencia);
    console.log('ID ENTRENAMIENTO:', ID_ENTRENAMIENTO_url);
    console.log('ID HORARIO:', ID_HORARIO_url);
    console.log('Asistencia:', DATA.dataset.asistencia);
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ASISTENCIA = document.getElementById('idAsitencia'),
        OBSERVACION = document.getElementById('Observacion');

};
