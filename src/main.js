import "./reset.css";
import "./style.css";
import "./periodically.css";
import "remixicon/fonts/remixicon.css";

import { v4 as uuidv4 } from "uuid";
import pluralize from "pluralize";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

import * as time from "./modules/time.js";
import * as ui from "./modules/ui.js";
import "./modules/theme.js";
import "./modules/settings.js";

let data = JSON.parse(localStorage.getItem("periodically-data")) || [];
let archive = JSON.parse(localStorage.getItem("periodically-archive")) || [];

updateTasks();
setInterval(updatePastDue, 100);
updateClock();
setInterval(updateClock, 100);

document.getElementById("details").addEventListener("input", updateDetailsHeight);

// Automatically fit details textarea to lines
function updateDetailsHeight() {
    const element = document.getElementById("details");
    const minHeight = linesToPx(document.getElementById("details"), 3);
    const maxHeight = linesToPx(document.getElementById("details"), 10);
    element.style.height = 0;
    element.style.height = Math.min(Math.max(element.scrollHeight, minHeight), maxHeight) + "px";
}

// Calculate height of element required to fit a number of lines
function linesToPx(element, lines) {
    const styles = window.getComputedStyle(element);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    const lineHeight = parseFloat(styles.lineHeight);
    return (lines * lineHeight) + paddingTop + paddingBottom;
}

// Keyboard shortcuts
document.addEventListener("keydown", e => {
    if (document.activeElement == document.body) {
        const input = document.getElementById("create-input");
        const modifiers = e.ctrlKey || e.altKey;
        const allowed = [
            "Enter",
            "Backspace",
        ];
        if (!modifiers && e.key && e.key.length === 1 || allowed.includes(e.key)) {
            input.focus();
        }
    }
    else if (document.getElementById("create-modal").hasAttribute("open")) {
        if (e.ctrlKey && e.key == "Enter") {
            createTask();
        }
    }
});

// Show create task modal
document.getElementById("create-input").addEventListener("keydown", e => {
    if (e.key != "Enter") {
        return;
    }
    // Transfer title to modal
    document.getElementById("title").value = e.target.value;
    e.target.value = "";
    // Clear details
    document.getElementById("details").value = "";
    // Set default date
    document.getElementById("date").value = time.endOfToday();
    // Show modal
    ui.show(document.getElementById("create-modal"), "Create", [
        {
            text: "Cancel",
            close: true,
        },
        {
            text: "Create",
            close: true,
            onclick: createTask,
        },
    ]);
});

// Create new task
function createTask() {
    const title = document.getElementById("title").value;
    const details = document.getElementById("details").value;
    const date = document.getElementById("date").value;
    if (title?.trim() && date?.trim()) {
        const uuid = setTask(title, details, date);
        const index = data.findIndex(item => item.uuid == uuid);
        const element = appendTask(index, uuid, title, time.timeToString(date), details);
        ui.fadeIn(element);
        updateStatus();
        document.getElementById("create-modal").close();
        document.getElementById("create-input").blur();
    }
}

// Add task to data array
function setTask(title, details, timestamp, uuid) {
    const item = {
        "title": title.trim(),
        "details": details.trim(),
        "timestamp": timestamp || Date.now(),
        "uuid": uuid || uuidv4(),
    };
    // Replace item if it already exists
    const existing = data.findIndex(item => item.uuid == uuid);
    if (existing != -1) {
        data.splice(existing, 1, item);
    }
    else {
        data.push(item);
    }
    // Sort data by date
    data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));
    localStorage.setItem("periodically-data", JSON.stringify(data));
    return item.uuid;
}

// Append task to data list
function appendTask(index, uuid, title, date, details) {
    const list = document.getElementById("task-list");
    const task = document.createElement("div");
    task.setAttribute("data-uuid", uuid);
    task.innerHTML = `<h2>${title}</h2>
<p data-date>${date}</p>
<p>${details && insertAnchors(details)}</p>
<div class="controls">
    <button class="icon" data-complete><i class="ri-check-line"></i></button>
    <button class="icon" data-edit><i class="ri-edit-line"></i></button>
    <button class="icon" data-delete><i class="ri-delete-bin-2-line"></i></button>
</div>`;
    list.insertBefore(task, list.childNodes[index]);
    addEvents(task);
    return task;
}

