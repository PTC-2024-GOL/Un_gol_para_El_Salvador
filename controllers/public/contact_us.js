// Constantes para completar las rutas de la API.
const API = 'services/public/contactanos.php';

//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

async function envioCorreo() {
    const NOMBRE = document.getElementById('nombre');
    const CORREO = document.getElementById('correo');
    const MENSAJE = document.getElementById('mensaje');

    if (NOMBRE.value === '' || CORREO.value === '' || MENSAJE.value === '') {
        sweetAlert(2, 'El formulario no puede tener campos vacíos.', false);
        return false;
    }
    event.preventDefault();

    const FORM = new FormData();
    FORM.append('nombre', NOMBRE.value);
    FORM.append('correo', CORREO.value);
    FORM.append('mensaje', MENSAJE.value);
    const DATA = await fetchData(API, 'envioCorreo', FORM);
    if (DATA.status) {
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
        console.error(DATA.exception);
    }
}


// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const homeHtml = await loadComponent('../components/contact_us.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = homeHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Contáctanos';
};