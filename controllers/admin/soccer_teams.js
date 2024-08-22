let SAVE_MODAL,
    MODAL_TITLE;

let SEE_MODAL,
    MODAL_TITLE1;

let SAVE_FORM,
    ID_EQUIPO,
    NOMBRE_EQUIPO,
    GENERO_EQUIPO,
    TELEFONO_EQUIPO,
    LOGO_EQUIPO

let SEE_GRAPHIC,
    MODAL_TITLE_GRAPHIC

let SEARCH_FORM;

let SELECT;

let SHOW_GRAPHIC;

let IMAGEN;
let CUERPO_TECNICO;
let SELECT_CATEGORY;

// Constantes para completar las rutas de la API.
const EQUIPO_API = 'services/admin/equipos.php';
const CUERPO_TECNICO_API = 'services/admin/cuerpo_tecnico.php';
const CATEGORIA_API = 'services/admin/categorias.php';

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
const openCreate = async () => {
    ID_EQUIPO.value = '';
    await fillSelect(CATEGORIA_API, 'readAll', 'categoriaEquipo');
    await fillSelect(CUERPO_TECNICO_API, 'readAll', 'cuerpoTecnico');
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear equipo';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    IMAGEN.src = '../../../resources/img/png/default.jpg';
}

// Funcion para preparar el formulario al momento de abrirlo
// Muestra el cuerpo tecnico del equipo

