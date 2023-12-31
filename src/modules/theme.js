window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateColors);
document.addEventListener("settingchange", update);

update();

function update() {
    disableTransitions();
    updateColors();
    updateBackground();
    updateFont();
    updateDetails();
    enableTransitions();
}

function updateColors() {
    const setting = localStorage.getItem("periodically-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    switch (setting) {
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
    const setting = localStorage.getItem("periodically-background") || "default";
    document.querySelectorAll(".list").forEach(list => {
        list.classList.remove("fill");
        list.classList.remove("outline");
        switch (setting) {
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

function updateFont() {
    const setting = localStorage.getItem("periodically-font-weight") || "normal";
    document.querySelectorAll(".list").forEach(list => {
        switch (setting) {
            case "normal": {
                list.classList.remove("bold");
                break;
            }
            case "bold": {
                list.classList.add("bold");
                break;
            }
        }
    });
}

function updateDetails() {
    const setting = localStorage.getItem("periodically-details") || "default";
    document.querySelectorAll(".list").forEach(list => {
        switch (setting) {
            case "default": {
                list.classList.remove("multiline");
                break;
            }
            case "multiline": {
                list.classList.add("multiline");
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