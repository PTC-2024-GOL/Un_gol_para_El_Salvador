let CONT_MODAL;
let CONT_FORM,
    ID_JORNADA,
    FECHA,
    N,
    MODAL_TITLE1,
    JUGADORES,
    SEE_MODAL,
    CONTENIDO,
    SEE_FORM;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const ENTRENAMIENTOS_API = '';
const HORARIOS_API = '';

const lista_datos_horario = [
    {
        jugadores: "Mario Alboran",
        id: 1,
    },
    {
        jugadores: 'Marco Polo',
        id: 2,
    },
    {
        jugadores: 'Susan Abigail',
        id: 3,
    },
    {
        jugadores: 'Agustin De Tarso',
        id: 4,
    }
];

const lista_datos_contenidos = [
    {
        contenidos: "Juegos lúdicos",
    },
    {
        contenidos: "Trabajo peventivo",
    },
    {
        contenidos: "Circuitos/Físico sin balón",
    },
    {
        contenidos: "Circuitos/Físico balón",
    }
];
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const fillContents = (data, action, selectId) => {
    const ulElement = document.getElementById(selectId);

    // Limpiar la lista de contenidos previos
    ulElement.innerHTML = '';

    // Iterar sobre los datos proporcionados y crear un elemento li por cada contenido
    data.forEach(item => {
        const liElement = document.createElement('li');
        liElement.classList.add('list-group-item', 'list-group-item-info', 'px-3');
        liElement.textContent = item.contenidos; // Asignar el texto del contenido al elemento li
        ulElement.appendChild(liElement); // Agregar el elemento li a la lista ul
    });
};

// Función para poblar un combobox (select) con opciones
const fillSelected = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un jugador';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.jugadores; // Cambia 'jugador' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};

// Funcion para preparar el formulario al momento de abrirlo
/*
*   Función asíncrona para preparar el formulario al momento de elegir un horario.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/


const openPag = () => {
    window.location.href = '../paginas/trainings_player.html';
}

const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idJornada', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ENTRENAMIENTOS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Elegir jugador';
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
        MODAL_TITLE.textContent = 'Elegir jugador';
        SEE_FORM.reset();
        fillSelected(lista_datos_horario, 'readAll', 'horario');
    }
}

const seeCont = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idJornada', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTIDO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            CONT_MODAL.show();
            MODAL_TITLE1.textContent = 'Ver contenidos';
            // Se prepara el formulario.
            CONT_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_JORNADA.value = ROW.ID;
            CONTENIDO.value = ROW.CONTENIDO;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        CONT_MODAL.show();
        MODAL_TITLE1.textContent = 'Ver contenidos';
        CONT_FORM.reset();
    }
}

async function cargarTabla(form = null) {
    const lista_datos = [
        {
            n: '1',
            fecha: '15 de julio',
            id: 1,
        },
        {
            n: '2',
            fecha: '18 de julio',
            id: 2,
        },
        {
            n: '3',
            fecha: '1 de agosto',
            id: 3,
        },
        {
            n: '4',
            fecha: '13 de agosto',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_entrenamientos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(ENTRENAMIENTOS_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.N}</td>
                    <td>${row.FECHA}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/stadistic.png" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeCont(${row.ID})">
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
                    <td>${row.n}</td>
                    <td>${row.fecha}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal(${row.id})">
                        <img src="../../../resources/img/svg/icons_forms/stadistic.png" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeCont(${row.id})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
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
    const adminHtml = await loadComponent('../componentes/trainings.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    // Llamar a la función fillContents con la lista de datos de contenidos y el id del ul
    fillContents(lista_datos_contenidos, null, 'lista_contenidos');

    fillSelected(lista_datos_horario, 'readAll', 'horario');
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    CONT_MODAL = new bootstrap.Modal('#contModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle1')
        
    SAVE_FORM = document.getElementById('contForm');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE = document.getElementById('modalTitle2')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('seeForm'),
        ID_JORNADA = document.getElementById('idCategoria'),
        HORARIO = document.getElementById('horario');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_JORNADA.value) ? action = 'select' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ENTRENAMIENTOS_API, action, FORM);
        //Aqui debo hacer la lógica de lo que sucederá cuando se le dé click a seleccionar horario.
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        //Pondré el metodo para abrir la siguiente pantalla antes del if, luego deberé ponerla
        // Redirige a una nueva página en la misma ventana del navegador


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
