window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);
document.addEventListener("settingchange", updateTheme);

updateTheme();

function updateTheme() {
    disableTransitions();
    const theme = localStorage.getItem("periodically-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    switch (theme) {
        case "light": {
            document.body.classList.remove("theme-dark");
            break;
        }
        case "dark": {
            document.body.classList.add("theme-dark");
            break;
        }
        default: {
            prefersDark ? document.body.classList.add("theme-dark") : document.body.classList.remove("theme-dark");
        }
    }
    enableTransitions();
}

export function enableTransitions() {
    document.body.offsetHeight;
    document.body.classList.add("enable-transitions");
}

export function disableTransitions() {
    document.body.classList.remove("enable-transitions");
}