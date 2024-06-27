// Constante para establecer el formulario de inicio de sesión.
let SAVE_FORM,
    FOTO,
    IMAGEN;
// Constante para completar la ruta de la API.


async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const cambiarregistro = await loadComponent('../components/first_user.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = cambiarregistro;



    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoAdministrador'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    // Llamada a la función para establecer la mascara del campo DUI.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('duiAdministrador'),
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    });

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        FOTO = document.getElementById('img_admin'),
        IMAGEN = document.getElementById('imagenAdministrador');

    
        IMAGEN.addEventListener('change', function (event) {
        // Verifica si hay una imagen seleccionada
        if (event.target.files && event.target.files[0]) {
            // con el objeto FileReader lee de forma asincrona el archivo seleccionado
            const reader = new FileReader();
            // Luego de haber leido la imagen seleccionada se nos devuele un objeto de tipo blob
            // Con el metodo createObjectUrl de fileReader crea una url temporal para la imagen
            reader.onload = function (event) {
                // finalmente la url creada se le asigna al atributo src de la etiqueta img
                FOTO.src = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(USER_API, 'readUsers');
    // Se comprueba si existe una sesión, de lo contrario se sigue con el flujo normal.
    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Se direcciona a la página web del login.
        location.href = 'index.html';
        sweetAlert(4, DATA.error, true);
    } else {
        // Se mantiene en el primer uso.
        SAVE_FORM = document.getElementById('saveForm');
        // Método del evento para cuando se envía el formulario de inicio de sesión.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM);
            // Petición para iniciar sesión.
            const DATA = await fetchData(USER_API, 'signUp', FORM);
            console.log(DATA);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                sweetAlert(1, DATA.message, true, 'index.html');
           } else {
                sweetAlert(2, DATA.error, false);
            }
        });
    }


};