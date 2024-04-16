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
    
};
