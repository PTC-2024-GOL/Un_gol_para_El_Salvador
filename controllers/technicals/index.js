// Constantes para completar las rutas de la API.
const TECNICO_API = 'services/technics/tecnicos.php';


async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/index.html');

    appContainer.innerHTML = adminHtml;
    
    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(TECNICO_API, 'readUsers');
    // Se comprueba si existe una sesión, de lo contrario se sigue con el flujo normal.
    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Se mantiene en el login.
        LOGIN_FORM = document.getElementById('loginForm');
        // Método del evento para cuando se envía el formulario de inicio de sesión.
        LOGIN_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(LOGIN_FORM);
            try {
                // Petición para iniciar sesión.
                const DATA = await fetchData(TECNICO_API, 'logIn', FORM);
                console.log(DATA);
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (DATA.status) {
                    sweetAlert(1, DATA.message, true, 'dashboard.html');
                } else {
                    sweetAlert(2, DATA.error, false);
                    console.log(DATA.exception);
                }
            } catch {
                sweetAlert(2, "No se detecta un usuario", false);
            }
        });

    } else {
        sweetAlert(4, DATA.error, true);
    }
};
