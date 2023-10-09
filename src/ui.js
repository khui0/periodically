// 1.0.0

import "./modal.css";

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
        buttonContainer.append(
            new Element("button", button.text, {
                click: () => {
                    button.close && dialog.close();
                    button.onclick && button.onclick();
                },
            }).element
        );
    });

    options.title && dialog.append(new Element("h2", options.title).element);
    dialog.innerHTML += options.body;
    (options.buttons?.length > 0) && dialog.append(buttonContainer);

    document.body.append(dialog);
    dialog.showModal();

    options.blur && buttonContainer.querySelectorAll("button").forEach(button => button.blur());

    dialog.addEventListener("close", () => {
        dialog.remove();
    });

    return dialog;
}

// TODO: Clean up function
export function show(dialog, title, buttons, blur) {
    const titleElement = new Element("h2", title).element;

    const buttonContainer = document.createElement("div");
    buttons.forEach(button => {
        buttonContainer.append(
            new Element("button", button.text, {
                click: () => {
                    button.close && dialog.close();
                    button.onclick && button.onclick();
                },
            }).element
        );
    });

    dialog.open && dialog.close();

    title && dialog.prepend(titleElement);
    (buttons?.length > 0) && dialog.append(buttonContainer);

    dialog.showModal();

    blur && buttonContainer.querySelectorAll("button").forEach(button => button.blur());

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