const seeModal = async (id) => {
    CUERPO_TECNICO.innerHTML = '';
    SEE_MODAL.show();
    MODAL_TITLE1.textContent = 'Cuerpo Técnico del equipo';
    const FORM = new FormData();
    FORM.append('idEquipo', id);
    const DATA = await fetchData(EQUIPO_API, 'readAllStaff', FORM);
    if (DATA.status) {
        DATA.dataset.forEach(ROW => {
            const completeName = ROW.nombre_tecnico + ' ' + ROW.apellido_tecnico;
            const tablaHtml = `
                <div class="col-sm-12 col-md-6 mb-3 text-center">
                    <div class="shadow rounded-3 p-3">
                        <img src="${SERVER_URL}images/tecnicos/${ROW.foto_tecnico}" height="60" width="65" class="circulo">
                        <p class="fw-semibold mb-2 mt-2">${ROW.nombre_rol_tecnico}</p>
                        <hr/>
                        <p class="mb-0">${completeName}</p>
                        <small class="fw-light">${ROW.correo_tecnico}</small>
                    </div>
                <div/>
                `;
            CUERPO_TECNICO.innerHTML += tablaHtml;
        })
    } else {
        await sweetAlert(3, DATA.error, true);
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
        FORM.append('idEquipo', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(EQUIPO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar equipo';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_EQUIPO.value = ROW.ID;
            NOMBRE_EQUIPO.value = ROW.NOMBRE;
            TELEFONO_EQUIPO.value = ROW.telefono_contacto;
            GENERO_EQUIPO.value = ROW.genero_equipo;
            await fillSelect(CATEGORIA_API, 'readAll', 'categoriaEquipo', ROW.id_categoria);
            await fillSelect(CUERPO_TECNICO_API, 'readAll', 'cuerpoTecnico', ROW.id_cuerpo_tecnico);
            IMAGEN.src = SERVER_URL + 'images/equipos/' + ROW.logo_equipo;
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar equipo';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el equipo?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idEquipo', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(EQUIPO_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await cargarTabla();
            } else {
                await sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}

// Manejo para la paginacion
const soccerTeamByPage = 10;
let currentPage = 1;
let soccerTeam = [];

function showSoccerTeam(page) {
    const start = (page - 1) * soccerTeamByPage;
    const end = start + soccerTeamByPage;
    const soccerTeamsPage = soccerTeam.slice(start, end);

    const fillTable = document.getElementById('tabla_equipos');
    fillTable.innerHTML = '';
    soccerTeamsPage.forEach(row => {
        const tablaHtml = `
               <tr>
                    <td><img src="${SERVER_URL}images/equipos/${row.logo_equipo}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.telefono_contacto}</td>
                    <td>${row.nombre_categoria}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn transparente" onclick="openUpdate(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                        </button>
                        <button type="button" class="btn transparente" onclick="openDelete(${row.ID})">
                            <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                        </button>
                    </td>
                </tr>
                `;
        fillTable.innerHTML += tablaHtml;
    });

    updatePaginate();
}

async function cargarTabla(form = null) {
    const cargarTabla = document.getElementById('tabla_equipos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(EQUIPO_API, action, form);

        if (DATA.status) {
            SELECT.value = 'Filtrar por género';
            soccerTeam = DATA.dataset;
            showSoccerTeam(currentPage);
        } else {
            await sweetAlert(3, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para actualizar los contlesiones de paginación
function updatePaginate() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(soccerTeam.length / soccerTeamByPage);

    if (currentPage > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${i})">${i}</a></li>`;
    }

    if (currentPage < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function nextPage(newPage) {
    currentPage = newPage;
    showSoccerTeam(currentPage);
}

//Funcion que permite filtrar a los jugadores por su genero.
const FilterByGender = async () => {

    const FORM = new FormData();
    FORM.append('generoEquipo', SELECT.value);

    const DATA = await fetchData(EQUIPO_API, 'readAllByGender', FORM);

    if (DATA.status) {
        soccerTeam = DATA.dataset;
        showSoccerTeam(currentPage);
    } else {
        console.log('Elige otra opción de filtrado')
    }
}

const openGraphic = async () => {
    SEE_GRAPHIC.show();
    MODAL_TITLE_GRAPHIC.textContent = 'Gráfico'
    await fillSelect(CATEGORIA_API, 'readAll', 'selectCategory');
}

const selectCategory = async () => {
    SELECT_CATEGORY = document.getElementById('selectCategory').value;

    console.log(SELECT_CATEGORY);
    const FORM = new FormData();
    FORM.append('idCategoria', SELECT_CATEGORY);

    const DATA = await fetchData(EQUIPO_API, 'countTeamsByCategory', FORM);
    console.log(DATA)
    if(DATA.status){
        SHOW_GRAPHIC.classList.add('d-none');
        let dataset = DATA.dataset;
        let total = [];
        let nombre = [];
        dataset.forEach(filter => {
            total.push(filter.total);
            nombre.push(filter.nombre_categoria);
        })
        barGraph('barGraphic', nombre, total, 'Total de equipos', 'Total de equipos por categorías')
    }else{
        console.log(DATA.error);
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const equiposHtml = await loadComponent('../components/soccer_team.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();

    // Agrega el HTML del encabezado
    appContainer.innerHTML = equiposHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Equipos';

    //Select para el filtrado por generos
    SELECT = document.getElementById('select');

    await cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle1')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_EQUIPO = document.getElementById('idEquipo'),
        NOMBRE_EQUIPO = document.getElementById('nombreEquipo'),
        TELEFONO_EQUIPO = document.getElementById('telefonoEquipo'),
        LOGO_EQUIPO = document.getElementById('imagenEquipo'),
        GENERO_EQUIPO = document.getElementById('generoEquipo'),
        IMAGEN = document.getElementById('img');

    SEE_GRAPHIC = new bootstrap.Modal('#seeGraphic'),
        MODAL_TITLE_GRAPHIC = document.getElementById('modalTitleGraphic');

    SHOW_GRAPHIC = document.getElementById('dnoneGraphic');

    // Constantes para ver los miembros del cuerpo tecnico
    CUERPO_TECNICO = document.getElementById('cuerpoTecnicoEquipo');


    // Agregamos el evento change al input de tipo file que selecciona la imagen
    LOGO_EQUIPO.addEventListener('change', function (event) {
        // Verifica si hay una imagen seleccionada
        if (event.target.files && event.target.files[0]) {
            // con el objeto FileReader lee de forma asincrona el archivo seleccionado
            const reader = new FileReader();
            // Luego de haber leido la imagen seleccionada se nos devuele un objeto de tipo blob
            // Con el metodo createObjectUrl de fileReader crea una url temporal para la imagen
            reader.onload = function (event) {
                // finalmente la url creada se le asigna al atributo src de la etiqueta img
                IMAGEN.src = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_EQUIPO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(EQUIPO_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            SELECT.value = 'Filtrar por género';
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            await cargarTabla();
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    });

    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');

    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);

        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        cargarTabla(FORM);
    });

    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoEquipo'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
};
