async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/index.html');

    appContainer.innerHTML = adminHtml;
    
};
