let SAVE_MODAL;
let SAVE_FORM,
    ID_USUARIO,
    NIVEL,
    HASH,
    PARAMETROS,
    FECHA_REGISTRO,
    CODE,
    PERMISO;

// Constantes para completar las rutas de la API.
const API = 'services/recuperacion/recuperacion.php';

window.onload = async function () {
    const BOTON = document.getElementById('boton');
    const INPUT1 = document.getElementById('password');
    const INPUT2 = document.getElementById('newpassword');
    PARAMETROS = new URLSearchParams(window.location.search);
    ID_USUARIO = PARAMETROS.get('id');
    NIVEL = PARAMETROS.get('n');
    HASH = PARAMETROS.get('c');
    console.log('Esto contiene el HASH: ' + HASH);
    
    // Obtener la fecha de registro desde el HASH y convertirla a objeto Date
    FECHA_REGISTRO = new Date(HASH.split('QQQ')[1]);
    CODE = HASH.split('QQQ')[0];
    console.log('Esto contiene la fecha de registro en UTC: ' + FECHA_REGISTRO.toISOString());

    // Obtener la fecha actual y convertirla a UTC
    const fechaActualUTC = new Date(new Date().toISOString());
    console.log('Esto contiene la fecha actual en UTC: ' + fechaActualUTC.toISOString());

    // Calcular la diferencia en milisegundos
    const diferencia = fechaActualUTC - FECHA_REGISTRO;
    console.log('Esto contiene la diferencia en segundos: ' + (diferencia / 60));

    // Verificar si la diferencia es mayor a 900000 milisegundos (15 minutos)
    if (diferencia > 900000) {
        PERMISO = 0;
        sweetAlert(2, 'El tiempo se agotó, generá un nuevo enlace.', false);
    } else {
        const FORM2 = new FormData();
        FORM2.append('idUsuario', ID_USUARIO);
        FORM2.append('nivel', NIVEL);
        const DATA2 = await fetchData(API, 'readHash', FORM2);
        if (DATA2.status) {
            PERMISO = 1;
            const resultado = DATA2.message;
            console.log('Esto contiene el recovery_code: ' + resultado);
            if (resultado == HASH) {
                PERMISO = 1;
            }
            else if (HASH == '0000') {
                PERMISO = 0;
                
                sweetAlert(2, 'Este Link ya ha sido utilizado, genera un nuevo enlace.', false);
                
            } else {
                PERMISO = 0;
                sweetAlert(2, 'Este enlace ya no esta disponible, ingresa al último correo recibido de recuperación de contraseña.', false);
            }
        } else {
            PERMISO = 0;
            sweetAlert(2, 'Enlace corrompido', false);
        }
    }

    BOTON.addEventListener('click', async (event) => {
        if (INPUT1.value === '' || INPUT2.value === '') {
            sweetAlert(2, 'El campo de contraseña no puede estar vacío.', false);
            return false;
        }
        if (PERMISO === 0) {
            sweetAlert(2, 'Enlace corrompido, generá un nuevo link', false);
            return false;
        }
        if (INPUT1.value === INPUT2.value) {
            event.preventDefault();
            const FORM = new FormData();
            FORM.append('clave', INPUT1.value);
            FORM.append('nivel', NIVEL);
            ID_USUARIO = parseInt(ID_USUARIO);
            FORM.append('idUsuario', ID_USUARIO);
            const DATA = await fetchData(API, 'updatePass', FORM);
            if (DATA.status) {
                if (NIVEL == 1) {
                    sweetAlert(1, DATA.message, true, `../pages/index.html`);
                    //window.location.href = `../pages/index.html`;
                }
                else if (NIVEL == 2) {
                    sweetAlert(1, DATA.message, true, `../../technicals/pages/index.html`);
                    //window.location.href = `../../technicals/pages/index.html`;
                }
                else if (NIVEL == 3) {
                    console.log('Ni de pedo bro: ' + NIVEL);
                }
            } else {
                sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        }
        else {
            sweetAlert(2, 'Las contraseñas no coinciden.', false);
            return false;
        }
    });
};

