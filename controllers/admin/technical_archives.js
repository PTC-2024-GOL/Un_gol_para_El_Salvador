let SAVE_MODAL;
let SAVE_FORM,
    ID_DOCUMENTO,
    NOMBRE_ARCHIVO,
    ARCHIVO,
    FOTO;
let SEARCH_FORM;
let ROWS_FOUND;
let ZOOM_IMG;

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);
//Guarda en una variable el parametro obtenido
const TECNICO = PARAMS.get("id");

// Constantes para completar las rutas de la API.
const API = 'services/admin/documentos_tecnicos.php';

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
    MODAL_TITLE.textContent = 'Crear documento de técnico';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    FOTO.src = "../../../resources/img/png/default.jpg";
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
        FORM.append('idDocumento', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar un documento';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_DOCUMENTO.value = ROW.ID;
            NOMBRE_ARCHIVO.value = ROW.NOMBRE;
            FOTO.src = SERVER_URL.concat('images/archivos/', ROW.ARCHIVO);
            ZOOM_IMG.src = `${SERVER_URL}/images/archivos/${ROW.ARCHIVO}`;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar un documento';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el documento?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idDocumento', id);
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


// Variables y constantes para la paginación
const ArchivosPorPagina = 10;
let paginaActual = 1;
let Archivos = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_archivos');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        if(!form){
            form = new FormData();
            form.append('tecnico', TECNICO);
        }else{
            form.append('tecnico', TECNICO);
        }
        const DATA = await fetchData(API, 'readAll', form);
        console.log(DATA);

        if (DATA.status) {
            Archivos = DATA.dataset;
            mostrarArchivos(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para mostrar técnicos en una página específica
function mostrarArchivos(pagina) {
    const inicio = (pagina - 1) * ArchivosPorPagina;
    const fin = inicio + ArchivosPorPagina;
    const ArchivosPagina = Archivos.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_archivos');
    cargarTabla.innerHTML = '';
    ArchivosPagina.forEach(row => {
        const tablaHtml = `
            <tr>
                <td><img src="${SERVER_URL}images/archivos/${row.ARCHIVO}" height="50" width="50"></td>
                <td>${row.NOMBRE}</td>
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
        cargarTabla.innerHTML += tablaHtml;
    });

    actualizarPaginacion();
}

// Función para actualizar los controles de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(Archivos.length / ArchivosPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarArchivos(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/technical_archives.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    console.log(TECNICO);
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;

    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Archivos';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_DOCUMENTO = document.getElementById('idDocumento'),
        NOMBRE_ARCHIVO = document.getElementById('nombreArchivo'),
        FOTO = document.getElementById('img'),
        ARCHIVO = document.getElementById('archivo');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_DOCUMENTO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        FORM.append('tecnico', TECNICO);
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
        } else if (!DATA.exception) {
            sweetAlert(2, DATA.error, false);
        } else {
            sweetAlert(2, DATA.exception, false);
        }
    });

    // Cerrar el zoom de la imagen
    document.getElementById('closeZoom').addEventListener('click', function () {
        document.getElementById('imageZoom').style.display = 'none';
    });

    document.getElementById('img').addEventListener('click', function () {
        document.getElementById('imageZoom').style.display = 'block';
        SAVE_MODAL.hide();
    })

    ZOOM_IMG = document.getElementById('zoomImg');

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

    ARCHIVO.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                FOTO.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Descargar la imagen
    document.getElementById('downloadBtn').addEventListener('click', function () {
        let imageUrl = document.getElementById('img').src;
        let link = document.createElement('a');
        // Establecer la propiedad `href` del enlace con el URL de la imagen.
        // Esto define el destino del enlace, que es el archivo que queremos descargar.
        link.href = imageUrl;
        // Establecer el atributo `download` del enlace con el nombre deseado para el archivo descargado.
        link.download = `${NOMBRE_ARCHIVO.value}.jpg`;
        // Agregar el elemento `a` (enlace) al `body` del documento.
        document.body.appendChild(link);
        // Simular un clic en el enlace para iniciar la descarga del archivo.
        link.click();
        // Eliminar el enlace del `body` después de hacer clic en él.
        document.body.removeChild(link);
    });
};
