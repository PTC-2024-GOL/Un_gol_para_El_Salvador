async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Constante para establecer el formulario de inicio de sesión.
let LOGIN_FORM;
let MODAL;
let CODE;
let FORM;

//Funcion que obtiene el codigo ingresado por el usuario y manda la peticion a la api.
//Verifica si el codigo es correcto, de lo contrario no lo deja iniciar sesion
const getCode = async () => {
    CODE = document.getElementById('code').value;

    if(CODE.length !== 6) {
        await sweetAlert(2, "El código debe tener exactamente 6 dígitos", false);
    }else{
        //Agregamos al form el codigo ingresado.
        FORM.append('code', CODE);

        //Hace la peticion al servicio.
        const DATA = await fetchData(USER_API, 'logIn', FORM);
        //Si viene bien entonces inicia sesion, de lo contrario le tira el error.
        if(DATA.status) {
            await sweetAlert(1, DATA.message, true, 'dashboard.html');
        }else{
            await sweetAlert(2, DATA.error, false);
        }
    }
}

window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/index.html');

    appContainer.innerHTML = adminHtml;

    //Obtenemos el valor del modal.
    MODAL = new bootstrap.Modal('#2faModal');

    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(USER_API, 'readUsers');
    // Se comprueba si existe una sesión, de lo contrario se sigue con el flujo normal.
    console.log(USER_API, 'Esta es la href de la api');
    console.log(DATA, 'Estoy en el loginnnnnnnnnnnnnn');
    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Se mantiene en el login.
        console.log('Formulario para iniciar sesión');
        LOGIN_FORM = document.getElementById('loginForm');
        // Método del evento para cuando se envía el formulario de inicio de sesión.
        LOGIN_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Constante tipo objeto con los datos del formulario.
            FORM = new FormData(LOGIN_FORM);
            console.log('Acabo de presionar el boton de login');
            try {
                // Petición para iniciar sesión.
                const DATA2 = await fetchData(USER_API, 'logIn', FORM);
                console.log(DATA2, 'Estoy en el login dentro del tryyyyyyyyyyyy');
                //Se verifica si hay 2FA activado, si lo esta entonces se lo pedira, pero sino ingresara sesion normalmente.
                if(DATA2.TwoFA_required){
                    MODAL.show();
                }else{
                    //Verifica que la respuesta venga bien, si las credenciales son correctas, de ser asi lo deja iniciar sesion
                    //sino le tira el error.
                    console.log(DATA2, 'Estoy en el else del login');
                    if (DATA2.status) {
                        await sweetAlert(1, DATA2.message, true, 'dashboard.html');
                    } else {
                        await sweetAlert(2, DATA2.error, false);
                        console.log(DATA2.exception);
                    }
                }
            } catch {
                sweetAlert(2, "No se detecta un usuario", false);
            }
        });

    } else {
        // Se direcciona a la página web del primer uso.
        location.href = 'first_user.html';
        sweetAlert(4, DATA.error, true);
    }

    vanillaTextMask.maskInput({
        inputElement: document.getElementById('code'),
        mask: [/\d/, /\d/, /\d/,/\d/, /\d/, /\d/]
    });
};
