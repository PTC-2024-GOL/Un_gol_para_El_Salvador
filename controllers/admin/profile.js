let SAVE_MODAL;
let SAVE_FORM,
    ACTUAL_ADMINISTRADOR,
    CLAVE_ADMINISTRADOR,
    REPETIR_CLAVE;

let EDIT_MODAL;
let EDIT_FORM,
    ID_PERFIL,
    NOMBRE_PERFIL,
    APELLIDO_PERFIL,
    CORREO_PERFIL,
    TELEFONO_PERFIL,
    DUI_PERFIL,
    NACIMIENTO_PERFIL,
    FOTO_PERFIL,
    IMAGEN_PERFIL;

    
// Constantes para completar las rutas de la API.
const ADMINISTRADOR_API = 'services/admin/administradores.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const openPassword = () => {
    // Se abre la caja de diálogo que contiene el formulario.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Cambiar tu contraseña';
    // Se restauran los elementos del formulario.
    SAVE_FORM.reset();
}

async function openProfile() {
    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(ADMINISTRADOR_API, 'readProfile');
    console.log(DATA);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se colocan los datos en la página web de acuerdo con el producto seleccionado previamente.
        document.getElementById('foto').src = SERVER_URL.concat('images/administradores/', DATA.dataset.IMAGEN);
        document.getElementById('nombre').textContent = DATA.dataset.NOMBRE;
        document.getElementById('email').textContent = DATA.dataset.CORREO;
        document.getElementById('phone').textContent ='(+503) '+ DATA.dataset.TELÉFONO;
    } 
}



const openEdit = async (id) => {

    try {
        // Se define un objeto con los datos del registro seleccionado.
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ADMINISTRADOR_API, 'readOneProfile');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            EDIT_MODAL.show();
            EDIT_TITLE.textContent = 'Editar perfil';
            // Se restauran los elementos del formulario.
            EDIT_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            NOMBRE_PERFIL.value = ROW.NOMBRE;
            APELLIDO_PERFIL.value = ROW.APELLIDO;
            CORREO_PERFIL.value = ROW.CORREO;
            TELEFONO_PERFIL.value = ROW.TELÉFONO;
            DUI_PERFIL.value = ROW.DUI;
            NACIMIENTO_PERFIL.value = ROW.NACIMIENTO;
            FOTO_PERFIL.src = SERVER_URL.concat('images/administradores/', ROW.IMAGEN);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        EDIT_MODAL.show();
        EDIT_TITLE.textContent = 'Editar perfil';
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Obtiene el contenedor principal
    loadTemplate();

    const profileHtml = await loadComponent('../components/profile.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += profileHtml;

    openProfile();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ACTUAL_ADMINISTRADOR = document.getElementById('claveActual'),
        CLAVE_ADMINISTRADOR = document.getElementById('claveAdministrador'),
        REPETIR_CLAVE = document.getElementById('repetirclaveAdministrador');

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ADMINISTRADOR_API, 'changePassword', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });

    
    EDIT_MODAL = new bootstrap.Modal('#editModal'),
        EDIT_TITLE = document.getElementById('modalTitleEdit');


    // Constantes para establecer los elementos del formulario de guardar.
    EDIT_FORM = document.getElementById('editForm'),
        NOMBRE_PERFIL = document.getElementById('nombrePerfil'),
        APELLIDO_PERFIL = document.getElementById('apellidoPerfil'),
        CORREO_PERFIL = document.getElementById('correoPerfil'),
        TELEFONO_PERFIL = document.getElementById('telefonoPerfil'),
        DUI_PERFIL = document.getElementById('duiPerfil'),
        NACIMIENTO_PERFIL = document.getElementById('fechanacimientoPerfil'),
        FOTO_PERFIL = document.getElementById('imagenJugador'),
        IMAGEN_PERFIL = document.getElementById('imagen_jugador');

    // Método del evento para cuando se envía el formulario de guardar.
    EDIT_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(EDIT_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ADMINISTRADOR_API, 'updateRowProfile', FORM);
        console.log(DATA.status);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            EDIT_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true, 'profile.html');
            
            openProfile(); 
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });

    IMAGEN_PERFIL.addEventListener('change', function (event) {
        // Verifica si hay una imagen seleccionada
        if (event.target.files && event.target.files[0]) {
            // con el objeto FileReader lee de forma asincrona el archivo seleccionado
            const reader = new FileReader();
            // Luego de haber leido la imagen seleccionada se nos devuele un objeto de tipo blob
            // Con el metodo createObjectUrl de fileReader crea una url temporal para la imagen
            reader.onload = function (event) {
                // finalmente la url creada se le asigna al atributo src de la etiqueta img
                FOTO_PERFIL.src = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoPerfil'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    // Llamada a la función para establecer la mascara del campo DUI.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('duiPerfil'),
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    });



};