// Add events to task
function addEvents(element) {
    ui.addHover(element);
    // Button click events
    const controls = element.querySelector("div.controls");
    const uuid = element.getAttribute("data-uuid");
    // Mark task as complete
    controls.querySelector("[data-complete]").addEventListener("click", e => {
        // Remove task from data list
        ui.fadeOut(element, 500, () => { element.remove() });
        // Add item to archive array
        archive.push(data.find(item => item.uuid == uuid));
        localStorage.setItem("periodically-archive", JSON.stringify(archive));
        // Remove item from data array
        data = data.filter(item => item.uuid != uuid);
        localStorage.setItem("periodically-data", JSON.stringify(data));
        updateStatus();
    });
    // Edit task
    controls.querySelector("[data-edit]").addEventListener("click", () => {
        const task = data.find(item => item.uuid == uuid);
        // Fill fields with task details
        document.getElementById("title").value = task.title;
        document.getElementById("details").value = task.details;
        document.getElementById("date").value = task.timestamp;
        // Show modal
        ui.show(document.getElementById("create-modal"), "Edit", [
            {
                text: "Cancel",
                close: true,
            },
            {
                text: "Edit",
                close: true,
                onclick: () => {
                    const title = document.getElementById("title").value;
                    const details = document.getElementById("details").value;
                    const date = document.getElementById("date").value;
                    // Remove existing element
                    element.remove();
                    // Set new item
                    setTask(title, details, date, task.uuid);
                    // Append new element
                    const index = data.findIndex(item => item.uuid == task.uuid);
                    appendTask(index, task.uuid, title, time.timeToString(date), details);
                },
            },
        ]);
        updateStatus();
        updateDetailsHeight();
    });
    // Delete task
    controls.querySelector("[data-delete]").addEventListener("click", () => {
        const task = data.find(item => item.uuid == uuid);
        const title = task.title.substring(0, 64) + (task.title.length > 64 ? "..." : "");
        ui.prompt(`Delete task?`, `Are you sure you want to delete ${title}?`, [
            {
                text: "Cancel",
                close: true,
            },
            {
                text: "Delete",
                close: true,
                onclick: deleteTask,
                danger: true,
            },
        ]);
        function deleteTask() {
            // Remove task from data list
            ui.fadeOut(element, 100, () => { element.remove() });
            // Remove item from data array
            data = data.filter(item => item.uuid != uuid);
            localStorage.setItem("periodically-data", JSON.stringify(data));
            updateStatus();
        }
    });
}

// Update data list
function updateTasks() {
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        appendTask(i, item.uuid, item.title, time.timeToString(item.timestamp), item.details);
    }
    updateStatus();
}

// Update status to show remaining tasks
function updateStatus() {
    const status = document.getElementById("status");
    status.textContent = pluralize("task", data.length, true);
    document.title = `Periodically - ${pluralize("task", data.length, true)}`;
}

// Update clock
function updateClock() {
    const time = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
    document.getElementById("time").textContent = time;
}

// Update past due tasks
function updatePastDue() {
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (Date.now() > new Date(item.timestamp).getTime()) {
            document.querySelector(`[data-uuid="${item.uuid}"]>[data-date]`).classList.add("warning");
        }
    }
}

// Replace links with anchor elements
function insertAnchors(html) {
    const regex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/g;
    const p1 = html.replaceAll("&amp;", "&").split(regex);
    const p2 = html.replaceAll("&amp;", "&").match(regex);
    html = "";
    for (let i = 0; i < p1.length; i++) {
        html += p1[i];
        if (i < p1.length - 1) {
            html += `<a href="${p2[i]}">${p2[i]}</a>`;
        }
    }
    return html;
}

let screenshot;

