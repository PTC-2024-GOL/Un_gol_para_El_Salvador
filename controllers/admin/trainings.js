let CONT_MODAL;
let GRAPHIC_MODAL,
    MODAL_TITLE2;
let CONT_FORM,
    ID_JORNADA,
    FECHA,
    N,
    MODAL_TITLE1,
    JUGADORES,
    SEE_MODAL2,
    SEE_FORM2,
    SEE_MODAL,
    CONTENIDO,
    ID_ANALISISV,
    JUGADORV,
    FUERZAV,
    RESISTENCIAV,
    VELOCIDADV,
    AGILIDADV,
    PASE_CORTOV,
    PASE_MEDIOV,
    PASE_LARGOV,
    CONDUCCIONV,
    RECEPCIONV,
    CABECEOV,
    REGATEV,
    DEFINICIONV,
    DECISIONESV,
    OFENSIVOSV,
    DEFENSIVOSV,
    INTERPRETACIONV,
    CONCENTRACIONV,
    AUTOCONFIANZAV,
    SACRICIOV,
    AUTOCONTROLV,
    SEE_FORM;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const ENTRENAMIENTOS_API = '';
const HORARIOS_API = '';


// Lista de datos para mostrar en la tabla de horarios
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

// Lista de datos para mostrar en la tabla de contenidos
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


//Función asíncrona para cargar un componente HTML.
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

const seeModal2 = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idAnalisis', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ENTRENAMIENTOS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL2.show();
            MODAL_TITLE2.textContent = 'Actualizar análisis del jugador';
            // Se prepara el formulario.
            SAVE_FORM2.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_EQUIPO.value = ROW.ID;
            NOMBRE_EQUIPO.value = ROW.NOMBRE;
            TELEFONO_EQUIPO.value = ROW.TELEFONO;
            ID_CUERPO_TECNICO.value = ROW.ID_CUERPO_TECNICO;
            ID_ADMINISTRADOR.value = ROW.ID_ADMINISTRADOR;
            ID_CATEGORIA.value = ROW.ID_CATEGORIA;
            LOGO_EQUIPO.value = ROW.LOGO;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        SEE_MODAL2.show();
        MODAL_TITLE2.textContent = 'Análisis del jugador';
        SEE_FORM2.reset();
    }
}

//Crea un comentario que describa la función que esta debajo
/*
*   Función para abrir la página de detalles específicos.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
//
// Función para abrir la página de detalles específicos.
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

//Crea un comentario que describa la función que esta debajo
/*
*   Función asíncrona para cargar la tabla de detalles de contenidos.
*   Parámetros: form (formulario de búsqueda).
*   Retorno: ninguno.
*/

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

//Crea un comentario que describa la función que esta debajo
/*
*   Función asíncrona para cargar la tabla de detalles de contenidos.
*   Parámetros: form (formulario de búsqueda).
*   Retorno: ninguno.
*/
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
                    <td class="justify-content-center">
                        <button type="button" class="btn transparente" onclick="seeModal(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/stadistic.png" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn transparente" onclick="seeCont(${row.ID})">
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
                    <td class="justify-content-center">
                        <button type="button" class="btn transparente" onclick="seeModal(${row.id})">
                        <img src="../../../resources/img/svg/icons_forms/stadistic.png" width="18" height="18">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn transparente" onclick="seeCont(${row.id})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="|8" height="18">
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

    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Entrenamiento Jornada del 3 de julio - 29 de agosto';
    // Llamar a la función fillContents con la lista de datos de contenidos y el id del ul
    fillContents(lista_datos_contenidos, null, 'lista_contenidos');

    fillSelected(lista_datos_horario, 'readAll', 'horario');
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SEE_MODAL2 = new bootstrap.Modal('#seeModal2'),
        MODAL_TITLE2 = document.getElementById('modalTitle3')

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
     // Constantes para establecer los elementos del formulario de guardar.
     SEE_FORM2 = document.getElementById('viewForm'),
     ID_ANALISISV = document.getElementById('idAnalisisV'),
     JUGADORV = document.getElementById('jugadorV'),
     FUERZAV = document.getElementById('fuerzaV'),
     RESISTENCIAV = document.getElementById('resistenciaV'),
     VELOCIDADV = document.getElementById('velocidadV'),
     AGILIDADV = document.getElementById('agilidadV'),
     PASE_CORTOV = document.getElementById('paseCortoV'),
     PASE_MEDIOV = document.getElementById('paseMedioV'),
     PASE_LARGOV = document.getElementById('paseLargoV'),
     CONDUCCIONV = document.getElementById('conduccionV'),
     RECEPCIONV = document.getElementById('recepcionV'),
     CABECEOV = document.getElementById('cabeceoV'),
     REGATEV = document.getElementById('regateV'),
     DEFINICIONV = document.getElementById('definicionGolV'),
     DECISIONESV = document.getElementById('tomaDecisionesV'),
     OFENSIVOSV = document.getElementById('conceptosOfensivosV'),
     DEFENSIVOSV = document.getElementById('conceptosDefensivosV'),
     INTERPRETACIONV = document.getElementById('interpretacionV'),
     CONCENTRACIONV = document.getElementById('concentracionV'),
     AUTOCONFIANZAV = document.getElementById('autoconfianzaV'),
     SACRICIOV = document.getElementById('sacrificioV'),
     AUTOCONTROLV = document.getElementById('autocontrolV');
 
 // Método del evento para cuando se envía el formulario de guardar.
 SEE_FORM2.addEventListener('submit', async (event) => {
     // Se evita recargar la página web después de enviar el formulario.
     event.preventDefault();
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

    
    const prevBtns1 = document.querySelectorAll(".btn-prev1");
    const nextBtns1 = document.querySelectorAll(".btn-next1");
    const progress1 = document.getElementById("progress1");
    const formSteps1 = document.querySelectorAll(".form-step1");
    const progressSteps1 = document.querySelectorAll(".progress-step1");

    let formStepsNum1 = 0;

    nextBtns1.forEach((btn) => {
        btn.addEventListener("click", () => {
            formStepsNum1++;
            updateFormSteps1();
            updateProgressbar1();
        });
    });

    prevBtns1.forEach((btn) => {
        btn.addEventListener("click", () => {
            formStepsNum1--;
            updateFormSteps1();
            updateProgressbar1();
        });
    });

    function updateFormSteps1() {
        formSteps1.forEach((formStep1) => {
            formStep1.classList.contains("form-step-active1") &&
                formStep1.classList.remove("form-step-active1");
        });

        formSteps1[formStepsNum1].classList.add("form-step-active1");
    }

    function updateProgressbar1() {
        progressSteps1.forEach((progressStep1, idx) => {
            if (idx < formStepsNum1 + 1) {
                progressStep1.classList.add("progress-step-active1");
            } else {
                progressStep1.classList.remove("progress-step-active1");
            }
        });

        const progressActive1 = document.querySelectorAll(".progress-step-active1");

        progress1.style.width =
            ((progressActive1.length - 1) / (progressSteps1.length - 1)) * 90 + "%";
    }
};
