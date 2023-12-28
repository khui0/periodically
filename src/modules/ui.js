// 1.2.0

import "./ui.css";

export function alert(title, text, callback, blur) {
    modal({
        title,
        body: new Element("p", text).element.outerHTML,
        buttons: [{
            text: "Close",
            close: true,
            onclick: callback,
        }],
        blur,
    });
}

export function prompt(title, text, buttons, blur) {
    modal({
        title,
        body: new Element("p", text).element.outerHTML,
        buttons,
        blur,
    });
}

export function modal(options) {
    const dialog = document.createElement("dialog");

    const buttonContainer = document.createElement("div");
    options.buttons.forEach(button => {
        const element = new Element("button", button.text, {
            click: () => {
                button.close && dialog.close();
                button.onclick && button.onclick();
            },
        }).element;
        if (button.danger) {
            element.style.setProperty("--accent-color", "var(--error-color)");
        }
        buttonContainer.append(element);
    });

    options.title && dialog.append(new Element("h2", options.title).element);
    dialog.innerHTML += options.body;
    (options.buttons?.length > 0) && dialog.append(buttonContainer);

    document.body.append(dialog);
    dialog.showModal();

    if (options.blur) {
        buttonContainer.querySelectorAll("button").forEach(button => button.blur());
    } else {
        buttonContainer.querySelector("button").focus();
    }

    dialog.addEventListener("close", () => {
        dialog.remove();
    });

    return dialog;
}

export function show(dialog, title, buttons, blur) {
    const titleElement = new Element("h2", title).element;

    const buttonContainer = document.createElement("div");
    buttons.forEach(button => {
        const element = new Element("button", button.text, {
            click: () => {
                button.close && dialog.close();
                button.onclick && button.onclick();
            },
        }).element;
        if (button.danger) {
            element.style.setProperty("--accent-color", "var(--error-color)");
        }
        buttonContainer.append(element);
    });

    dialog.open && dialog.close();

    title && dialog.prepend(titleElement);
    (buttons?.length > 0) && dialog.append(buttonContainer);

    dialog.showModal();

    if (blur) {
        buttonContainer.querySelectorAll("button").forEach(button => button.blur())
    } else {
        buttonContainer.querySelector("button").focus();
    }

    dialog.addEventListener("close", () => {
        titleElement.remove();
        buttonContainer.remove();
    });
}

export class Element {
    constructor(tag, text, events) {
        this.tag = tag;
        this.text = text;
        this.events = events;
    }

    get element() {
        const element = document.createElement(this.tag);
        element.textContent = this.text;
        this.events && Object.keys(this.events).forEach(type => {
            const listener = this.events[type];
            element.addEventListener(type, listener);
        });
        return element;
    }
}

// Add hover events
export function addHover(element) {
    let visible = false;
    element.addEventListener("mouseover", e => {
        element.classList.add("hover");
        visible = true;
    });
    element.addEventListener("mouseout", e => {
        element.classList.remove("hover");
        visible = false;
    });
    element.addEventListener("click", e => {
        if (!visible) {
            element.classList.add("hover");
            visible = true;
        }
        else {
            element.classList.remove("hover");
            visible = false;
        }
    });
}

// Fade element in
export function fadeIn(element, duration = 100, callback) {
    element.animate([
        { opacity: 0 },
        { opacity: 1 },
    ], {
        duration,
        fill: "forwards",
    });
    callback && setTimeout(callback, duration);
}

// Fade element out
export function fadeOut(element, duration = 100, callback) {
    element.animate([
        { opacity: 1 },
        { opacity: 0 },
    ], {
        duration,
        fill: "forwards",
    });
    callback && setTimeout(callback, duration);
}