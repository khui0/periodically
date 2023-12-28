window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);
document.addEventListener("settingchange", update);

update();

function update() {
    disableTransitions();
    updateTheme();
    updateBackground();
    enableTransitions();
}

function updateTheme() {
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
}

function updateBackground() {
    const style = localStorage.getItem("periodically-background") || "default";
    document.querySelectorAll(".list").forEach(list => {
        list.classList.remove("fill");
        list.classList.remove("outline");
        switch (style) {
            case "fill": {
                list.classList.add("fill");
                break;
            }
            case "outline": {
                list.classList.add("outline");
                break;
            }
        }
    });
}

export function enableTransitions() {
    document.body.offsetHeight;
    document.body.classList.add("enable-transitions");
}

export function disableTransitions() {
    document.body.classList.remove("enable-transitions");
}