// Show share modal
document.getElementById("share").addEventListener("click", () => {
    const output = document.getElementById("screenshot-output");
    const element = document.getElementById("task-list").cloneNode(true);
    element.removeAttribute("id");
    element.classList.add("screenshot-mode");
    document.body.append(element);

    const height = element.getBoundingClientRect().height;

    html2canvas(element, {
        scale: 1,
        height: Math.floor(height),
    }).then(canvas => {
        canvas.toBlob(blob => {
            screenshot = blob;
        })
        output.src = canvas.toDataURL();
    });

    element.remove();

    ui.show(document.getElementById("share-modal"), "Share", [
        {
            text: "Close",
            close: true,
        },
    ]);
});

// Download blob
document.getElementById("screenshot-download").addEventListener("click", () => {
    saveAs(screenshot, "periodically.png");
});

// Copy blob
document.getElementById("screenshot-copy").addEventListener("click", () => {
    try {
        navigator.clipboard.write([
            new ClipboardItem({
                "image/png": screenshot,
            }),
        ]);
    } catch (e) {

    }
});


// Show archive modal
document.getElementById("archive").addEventListener("click", () => {
    ui.show(document.getElementById("archive-modal"), "Archive", [
        {
            text: "Close",
            close: true,
        },
    ]);
    updateArchive();
});

// Update archive list
function updateArchive() {
    const list = document.getElementById("archive-list");
    list.innerHTML = "";
    for (let i = 0; i < archive.length; i++) {
        const item = archive[i];
        item && appendArchive(item.uuid, item.title, time.timeToString(item.timestamp), item.details);
    }
}

// Append element to archive list
function appendArchive(uuid, title, date, details) {
    const list = document.getElementById("archive-list");
    const task = document.createElement("div");
    task.setAttribute("data-uuid", uuid);
    task.innerHTML = `<h2>${title}</h2>
<p>${date}</p>
<p>${details}</p>
<div class="controls">
    <button class="icon" data-restore><i class="ri-arrow-go-back-line"></i></button>
    <button class="icon" data-delete><i class="ri-delete-bin-2-line"></i></button>
</div>`;
    list.prepend(task);
    // Add events
    {
        ui.addHover(task);
        // Button click events
        const controls = task.querySelector("div.controls");
        const uuid = task.getAttribute("data-uuid");
        // Restore task
        controls.querySelector("[data-restore]").addEventListener("click", () => {
            const task = archive.find(item => item.uuid == uuid);
            // Remove item from archive array
            archive = archive.filter(item => item.uuid != uuid);
            localStorage.setItem("periodically-archive", JSON.stringify(archive));
            // Append task to data list
            setTask(task.title, task.details, task.timestamp, uuid);
            const index = data.findIndex(item => item.uuid == uuid);
            const element = appendTask(index, uuid, task.title, time.timeToString(task.timestamp), task.details);
            ui.fadeIn(element);
            // Close modal
            document.getElementById("archive-modal").close();
            updateStatus();
        });
        // Delete task
        controls.querySelector("[data-delete]").addEventListener("click", () => {
            // Remove task from archive list
            ui.fadeOut(task, 100, () => { task.remove() });
            // Remove item from archive array
            archive = archive.filter(item => item.uuid != uuid);
            localStorage.setItem("periodically-archive", JSON.stringify(archive));
        });
    }
    return task;
}

// Show settings modal
document.getElementById("settings").addEventListener("click", () => {
    ui.show(document.getElementById("settings-modal"), "Settings", [
        {
            text: "Close",
            close: true,
        }
    ]);
});

// Clear data
document.getElementById("reset-tasks").addEventListener("click", () => {
    ui.prompt("Clear tasks?", "This will permanently remove your saved tasks!", [
        {
            text: "Cancel",
            close: true,
        },
        {
            text: "Clear",
            close: true,
            onclick: () => {
                data = [];
                localStorage.setItem("periodically-data", "[]");
                location.reload();
            },
            danger: true,
        },
    ]);
});

// Clear archive
document.getElementById("reset-archive").addEventListener("click", () => {
    ui.prompt("Clear archive?", "This will permanently remove your archived tasks!", [
        {
            text: "Cancel",
            close: true,
        },
        {
            text: "Clear",
            close: true,
            onclick: () => {
                archive = [];
                localStorage.setItem("periodically-archive", "[]");
                location.reload();
            },
            danger: true,
        },
    ]);
});