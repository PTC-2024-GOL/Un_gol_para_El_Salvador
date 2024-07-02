let SAVE_MODAL;
let SAVE_FORM,
    ID_JUGADOR,
    JUGADOR,
    BOTON,
    TITLEELEMENT,
    ASISTENCIA,
    BOOLASISTENCIA,
    ID_ASISTENCIA,
    OBSERVACION;
let SEARCH_FORM,
ID_URL,
ID_ENTRENAMIENTO_url,
ID_HORARIO_url;

let LISTA_DATOS = [];

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
async function fillSelected(data, selectElement, selectedValue) {
    try {
        selectElement.innerHTML = '';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.asistencia;
            option.textContent = item.asistencia;
            if (item.asistencia === selectedValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error al llenar el combobox:', error);
    }
}

/*
*   Función asíncrona para realizar peticiones a la API.
*   Esta función envia todos los datos del formulario. en forma de arreglos
*/
const guardar = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea guardar la asistencia?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idAsistenciaBool', BOOLASISTENCIA);
            FORM.append('idEntrenamiento', ID_ENTRENAMIENTO_url);
            FORM.append('idHorario', ID_HORARIO_url);
            FORM.append('arregloAsistencia', JSON.stringify(LISTA_DATOS));
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(ASISTENCIAS_API_2, 'createRow', FORM);
            console.log(DATA);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                BOTON.textContent = 'Modificar registro';
                TITLEELEMENT.textContent = 'Asistencia del equipo - Actualizar';
                BOOLASISTENCIA = 1;
                fillTable(true);
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        // Petición para obtener los datos del registro solicitado.
        const DATA = LISTA_DATOS.find(item => item.id == id);
        console.log('Datos del registro:', DATA);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.observacion) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Editar observación';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            ID_ASISTENCIA.value = DATA.id;
            OBSERVACION.value = DATA.observacion;
            console.log('ID ASISTENCIA:', ID_ASISTENCIA.value);
            console.log('OBSERVACION:', DATA.observacion);
        } else {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Agregar observación';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            ID_ASISTENCIA.value = DATA.id;
            OBSERVACION.value = null;
            console.log('ID ASISTENCIA:', ID_ASISTENCIA.value);
            console.log('OBSERVACION:', OBSERVACION.value);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Agregar observación';
    }

}
// Crea una función que en base a un id, cree un combobox y usando la función fillSelected, lo llene con las opciones de la lista_datos_asistencias y que se seleccione la opción por defecto llamada Asistencia, quiero tener control de cada combobox así que cuando le crees su id, usa el id que se le pase como parametro como identificador de cada combobox.
// Función para crear un combobox y llenarlo con opciones
async function createSelect(identificador, selectedValue) {
    try {
        const selectElement = document.createElement('select');
        const newid = 'asistencia_' + identificador;
        selectElement.id = newid;
        selectElement.classList.add('form-select');
        await fillSelected(lista_datos_asistencias, selectElement, selectedValue);

        // Añadir evento change al selectElement
        selectElement.addEventListener('change', (event) => {
            const selectedOption = event.target.value;
            const item = LISTA_DATOS.find(item => item.id == identificador);
            if (item) {
                item.asistencia = selectedOption;
                console.log(`Asistencia actualizada para el jugador con ID ${identificador}: ${selectedOption}`);
                console.log('Lista de datos actualizada:', LISTA_DATOS);
            }
        });

        return selectElement;
    } catch (error) {
        console.error('Error al crear el combobox:', error);
    }
} 



//Crea un comentario que describa la función que esta debajo
// Función asíncrona para llenar la tabla con los registros de la base de datos.
async function fillTable(asistencia) {
    const cargarTabla = document.getElementById('tabla_asistencias_2');

    try {
        cargarTabla.innerHTML = '';
        let form = new FormData();
        let action = asistencia == 0 ? 'readAlldefault' : 'readAll';
        form.append('idEntrenamiento', ID_ENTRENAMIENTO_url);
        const DATA = await fetchData(ASISTENCIAS_API_2, action, form);
        LISTA_DATOS = DATA.dataset;

        if (DATA.status) {
            if (LISTA_DATOS.length > 0) {
                const selectPromises = LISTA_DATOS.map(row => createSelect(row.id, row.asistencia));
                const selects = await Promise.all(selectPromises);

                LISTA_DATOS.forEach((row, index) => {
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
                });

                selects.forEach((select, index) => {
                    const rowId = LISTA_DATOS[index].id;
                    document.getElementById(`select-container-${rowId}`).appendChild(select);
                    select.value = LISTA_DATOS[index].asistencia;
                });

            } else {
                cargarTabla.innerHTML = '<tr><td colspan="3">No se encontraron registros.</td></tr>';
            }
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        cargarTabla.innerHTML = '<tr><td colspan="3">Error al cargar datos.</td></tr>';
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
    TITLEELEMENT = document.getElementById('title');
    BOTON = document.getElementById('tituloBoton');
    ID_URL = new URLSearchParams(window.location.search);
    ID_ENTRENAMIENTO_url = ID_URL.get('id_entrenamiento');
    const FORM = new FormData();
    FORM.append('idEntrenamiento', ID_ENTRENAMIENTO_url);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ASISTENCIAS_API_2, 'readOne', FORM);
    ID_HORARIO_url = DATA.dataset.id_horario;
    (DATA.dataset.asistencia == 1) ? BOTON.textContent = 'Modificar registro' : BOTON.textContent = 'Guardar registro';
    (DATA.dataset.asistencia == 1) ? TITLEELEMENT.textContent = 'Asistencia del equipo - Actualizar' : TITLEELEMENT.textContent = 'Asistencia del equipo - agregar asistencia';
    await fillTable(DATA.dataset.asistencia);
    console.log('ID ENTRENAMIENTO:', ID_ENTRENAMIENTO_url);
    console.log('ID HORARIO:', ID_HORARIO_url);
    console.log('Asistencia:', DATA.dataset.asistencia);
    BOOLASISTENCIA = DATA.dataset.asistencia;
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ASISTENCIA = document.getElementById('idAsitencia'),
        OBSERVACION = document.getElementById('Observacion');

    // Método del evento para cuando se envía el formulario de buscar.
    SAVE_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();

        // Constante tipo objeto con los datos del formulario.
        let id = ID_ASISTENCIA.value;
        let newObservation = OBSERVACION.value;

        console.log('ID ASISTENCIA:', id);
        console.log('OBSERVACION:', newObservation);
        // Encuentra el objeto en el arreglo que corresponde al id dado.
        let item = LISTA_DATOS.find(item => item.id == id);
        console.log('Item:', item);
        // Si se encuentra el objeto, modifica la observación.
        if (item) {
            item.observacion = newObservation;
        }
        console.log('Lista de datos:', LISTA_DATOS);
        console.log('Item:', item);
        // Limpia el formulario.
        SAVE_FORM.reset();
        // Cierra el modal.
        SAVE_MODAL.hide();
    });
};